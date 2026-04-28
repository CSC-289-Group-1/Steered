from concurrent.futures import ThreadPoolExecutor, as_completed

from flask import Flask, redirect, render_template, request, session, url_for
from flask_caching import Cache
import os
from werkzeug.security import check_password_hash, generate_password_hash

from . import db
from .services.books_service import (
    dedupe_by_id,
    fetch_book_details_by_id,
    fetch_books_by_author,
    fetch_books_by_author_light,
    fetch_books_by_genre,
    fetch_books_by_genre_light,
    fetch_trending_books,
    search_books,
    supported_genres,
)

app = Flask(__name__, instance_relative_config=True)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-change-me')
app.config['DATABASE'] = os.path.join(app.instance_path, 'steered.sqlite')
app.config['CACHE_TYPE'] = 'SimpleCache'
app.config['CACHE_DEFAULT_TIMEOUT'] = 300

os.makedirs(app.instance_path, exist_ok=True)
db.init_app(app)
cache = Cache(app)


@cache.cached(timeout=300, key_prefix="trending")
def get_trending():
    return fetch_trending_books()


@cache.memoize(timeout=300)
def get_books_by_genre(genre):
    return fetch_books_by_genre(genre)


@cache.memoize(timeout=300)
def get_book_details(book_id):
    return fetch_book_details_by_id(book_id)


@cache.memoize(timeout=300)
def get_search_results(query):
    return search_books(query)


@cache.memoize(timeout=300)
def get_books_by_author(author):
    return fetch_books_by_author(author)


@app.context_processor
def inject_user():
    return {"current_user": session.get("username")}


def create_app():
    return app


@app.route("/")
def home():
    genre = request.args.get("genre", "All")
    status = "success"
    error = ""
    books = []

    try:
        if genre == "All":
            books = get_trending()
        else:
            books = get_books_by_genre(genre)
    except Exception as exc:
        status = "error"
        error = str(exc)

    book_of_day = books[0] if books else None
    showcase_books = books[1:10] if len(books) > 1 else []

    return render_template(
        "home.html",
        page="home",
        theme=request.cookies.get("steered-theme", "light"),
        genre=genre,
        supported_genres=supported_genres(),
        status=status,
        error=error,
        book_of_day=book_of_day,
        showcase_books=showcase_books,
    )


@app.route("/search")
def search():
    query = request.args.get("q", "").strip()
    status = "success"
    error_message = ""
    books = []

    try:
        books = get_search_results(query) if query else get_trending()
    except Exception as exc:
        status = "error"
        error_message = str(exc)

    section_title = f"Results for “{query}”" if query else "Trending recommendations"

    return render_template(
        "search.html",
        page="search",
        theme=request.cookies.get("steered-theme", "light"),
        query=query,
        status=status,
        error_message=error_message,
        section_title=section_title,
        display_books=books[:18],
    )


@app.route("/book/<path:book_id>")
def book_preview(book_id):
    initial = {
        "id": book_id or "",
        "title": request.args.get("title", "Untitled"),
        "authors": request.args.get("authors", "Unknown"),
        "year": request.args.get("year", "N/A"),
        "isbn": "N/A",
        "coverImage": request.args.get("cover", "https://via.placeholder.com/280x360?text=Book"),
        "previewLink": request.args.get("link", "https://openlibrary.org/"),
        "previewEmbedUrl": "",
        "hasPreview": False,
        "description": request.args.get("description", "No description available yet for this book."),
        "categories": [],
        "rating": "N/A",
        "excerpt": "No excerpt available.",
    }

    details_status = "success"
    details_error = ""
    book = initial

    try:
        details = get_book_details(book_id)
        merged = dict(details)
        merged["title"] = details.get("title") or initial["title"]
        merged["authors"] = details.get("authors") or initial["authors"]
        merged["year"] = details.get("year") or initial["year"]
        merged["coverImage"] = details.get("coverImage") or initial["coverImage"]
        merged["previewLink"] = details.get("previewLink") or initial["previewLink"]
        merged["description"] = details.get("description") or initial["description"]
        merged["excerpt"] = details.get("excerpt") or initial["excerpt"]
        book = merged
    except Exception as exc:
        details_status = "error"
        details_error = str(exc)

    preview_stage = "sourceNotice" if book.get("hasPreview") else "fallback"

    is_bookmarked = False
    if session.get("user_id"):
        row = db.get_db().execute(
            "SELECT id FROM bookmarks WHERE user_id = ? AND book_api_id = ?",
            (session["user_id"], book_id.lstrip("/")),
        ).fetchone()
        is_bookmarked = row is not None

    return render_template(
        "book_preview.html",
        page="book",
        theme=request.cookies.get("steered-theme", "light"),
        book=book,
        details_status=details_status,
        details_error=details_error,
        preview_stage=preview_stage,
        is_bookmarked=is_bookmarked,
    )


