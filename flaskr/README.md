# STEERED Flask App

This folder contains the Flask-based implementation of the former React prototype while keeping the same visual design language using vanilla CSS.

## Features

- Flask routes for:
  - `/` home recommendations
  - `/search` search results
  - `/book/<book_id>` book preview/details
  - `/set-theme` light/dark mode persistence via cookie
- Open Library service layer in Python (`services/books_service.py`)
- Jinja templates with UI structure equivalent to the previous React pages
- Vanilla CSS styling ported from the previous frontend
- Minimal client-side JavaScript for local comments and star-rating demo interactions

## Run locally

```powershell
- cd steered\flask_app
- python -m venv .venv
- .venv/bin/activate
- pip install -r requirements.txt
- flask --app app run
```

Then open: http://127.0.0.1:5000

## Notes

- This is a development server setup.
- Book data comes from Open Library APIs.
- Comment/rating actions on the preview page are demo-only and stored in-memory on the page session.
