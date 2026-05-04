import random
from typing import Any, Dict, List
from urllib.parse import quote_plus

import requests

OPEN_LIBRARY_SEARCH_URL = "https://openlibrary.org/search.json"
OPEN_LIBRARY_WORKS_URL = "https://openlibrary.org"
COVER_BASE_URL = "https://covers.openlibrary.org/b/id"
FALLBACK_COVER = "https://via.placeholder.com/240x320?text=Book"

TRENDING_QUERIES = [
    "bestseller",
    "award winning fiction",
    "popular fantasy",
    "notable mystery",
]

GENRE_TO_QUERY = {
    "All": "bestseller",
    "Fiction": "fiction",
    "Fantasy": "fantasy",
    "Romance": "romance",
    "History": "history",
    "Sci-Fi": "science fiction",
    "Mystery": "mystery",
    "Non-Fiction": "nonfiction",
    "Literature": "literature",
    "Biography": "biography",
    "Philosophy": "philosophy",
    "Poetry": "poetry",
}

works_description_cache: Dict[str, str] = {}
author_name_cache: Dict[str, str] = {}


def extract_work_key(doc: Dict[str, Any]) -> str:
    key = doc.get("key")
    if isinstance(key, str) and key.startswith("/works/"):
        return key

    seed = doc.get("seed")
    if isinstance(seed, list):
        for item in seed:
            if isinstance(item, str) and item.startswith("/works/"):
                return item
    return ""


def normalize_description(description: Any) -> str:
    if not description:
        return ""
    if isinstance(description, str):
        return description
    if isinstance(description, dict):
        value = description.get("value")
        if isinstance(value, str):
            return value
    return ""


def excerpt_from_text(text: str = "") -> str:
    if not text:
        return "No excerpt available."
    if len(text) <= 160:
        return text
    return f"{text[:160]}..."


def build_preview_embed_url(archive_id: str) -> str:
    if not archive_id:
        return ""
    return f"https://archive.org/embed/{archive_id}"


def extract_archive_id_from_url(url: str = "") -> str:
    if not isinstance(url, str):
        return ""
    if "archive.org/details/" in url:
        return url.split("archive.org/details/")[-1].split("?")[0].split("#")[0]
    if "archive.org/embed/" in url:
        return url.split("archive.org/embed/")[-1].split("?")[0].split("#")[0]
    return ""


def build_open_library_preview_url(work_key: str) -> str:
    if not work_key:
        return ""
    return f"{OPEN_LIBRARY_WORKS_URL}{work_key}#bookPreview"


def fetch_work_description(work_key: str) -> str:
    if not work_key:
        return ""
    if work_key in works_description_cache:
        return works_description_cache[work_key]

    try:
        response = requests.get(f"{OPEN_LIBRARY_WORKS_URL}{work_key}.json", timeout=12)
        if response.status_code != 200:
            works_description_cache[work_key] = ""
            return ""
        data = response.json()
        desc = normalize_description(data.get("description"))
        works_description_cache[work_key] = desc
        return desc
    except Exception:
        works_description_cache[work_key] = ""
        return ""


def build_fallback_description(doc: Dict[str, Any]) -> str:
    first_sentence = doc.get("first_sentence")
    if isinstance(first_sentence, list) and first_sentence:
        return str(first_sentence[0])
    if isinstance(first_sentence, str):
        return first_sentence
    subject = doc.get("subject")
    if isinstance(subject, list) and subject:
        return f"Topics: {', '.join(subject[:8])}."
    return "No description available yet for this title."