@app.route("/set-theme")
def set_theme():
    theme = request.args.get("theme", "light")
    next_path = request.args.get("next", "/")
    if theme not in ("light", "dark"):
        theme = "light"
    response = redirect(next_path or url_for("home"))
    response.set_cookie("steered-theme", theme, max_age=60 * 60 * 24 * 365)
    return response


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("home"))


@app.route("/login", methods=["GET", "POST"])
def login():
    error = ""
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")
        conn = db.get_db()
        user = conn.execute(
            "SELECT * FROM users WHERE username = ?", (username,)
        ).fetchone()
        if user is None or not check_password_hash(user["password"], password):
            error = "Invalid username or password."
        else:
            session.clear()
            session["user_id"] = user["id"]
            session["username"] = user["username"]
            return redirect(url_for("home"))
    return render_template(
        "login.html",
        theme=request.cookies.get("steered-theme", "light"),
        error=error,
    )


@app.route("/register", methods=["GET", "POST"])
def register():
    error = ""
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")
        confirm = request.form.get("confirm_password", "")
        if not username:
            error = "Username is required."
        elif not password:
            error = "Password is required."
        elif password != confirm:
            error = "Passwords do not match."
        else:
            conn = db.get_db()
            existing = conn.execute(
                "SELECT id FROM users WHERE username = ?", (username,)
            ).fetchone()
            if existing:
                error = "Username already taken."
            else:
                conn.execute(
                    "INSERT INTO users (username, password) VALUES (?, ?)",
                    (username, generate_password_hash(password)),
                )
                conn.commit()
                return redirect(url_for("login"))
    return render_template(
        "register.html",
        theme=request.cookies.get("steered-theme", "light"),
        error=error,
    )


@app.route("/bookmarks")
def bookmarks():
    if not session.get("user_id"):
        return redirect(url_for("login"))

    user_id = session["user_id"]
    conn = db.get_db()
    rows = conn.execute(
        "SELECT book_api_id FROM bookmarks WHERE user_id = ? ORDER BY bookmarked_at DESC",
        (user_id,),
    ).fetchall()

    book_ids = [row["book_api_id"] for row in rows]
    books = []
    status = "success"
    error = ""

    if book_ids:
        try:
            with ThreadPoolExecutor(max_workers=min(len(book_ids), 8)) as pool:
                futures = {pool.submit(get_book_details, bid): bid for bid in book_ids}
                results = {}
                for future in as_completed(futures):
                    bid = futures[future]
                    try:
                        results[bid] = future.result()
                    except Exception:
                        pass
            books = [results[bid] for bid in book_ids if bid in results]
        except Exception as exc:
            status = "error"
            error = str(exc)

    return render_template(
        "bookmarks.html",
        page="bookmarks",
        theme=request.cookies.get("steered-theme", "light"),
        books=books,
        status=status,
        error=error,
    )


@app.route("/bookmark/<path:book_id>", methods=["POST"])
def toggle_bookmark(book_id):
    if not session.get("user_id"):
        return redirect(url_for("login"))

    user_id = session["user_id"]
    book_id = book_id.lstrip("/")
    conn = db.get_db()
    existing = conn.execute(
        "SELECT id FROM bookmarks WHERE user_id = ? AND book_api_id = ?",
        (user_id, book_id),
    ).fetchone()

    if existing:
        conn.execute(
            "DELETE FROM bookmarks WHERE user_id = ? AND book_api_id = ?",
            (user_id, book_id),
        )
    else:
        conn.execute(
            "INSERT INTO bookmarks (user_id, book_api_id) VALUES (?, ?)",
            (user_id, book_id),
        )
    conn.commit()

    back = request.referrer or url_for("home")
    return redirect(back)


