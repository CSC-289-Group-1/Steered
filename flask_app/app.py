from flask import Flask, redirect, render_template, request, url_for

from services.books_service import (
    fetch_book_details_by_id,
    fetch_books_by_genre,
    fetch_trending_books,
    search_books,
    supported_genres,
)

app = Flask(__name__)


@app.route("/")
def home():
    genre = request.args.get("genre", "All")
    status = "success"
    error = ""
    books = []

    try:
        if genre == "All":
            books = fetch_trending_books()
        else:
            books = fetch_books_by_genre(genre)
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
        books = search_books(query) if query else fetch_trending_books()
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
        details = fetch_book_details_by_id(book_id)
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

    return render_template(
        "book_preview.html",
        page="book",
        theme=request.cookies.get("steered-theme", "light"),
        book=book,
        details_status=details_status,
        details_error=details_error,
        preview_stage=preview_stage,
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


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