def normalize_doc(doc: Dict[str, Any], index: int = 0) -> Dict[str, Any]:
    title = doc.get("title") or "Untitled"
    author_name = doc.get("author_name")
    authors = ", ".join(author_name) if isinstance(author_name, list) else "Unknown"
    year = str(doc.get("first_publish_year")) if doc.get("first_publish_year") else "N/A"
    isbn_list = doc.get("isbn")
    isbn = isbn_list[0] if isinstance(isbn_list, list) and isbn_list else "N/A"

    cover_i = doc.get("cover_i")
    cover_image = f"{COVER_BASE_URL}/{cover_i}-M.jpg" if cover_i else FALLBACK_COVER

    work_key = extract_work_key(doc) or (doc.get("key") or "")
    key = doc.get("key")
    preview_link = (
        f"https://openlibrary.org{key}"
        if key
        else f"https://openlibrary.org/search?q={quote_plus(title)}"
    )

    fallback_description = build_fallback_description(doc)
    archive = doc.get("ia")
    archive_id = archive[0] if isinstance(archive, list) and archive else ""

    return {
        "id": (key.lstrip('/') if key else f"{title}-{index}"),
        "title": title,
        "authors": authors,
        "year": year,
        "isbn": isbn,
        "categories": doc.get("subject") if isinstance(doc.get("subject"), list) else [],
        "coverImage": cover_image,
        "previewLink": preview_link,
        "description": fallback_description,
        "fallbackDescription": fallback_description,
        "workKey": work_key,
        "archiveId": archive_id,
        "previewEmbedUrl": build_preview_embed_url(archive_id),
        "hasPreview": bool(archive_id),
        "rating": "N/A",
        "excerpt": excerpt_from_text(fallback_description),
    }