@app.route("/profile", methods=["GET", "POST"])
def profile():
    if not session.get("user_id"):
        return redirect(url_for("login"))

    user_id = session["user_id"]
    conn = db.get_db()
    error = ""
    success = ""

    if request.method == "POST":
        prefs = {
            "favorite_genre1": request.form.get("favorite_genre1", ""),
            "favorite_genre2": request.form.get("favorite_genre2", ""),
            "favorite_genre3": request.form.get("favorite_genre3", ""),
            "favorite_author1": request.form.get("favorite_author1", "").strip(),
            "favorite_author2": request.form.get("favorite_author2", "").strip(),
            "favorite_author3": request.form.get("favorite_author3", "").strip(),
            "disliked_genre1": request.form.get("disliked_genre1", ""),
            "disliked_genre2": request.form.get("disliked_genre2", ""),
            "disliked_genre3": request.form.get("disliked_genre3", ""),
        }
        existing = conn.execute(
            "SELECT id FROM preferences WHERE user_id = ?", (user_id,)
        ).fetchone()
        if existing:
            conn.execute(
                """UPDATE preferences SET
                    favorite_genre1=?, favorite_genre2=?, favorite_genre3=?,
                    favorite_author1=?, favorite_author2=?, favorite_author3=?,
                    disliked_genre1=?, disliked_genre2=?, disliked_genre3=?
                WHERE user_id=?""",
                (
                    prefs["favorite_genre1"], prefs["favorite_genre2"], prefs["favorite_genre3"],
                    prefs["favorite_author1"], prefs["favorite_author2"], prefs["favorite_author3"],
                    prefs["disliked_genre1"], prefs["disliked_genre2"], prefs["disliked_genre3"],
                    user_id,
                ),
            )
        else:
            conn.execute(
                """INSERT INTO preferences
                    (user_id, favorite_genre1, favorite_genre2, favorite_genre3,
                     favorite_author1, favorite_author2, favorite_author3,
                     disliked_genre1, disliked_genre2, disliked_genre3)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    user_id,
                    prefs["favorite_genre1"], prefs["favorite_genre2"], prefs["favorite_genre3"],
                    prefs["favorite_author1"], prefs["favorite_author2"], prefs["favorite_author3"],
                    prefs["disliked_genre1"], prefs["disliked_genre2"], prefs["disliked_genre3"],
                ),
            )
        conn.commit()
        success = "Preferences saved!"
    else:
        row = conn.execute(
            "SELECT * FROM preferences WHERE user_id = ?", (user_id,)
        ).fetchone()
        prefs = dict(row) if row else {}

    return render_template(
        "profile.html",
        page="profile",
        theme=request.cookies.get("steered-theme", "light"),
        prefs=prefs,
        supported_genres=supported_genres(),
        error=error,
        success=success,
    )


@app.route("/discovery")
def discovery():
    if not session.get("user_id"):
        return redirect(url_for("login"))

    user_id = session["user_id"]
    conn = db.get_db()
    row = conn.execute(
        "SELECT * FROM preferences WHERE user_id = ?", (user_id,)
    ).fetchone()

    if not row:
        return render_template(
            "discovery.html",
            page="discovery",
            theme=request.cookies.get("steered-theme", "light"),
            has_prefs=False,
            books=[],
            status="success",
            error="",
        )

    prefs = dict(row)
    status = "success"
    error = ""
    books = []

    try:
        tasks = []
        for key in ("favorite_genre1", "favorite_genre2", "favorite_genre3"):
            genre = prefs.get(key) or ""
            if genre:
                tasks.append((fetch_books_by_genre_light, genre))
        for key in ("favorite_author1", "favorite_author2", "favorite_author3"):
            author = prefs.get(key) or ""
            if author:
                tasks.append((fetch_books_by_author_light, author))

        results = []
        if tasks:
            with ThreadPoolExecutor(max_workers=len(tasks)) as pool:
                futures = {pool.submit(fn, arg): arg for fn, arg in tasks}
                for future in as_completed(futures):
                    try:
                        results.extend(future.result())
                    except Exception:
                        pass

        if not results:
            results = get_trending()

        deduped = dedupe_by_id(results)

        disliked = [
            (prefs.get("disliked_genre1") or "").lower(),
            (prefs.get("disliked_genre2") or "").lower(),
            (prefs.get("disliked_genre3") or "").lower(),
        ]
        disliked = [d for d in disliked if d]

        if disliked:
            filtered = []
            for book in deduped:
                cats = [str(c).lower() for c in book.get("categories", [])]
                if not any(d in cat for d in disliked for cat in cats):
                    filtered.append(book)
            books = filtered[:18]
        else:
            books = deduped[:18]
    except Exception as exc:
        status = "error"
        error = str(exc)

    return render_template(
        "discovery.html",
        page="discovery",
        theme=request.cookies.get("steered-theme", "light"),
        has_prefs=True,
        books=books,
        status=status,
        error=error,
    )


if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=int(os.environ.get('PORT', 5000)))