def dedupe_by_id(books: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    seen = set()
    output = []
    for book in books:
        book_id = book.get("id")
        if book_id in seen:
            continue
        seen.add(book_id)
        output.append(book)
    return output


def enrich_descriptions(books: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    enriched = []
    for book in books:
        remote_description = fetch_work_description(book.get("workKey", ""))
        final_description = remote_description or book.get("fallbackDescription", "")
        merged = dict(book)
        merged["description"] = final_description
        merged["excerpt"] = excerpt_from_text(final_description)
        enriched.append(merged)
    return enriched


def fetch_docs(query: str, limit: int = 24) -> List[Dict[str, Any]]:
    endpoint = f"{OPEN_LIBRARY_SEARCH_URL}?q={quote_plus(query)}&limit={limit}"
    response = requests.get(endpoint, timeout=14)

    if response.status_code != 200:
        raise RuntimeError("Failed to fetch books. Please try again.")

    docs = response.json().get("docs", [])
    normalized = [normalize_doc(doc, idx) for idx, doc in enumerate(docs)]
    return enrich_descriptions(normalized)


def fetch_author_name(author_key: str) -> str:
    if not author_key:
        return ""
    if author_key in author_name_cache:
        return author_name_cache[author_key]

    try:
        response = requests.get(f"{OPEN_LIBRARY_WORKS_URL}{author_key}.json", timeout=12)
        if response.status_code != 200:
            author_name_cache[author_key] = ""
            return ""
        data = response.json()
        name = data.get("name") if isinstance(data.get("name"), str) else ""
        author_name_cache[author_key] = name
        return name
    except Exception:
        author_name_cache[author_key] = ""
        return ""


def derive_numeric_rating(work_data: Dict[str, Any]) -> str:
    rating_value = work_data.get("ratings_average")
    if isinstance(rating_value, (int, float)):
        return f"{rating_value:.1f} / 5"
    return "N/A"


def fetch_book_details_by_id(book_id: str) -> Dict[str, Any]:
    s = str(book_id or "").strip("/")
    if s.startswith("works/"):
        work_key = f"/{s}"
    else:
        work_key = f"/works/{s}"

    work_res = requests.get(f"{OPEN_LIBRARY_WORKS_URL}{work_key}.json", timeout=14)
    if work_res.status_code != 200:
        raise RuntimeError("Unable to load book details from Open Library.")

    work_data = work_res.json()
    title = work_data.get("title") or "Untitled"
    description = normalize_description(work_data.get("description")) or "No description available yet for this book."

    subjects = work_data.get("subjects") if isinstance(work_data.get("subjects"), list) else []
    author_refs = []
    authors_raw = work_data.get("authors")
    if isinstance(authors_raw, list):
        for author_item in authors_raw:
            if isinstance(author_item, dict):
                author_obj = author_item.get("author")
                if isinstance(author_obj, dict) and author_obj.get("key"):
                    author_refs.append(author_obj["key"])

    authors = "Unknown"
    if author_refs:
        fetched = [fetch_author_name(ref) for ref in author_refs[:4]]
        valid = [name for name in fetched if name]
        authors = ", ".join(valid) if valid else f"Author ref(s): {', '.join(author_refs[:3])}"

    year = work_data.get("first_publish_date") if isinstance(work_data.get("first_publish_date"), str) else "N/A"

    covers = work_data.get("covers")
    cover_id = covers[0] if isinstance(covers, list) and covers else None
    cover_image = f"{COVER_BASE_URL}/{cover_id}-L.jpg" if cover_id else FALLBACK_COVER

    archive_id = ""
    if isinstance(work_data.get("ocaid"), str) and work_data.get("ocaid"):
        archive_id = work_data.get("ocaid")

    identifiers = work_data.get("identifiers")
    if not archive_id and isinstance(identifiers, dict):
        ia = identifiers.get("ia")
        if isinstance(ia, list) and ia:
            archive_id = ia[0]

    links = work_data.get("links")
    if not archive_id and isinstance(links, list):
        for link in links:
            if not isinstance(link, dict):
                continue
            url = link.get("url")
            if isinstance(url, str) and ("archive.org/details/" in url or "archive.org/embed/" in url):
                archive_id = extract_archive_id_from_url(url)
                if archive_id:
                    break

    archive_preview_url = build_preview_embed_url(archive_id)
    open_library_preview_url = build_open_library_preview_url(work_key)

    preview_embed_url = archive_preview_url or open_library_preview_url
    preview_source = "archive" if archive_preview_url else ("openlibrary" if open_library_preview_url else "none")
    has_preview = bool(preview_embed_url)

    return {
        "id": work_key.lstrip("/"),
        "title": title,
        "authors": authors,
        "year": year,
        "isbn": "N/A",
        "categories": subjects,
        "coverImage": cover_image,
        "previewLink": f"{OPEN_LIBRARY_WORKS_URL}{work_key}",
        "previewEmbedUrl": preview_embed_url,
        "hasPreview": has_preview,
        "description": description,
        "excerpt": excerpt_from_text(description),
        "rating": derive_numeric_rating(work_data),
        "archiveId": archive_id,
        "previewSource": preview_source,
    }


def fetch_books_by_author(author: str) -> List[Dict[str, Any]]:
    if not author or not author.strip():
        return []
    return fetch_docs(f"author:{author.strip()}", 12)


def fetch_docs_light(query: str, limit: int = 12) -> List[Dict[str, Any]]:
    """Like fetch_docs but skips per-book description enrichment for speed."""
    endpoint = f"{OPEN_LIBRARY_SEARCH_URL}?q={quote_plus(query)}&limit={limit}"
    response = requests.get(endpoint, timeout=14)
    if response.status_code != 200:
        raise RuntimeError("Failed to fetch books. Please try again.")
    docs = response.json().get("docs", [])
    return [normalize_doc(doc, idx) for idx, doc in enumerate(docs)]


def fetch_books_by_genre_light(genre: str) -> List[Dict[str, Any]]:
    query = GENRE_TO_QUERY.get(genre, GENRE_TO_QUERY["All"])
    return fetch_docs_light(query, 12)


def fetch_books_by_author_light(author: str) -> List[Dict[str, Any]]:
    if not author or not author.strip():
        return []
    return fetch_docs_light(f"author:{author.strip()}", 12)


def search_books(query: str) -> List[Dict[str, Any]]:
    return fetch_docs(query, 24)


def fetch_trending_books() -> List[Dict[str, Any]]:
    result_sets = []
    for query in TRENDING_QUERIES:
        try:
            result_sets.extend(fetch_docs(query, 12))
        except Exception:
            continue

    merged = dedupe_by_id(result_sets)
    random.shuffle(merged)
    return merged[:18]


def fetch_books_by_genre(genre: str) -> List[Dict[str, Any]]:
    query = GENRE_TO_QUERY.get(genre, GENRE_TO_QUERY["All"])
    books = fetch_docs(query, 24)

    if genre == "All":
        return books

    genre_lower = genre.lower().replace("-", " ")
    strict_matches = []
    for book in books:
        categories = book.get("categories", [])
        if any(genre_lower in str(category).lower() for category in categories):
            strict_matches.append(book)

    return strict_matches if strict_matches else books


def supported_genres() -> List[str]:
    return list(GENRE_TO_QUERY.keys())
