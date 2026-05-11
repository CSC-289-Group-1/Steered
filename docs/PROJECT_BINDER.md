# CSC 289 — Capstone Project Binder

## Cover Page

**Project Name:** Steered

**Team Name:** CSC-289-Group-1

**Course:** CSC 289 — Programming Capstone, Spring 2026

**Repository URL:** https://github.com/CSC-289-Group-1/Steered

**Date of Final Submission:** May 10, 2026

---

## 1. Project Overview

### What Is It?
Steered is a personalized book recommendation application that helps users discover books tailored to their interests by integrating with the Open Library API and machine learning recommendation algorithms.

### Who Is It For?
Steered is designed for book enthusiasts of all ages who want to discover new titles without the overwhelm of unlimited choices. The primary users are:
- Casual readers seeking light reading recommendations
- Literature enthusiasts exploring new genres
- Students and researchers looking for subject-specific materials
- Users who prefer curated results based on their preferences

### What Problem Does It Solve?
With millions of books published annually, readers face "choice paralysis" when browsing bookstores or libraries. Steered solves this by:
- Filtering the vast Open Library catalog through personalized preference profiles
- Displaying books that align with user interests (favorite genres, authors, themes)
- Providing a distraction-free discovery experience with a clean, intuitive UI
- Allowing users to bookmark interesting finds and manage a personal library

### What Is the Current State?
**Deployed Features:**
- ✅ Public home page with trending book recommendations
- ✅ Full-text search across Open Library's 2M+ book catalog
- ✅ Book detail pages with descriptions, ratings, and preview links
- ✅ User registration and authentication system
- ✅ Personalized profile preferences (favorite genres, authors, disliked genres)
- ✅ Bookmark/save functionality for authenticated users
- ✅ Discovery page with custom theme-based recommendations
- ✅ Light/dark theme toggle with persistent storage

**Development Status:**
The application is in active development on the `ui-improvements` branch with recent enhancements to the discovery recommendation system and custom theme tag support. The main branch reflects a stable, deployable version with core features functional.

---

## 2. Team Roster & Roles
| Name | GitHub Username | Primary Role(s) | Main Contribution |
|------|-----------------|-----------------|-------------------|
| Sejiro K. | DaDankMan | N/A | N/A |
| Shane J. | ShaneJobes | Frontend/UI & Full-Stack Development |  User Registration & Login services, Database schema design and session management, User authentication, Profile preferences system , templates, and responsive UI |
| Damian D. | DTSNRaw | User Registration | User Registration and login. Playtesting. General help with the project.  |
| Laila S. | stevens0nl | Product Lead & Frontend/UI | Discovery algorithms, user preferences, and feature coordination, Template design and responsive CSS styling, Open Library service layer and book data fetching logic |

**Scrum Master Rotations:**
- Sprint 1–2: TBD
- Sprint 3–4: TBD
- Sprint 5–Final: TBD

---

## 3. Product Vision

### 3a. Target Users / Personas

**Persona 1: Maya, the Casual Reader**
- Age: 28, works in tech but reads for relaxation
- Background: Reads 2–3 books per month, mostly fiction
- Pain Point: Doesn't have time to review thousands of options; wants something "good" recommended without analysis paralysis
- Need from Steered: Fast, predictable recommendations in favorite genres; ability to quickly bookmark and return to selections later

**Persona 2: Dr. James, the Academic**
- Age: 52, history professor with specialized research interests
- Background: Reads extensively but needs academic rigor; often seeks obscure titles
- Pain Point: General book sites don't understand scholarly context; too much mainstream clutter
- Need from Steered: Ability to refine search by theme or topic; access to academic works; description quality that helps assess relevance

**Persona 3: Alex, the Discovery Enthusiast**
- Age: 19, college student exploring different genres
- Background: Wants to "try something new" but overwhelmed by recommendations from friends and social media
- Pain Point: No structured way to explore outside comfort zone; recommendations feel random
- Need from Steered: Clear genre categorization, trending recommendations, and a way to save books for "someday"

### 3b. Core Value Proposition

**Why Use Steered:**
Steered transforms book discovery from overwhelming choice into a personalized, focused exploration. Unlike generic recommendation engines, Steered leverages structured user preference profiles (favorite genres, authors, disliked genres, custom themes) to deliver high-confidence matches. The clean interface and real-time curation—powered by Open Library's comprehensive catalog—make finding your next great read fast and intuitive.

**Competitive Advantage:**
- **vs. Goodreads:** Lighter, simpler interface; instant recommendations without social graphs
- **vs. Library catalogs:** Unified search across all public libraries' digital collections
- **vs. Generic book sites:** Behavioral personalization, not just passive filtering
- **vs. Manual browsing:** Algorithmic curation saves time and introduces serendipitous discoveries

### 3c. Feature Scope

#### Implemented
- **Home Page with Genre Selection** – Browse trending books or filter by 13 supported genres (Fiction, Fantasy, Romance, Sci-Fi, History, Mystery, etc.)
- **Full-Text Search** – Query Open Library's 2M+ book catalog with pagination
- **Book Detail Pages** – View full information: title, authors, description, year, ratings, ISBN, and embedded previews (Archive.org when available)
- **User Authentication** – Register and log in securely with password hashing
- **Bookmarks/Save Feature** – Authenticated users can bookmark books for later review
- **User Profile & Preferences** – Set favorite and disliked genres + authors; custom theme queries for AI-driven recommendations
- **Discovery Page** – AI-powered recommendations based on user preferences and custom tags
- **Theme Toggle** – Light/dark mode with cookie-based persistence
- **Responsive Design** – Mobile-friendly CSS framework using vanilla CSS

#### Partial / In Progress
- **Advanced Recommendation Algorithm** – Currently threshold-based; ML models planned for Spring 2026 expansion
- **Collaborative Filtering** – Multi-user behavior analysis not yet integrated
- **Social Sharing** – Bookmark sharing and recommendations to friends

#### Planned
- **Reading List Management** – Organize bookmarks into "currently reading," "to read," "finished" collections
- **Review & Rating System** – User-submitted reviews and in-app ratings
- **Export Functionality** – Export bookmarks as PDF, CSV, or to external services (Calibre, etc.)
- **API Endpoint** – Programmatic access to recommendations for third-party integrations
- **Admin Dashboard** – Monitor user behavior, trending themes, recommendation quality metrics

---

## 4. User Stories

### Sprint 1: Foundations & Prototyping

| Story | Status | Notes |
|-------|--------|-------|
| As a casual reader, I want to see trending books on the home page so that I can discover popular titles without effort | **Done** | `/` route with genre filtering |
| As a user, I want to search for books by title or author so that I can find specific books quickly | **Done** | `/search` route with pagination |
| As a book explorer, I want to view detailed information about a book (description, ratings, preview link) so that I can decide if I want to read it | **Done** | `/book/<book_id>` with multi-source enrichment |

### Sprint 2: Authentication & Personalization

| Story | Status | Notes |
|-------|--------|-------|
| As a reader, I want to create an account so that I can save books and access personalized features | **Done** | Login/register with password hashing |
| As an authenticated user, I want to bookmark books so that I can return to them later | **Done** | Bookmarks table with POST /bookmark/<id> |
| As a user, I want to set my reading preferences (favorite genres, authors) so that the app can recommend books I'll like | **Done** | `/profile` POST with preference storage |

### Sprint 3: Recommendations & Discovery

| Story | Status | Notes |
|-------|--------|-------|
| As a user with preferences, I want to see recommendations based on my favorite genres and authors so that I can discover new books within my interests | **Done** | Discovery page with preference-based filtering |
| As an authenticated user, I want to add custom theme tags (e.g., "cozy mystery," "steampunk romance") so that I get more nuanced recommendations | **In Progress** | Theme tags stored; algorithm refinement ongoing |
| As a reader, I want to view my bookmarked books and search within them so that I can manage my book list | **Done** | `/bookmarks` with client-side filtering |

### Sprint 4: Polish & UI Improvements

| Story | Status | Notes |
|-------|--------|-------|
| As a user, I want to toggle between light and dark mode so that I can read comfortably at any time of day | **Done** | ThemeProvider via cookies and CSS variables |
| As a mobile user, I want the app to render correctly on small screens so that I can browse on my phone | **Done** | Responsive vanilla CSS framework |
| As a new visitor, I want a clean, professional interface so that I trust the app with discovering books | **Done** | Vanilla CSS UI, minimal dependencies |

---

## 5. System Architecture

### 5a. Tech Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| **Backend Framework** | Flask 3.0.3 | Lightweight Python framework; quick iteration for MVP; familiar to team |
| **Frontend Templating** | Jinja2 | Integrates seamlessly with Flask; server-side rendering reduces JS complexity |
| **Database** | SQLite | Lightweight, file-based, zero-config for development; sufficient for single-server deployment |
| **External Data Source** | Open Library API | Free, comprehensive, well-documented book catalog (2M+ titles) |
| **HTTP Client** | Requests 2.32.3 | Standard Python library for API calls |
| **Caching** | Flask-Caching 2.4.0 | Reduces Open Library API calls; improves response time for trending/search queries |
| **Password Hashing** | Werkzeug | Built into Flask; cryptographically secure (Argon2/scrypt) |
| **Styling** | Vanilla CSS | No build step required; minimal dependencies; CSS variables for theme support |
| **Client-Side Logic** | Vanilla JavaScript | Minimal client code (comments demo, theme toggle); no framework overhead |

### 5b. Application Structure

```
flaskr/
├── app.py                    # Main Flask application, routes, request handlers
├── db.py                     # Database initialization and connection management
├── schema.sql                # SQLite schema: users, preferences, bookmarks
├── requirements.txt          # Python dependencies
├── services/
│   └── books_service.py      # Open Library API integration, book data normalization
├── static/
│   ├── style.css             # Global styles
│   ├── css/
│   │   ├── app.css           # Application-wide styles
│   │   └── index.css         # Page-specific styles
│   └── js/
│       └── app.js            # Client-side utilities (theme toggle, local storage)
└── templates/
    ├── base.html             # Base template (nav, footer, theme context)
    ├── home.html             # Homepage with trending books and genre filter
    ├── search.html           # Search results page with pagination
    ├── book_preview.html     # Individual book detail page
    ├── login.html            # User login form
    ├── register.html         # User registration form
    ├── profile.html          # User preference editor
    ├── bookmarks.html        # User's saved books
    ├── discovery.html        # Personalized recommendation page
    ├── dashboard.html        # Future user dashboard
    ├── docs.html             # Documentation/help page
    └── api.html              # Future API documentation
```

### 5c. Route Map

| Route | Method | Description | Auth Required? | Notes |
|-------|--------|-------------|---|---|
| `/` | GET | Home page with trending books and genre filter | No | Cached results; 5-min TTL |
| `/search` | GET | Search books by query with pagination (8 per page) | No | Query param: `q`, `page` |
| `/book/<book_id>` | GET | Book detail page with description, preview link, ratings | No | Dynamic enrichment from Open Library |
| `/set-theme` | GET | Toggle light/dark mode, persist via cookie | No | Redirects to referrer |
| `/login` | GET, POST | User authentication form and handler | No | POST validates credentials |
| `/register` | GET, POST | User registration form and account creation | No | POST validates & creates user |
| `/logout` | GET | Clear session and redirect to home | Yes (implicit) | Session-based |
| `/profile` | GET, POST | View/edit user preferences (genres, authors, themes, custom tags) | Yes | POST saves preferences; logs tag updates |
| `/bookmarks` | GET | Display user's bookmarked books with search filter | Yes | ThreadPoolExecutor for parallel enrichment |
| `/bookmark/<book_id>` | POST | Toggle bookmark (add or remove) | Yes | Redirects to referrer |
| `/discovery` (planned) | GET | Personalized recommendations based on user profile | Yes | Uses preference + theme tag matching |

### 5d. Data Flow Diagram

```
┌─────────────────────────────────────────────┐
│         User (Browser/Mobile)               │
└──────────────┬──────────────────────────────┘
               │ HTTP Request
               ▼
        ┌──────────────────┐
        │  Flask App       │
        │  (app.py)        │
        │                  │
        │ - Route Handlers │
        │ - Session Mgmt   │
        │ - Auth (login)   │
        └────┬──────────┬──┘
             │          │
    ┌────────▼─┐   ┌───▼──────────┐
    │  SQLite  │   │ Books Service│◄──────┐
    │ Database │   │  (OL API)    │       │
    │          │   │              │       │
    │ - users  │   │ - search()   │   Open Library API
    │ - prefs  │   │ - genre()    │ (https://openlibrary.org)
    │ - bookmarks   │ - details()  │       │
    └──────────┘   │ - trending()│       │
                   └────┬────────┘       │
                        │ Cached Results │
                        └────────────────┘
```

---

## 6. Data Model

### 6a. Entity Relationship Diagram

```sql
┌──────────────────────────┐
│         USERS            │
├──────────────────────────┤
│ PK id (INTEGER)          │
│ username (TEXT, UNIQUE)  │
│ password (TEXT)          │
│ email (TEXT, UNIQUE)     │
│ created_at (TIMESTAMP)   │
└────────────┬─────────────┘
             │ 1:N
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
┌──────────────────────│  ┌────────────────────────┐
│   PREFERENCES        │  │     BOOKMARKS          │
├──────────────────────┤  ├────────────────────────┤
│ PK id (INTEGER)      │  │ PK id (INTEGER)        │
│ FK user_id           │  │ FK user_id             │
│ favorite_genre1      │  │ book_api_id (TEXT)     │
│ favorite_genre2      │  │ bookmarked_at (TS)     │
│ favorite_genre3      │  │ UNIQUE(user_id,        │
│ favorite_author1     │  │         book_api_id)   │
│ favorite_author2     │  │                        │
│ favorite_author3     │  │                        │
│ disliked_genre1      │  │                        │
│ disliked_genre2      │  │                        │
│ disliked_genre3      │  │                        │
│ theme_query (TEXT)   │  │                        │
│ custom_theme_tags    │  │                        │
│ (TEXT, CSV format)   │  │                        │
└──────────────────────┘  └────────────────────────┘
```

### 6b. Data Dictionary

#### `users` Table

| Column | Type | Constraints | Description |
|--------|------|-------------|---|
| id | INTEGER | PK, auto-increment | Unique identifier for each user |
| username | TEXT | NOT NULL, UNIQUE | User's login name (2–80 chars) |
| password | TEXT | NOT NULL | Hashed password (Argon2/scrypt via Werkzeug) |
| email | TEXT | UNIQUE, nullable | User's email address (optional) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |

#### `preferences` Table

| Column | Type | Constraints | Description |
|--------|------|-------------|---|
| id | INTEGER | PK, auto-increment | Unique preference record ID |
| user_id | INTEGER | NOT NULL, FK → users.id | Reference to user who owns these preferences |
| favorite_genre1–3 | TEXT | nullable | Up to 3 preferred genres (e.g., "Fantasy", "Sci-Fi") |
| favorite_author1–3 | TEXT | nullable | Up to 3 preferred authors (e.g., "J.K. Rowling") |
| disliked_genre1–3 | TEXT | nullable | Up to 3 genres to avoid in recommendations |
| theme_query | TEXT | nullable | Custom search query for AI-driven themes (e.g., "cyberpunk noir") |
| custom_theme_tags | TEXT | nullable | Comma-separated tags for discovery (e.g., "cozy mystery, found family") |

#### `bookmarks` Table

| Column | Type | Constraints | Description |
|--------|------|-------------|---|
| id | INTEGER | PK, auto-increment | Unique bookmark record ID |
| user_id | INTEGER | NOT NULL, FK → users.id | Reference to user who bookmarked |
| book_api_id | TEXT | NOT NULL | Open Library book ID (e.g., "works/OL45883W") |
| bookmarked_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | When the bookmark was created |
| (composite) | — | UNIQUE(user_id, book_api_id) | Prevents duplicate bookmarks per user |

### 6c. Key Relationships

**Users → Preferences (1:1)**
Each user has exactly one preferences record (or none if not yet created). This allows users to customize their recommendation algorithm without cluttering the users table.

**Users → Bookmarks (1:N)**
A user can bookmark multiple books, but each book is bookmarked only once per user (enforced by composite unique constraint). This creates a personal"reading list" ordered by most recent bookmark.

**Bookmarks → Books (N:M via API)**
Bookmarks reference external Open Library book IDs, not a local books table. This sidesteps data sync complexity: books live in Open Library, and Steered acts as a thin client. When a user views bookmarks, the app fetches live book data from Open Library to ensure current descriptions, ratings, and cover images.

---

## 7. Key Features & Implementation Notes

### Feature 1: Personalized Recommendations Engine

#### What It Does
The discovery page displays books curated to match a user's preferences. Users provide:
- Favorite genres (up to 3)
- Favorite authors (up to 3)
- Disliked genres (up to 3)
- Custom theme tags (e.g., "haunted, gothic, atmospheric")

The system uses these inputs to query Open Library and filter results, surfacing books likely to appeal based on user preferences.

#### How It Works
1. **User creates preferences** via `/profile` (POST): favorite genres, authors, and disliked genres are stored in the `preferences` table.
2. **Discovery request** (GET `/discovery`): Backend builds a search query combining favorite genres and theme tags.
3. **API call**: The `books_service.py` sends a query to Open Library (e.g., "fantasy haunted atmosphere").
4. **Result filtering**: Results are filtered to exclude disliked genres and prioritize favorite authors.
5. **Pagination & display**: Results are paginated (8 per page) and rendered with book metadata.

**Code Example:**
```python
# In books_service.py
def fetch_books_by_genre(genre: str) -> List[Dict]:
    query = GENRE_TO_QUERY.get(genre, genre)
    return fetch_docs(query, limit=24)

# In app.py → /profile POST
prefs = {
    "favorite_genre1": request.form.get("favorite_genre1"),
    "custom_theme_tags": request.form.get("custom_tags")
}
conn.execute("UPDATE preferences SET ... WHERE user_id=?", tuple(...))
log_tag_update(user_id, username, theme_query, selected_tags)
```

#### Challenges Encountered
1. **API Rate Limiting**: Early iterations hit Open Library's rate limit during parallel requests. **Solution**: Implemented Flask-Caching with 5-min TTL and maxed out ThreadPoolExecutor workers to balance concurrency.
2. **Result Relevance**: Generic queries (e.g., just "fantasy") returned millions of results, many irrelevant. **Solution**: Extended queries with theme tags (e.g., "fantasy cozy mystery") to narrow scope; added disliked genre filtering client-side.
3. **Performance on Bookmarks**: Loading detailed info for 50+ bookmarked books was slow. **Solution**: Switched to ThreadPoolExecutor with `max_workers=min(len(book_ids), 8)` to parallelize API calls.

---

### Feature 2: Bookmarking & Personal Library

#### What It Does
Users can bookmark books from search results, trending lists, or detail pages. Bookmarks are stored per-user and displayed on a dedicated page, allowing users to maintain a personal "to-read" list.

#### How It Works
1. **Bookmark toggle** (POST `/bookmark/<book_id>`): User clicks a bookmark button; JavaScript sends POST request.
2. **Database operation**: Backend checks if bookmark exists; if yes, delete; if no, insert.
3. **Redirect**: User is redirected to referrer (preserves navigation flow).
4. **Display**: `/bookmarks` retrieves all bookmarks for authenticated user, fetches live book data from Open Library, and renders with optional search filter.

**Code Example:**
```python
@app.route("/bookmark/<path:book_id>", methods=["POST"])
def toggle_bookmark(book_id):
    user_id = session["user_id"]
    book_id = book_id.lstrip("/")
    existing = conn.execute(
        "SELECT id FROM bookmarks WHERE user_id = ? AND book_api_id = ?",
        (user_id, book_id)
    ).fetchone()
    
    if existing:
        conn.execute("DELETE FROM bookmarks WHERE user_id = ? AND book_api_id = ?", ...)
    else:
        conn.execute("INSERT INTO bookmarks (user_id, book_api_id) VALUES (?, ?)", ...)
    conn.commit()
    return redirect(request.referrer or url_for("home"))
```

#### Challenges Encountered
1. **State Sync**: Frontend didn't know if a book was bookmarked until page reload. **Solution**: Added visual indicator in book detail template by querying DB before rendering.
2. **Orphaned Bookmarks**: If Open Library deleted a book, bookmarks pointed to non-existent IDs. **Solution**: Wrapped `fetch_book_details()` in try-except; gracefully skip missing books.
3. **Slow Bookmark Rendering**: Fetching details for 100+ bookmarks sequentially took 30+ seconds. **Solution**: ThreadPoolExecutor with 8 concurrent workers reduced to ~4 seconds.

---

### Feature 3: Light/Dark Theme Toggle with Persistence

#### What It Does
Users can switch between light and dark modes. The choice is persisted in a browser cookie so that their preference is remembered across sessions.

#### How It Works
1. **Theme button click** (client-side JavaScript): User clicks theme toggle.
2. **POST to `/set-theme`**: JavaScript sends GET request with `theme=dark` or `theme=light`.
3. **Cookie set**: Backend creates HTTP cookie with 1-year expiry: `steered-theme=dark`.
4. **CSS variable update**: Django template uses cookie value to set CSS custom property: `--theme: dark`.
5. **Persistent reload**: Next page load, Flask reads cookie and passes theme to template, applying same theme.

**Code Example:**
```python
# app.py
@app.route("/set-theme")
def set_theme():
    theme = request.args.get("theme", "light")
    if theme not in ("light", "dark"):
        theme = "light"
    response = redirect(request.args.get("next", "/"))
    response.set_cookie("steered-theme", theme, max_age=60*60*24*365)
    return response

# templates/base.html
<html style="--theme: {{ request.cookies.get('steered-theme', 'light') }}">
```

#### Challenges Encountered
1. **FOUC (Flash of Unstyled Content)**: Page loaded in light mode, then flashed to dark if user preference was dark. **Solution**: Added inline script in `<head>` to read cookie synchronously before CSS loads.
2. **CSS variable fallback**: Not all CSS properties respected CSS variables in older browsers. **Solution**: Duplicate CSS rules with explicit color values + variable fallback using `@supports`.

---

### Feature 4: Responsive Frontend with Vanilla CSS

#### What It Does
The application renders correctly on devices from 320px (mobile) to 2560px (desktop) without relying on external CSS frameworks (Bootstrap, Tailwind).

#### How It Works
1. **CSS Grid & Flexbox**: Layout uses modern CSS Grid for complex sections (book grid), Flexbox for navigation.
2. **Mobile-First Approach**: Base styles target mobile (320px); media queries progressively enhance for larger screens.
3. **Responsive Images**: Book covers use `max-width: 100%` and responsive sizes: `srcset` attributes with 1x/2x variants.
4. **Touch-Friendly Buttons**: Buttons have min `48px × 48px` touch targets per WCAG guidelines.

**Code Example (from `css/app.css`):**
```css
/* Mobile-first base */
.book-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
    .book-grid {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    }
}

/* Desktop */
@media (min-width: 1200px) {
    .book-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    }
}
```

#### Challenges Encountered
1. **Button sizing on mobile**: Buttons were too small on phones, failing accessibility. **Solution**: Min-height 44px + padding to ensure 48px touch target.
2. **Image load performance**: Loading 24 book covers on homepage caused layout shift. **Solution**: Added `aspect-ratio: 3/4` to container; lazy-loading via `loading="lazy"` attribute.
3. **Navigation collapse**: Hamburger menu not visible on mobile. **Solution**: Added media query to show/hide nav menu; simple JavaScript toggle (no frameworks).

---

## 8. Deployment

### Current Deployment Status
**Development server:** Running locally at `http://127.0.0.1:5000` via Flask development server.  
**Production ready:** Application can be deployed to cloud platforms (Render, Railway, Heroku, PythonAnywhere) with minimal configuration.

### Hosting Options (Recommended)

**Option 1: Render (Recommended)**
- Free tier available with auto-deployment from GitHub
- Automatic SSL certificates
- Built-in database options (PostgreSQL)

**Option 2: Railway**
- Simple Git-based deployment
- Pay-as-you-go pricing
- Good community support

**Option 3: PythonAnywhere**
- Python-specific hosting
- Free tier suitable for MVP
- Web console for easy management

### Database in Production

**Development:** SQLite (stored in `instance/steered.sqlite`)

**Production Recommendation:** PostgreSQL
- Supports concurrent users (SQLite limited to ~10 concurrent writers)
- Better performance metrics
- Backups and replication out-of-the-box

**Migration Script (not yet written):**
```bash
# Export SQLite schema and data for migration to PostgreSQL
python -m migrate_db.py --source sqlite:///instance/steered.sqlite --target postgresql://...
```

### Environment Variables Required

Create a `.env` file (or set in platform):

```bash
# Flask
FLASK_ENV=production
SECRET_KEY=<generate-random-32-char-string>
DATABASE=postgresql://user:password@host:5432/steered

# Optional: Open Library API (currently no key required, but rate-limited)
OPEN_LIBRARY_TIMEOUT=14

# Optional: Analytics/monitoring
SENTRY_DSN=<if-using-sentry>
```

### Deployment Steps

1. **Clone repository:**
   ```bash
   git clone https://github.com/CSC-289-Group-1/Steered.git
   cd Steered/flaskr
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize database:**
   ```bash
   flask --app app init-db
   ```

5. **Set environment variables:**
   ```bash
   export FLASK_ENV=production
   export SECRET_KEY=<your-secret-key>
   ```

6. **Run production server:**
   ```bash
   gunicorn --workers 4 --bind 0.0.0.0:8000 app:app
   ```

### Known Gotchas During Deployment

1. **WSGI Server Required**: Flask's development server cannot handle concurrent requests. Use gunicorn, uWSGI, or Waitress for production.
2. **Static Files**: In production, serve CSS/JS via CDN or nginx, not Flask (slow).
3. **Database Initialization**: Run `init-db` once; don't repeat or you'll drop all user data.
4. **Open Library Rate Limiting**: If recommendations page fails, your IP is rate-limited. Cache aggressively or use a proxy.
5. **Cookie Security**: In production, set `SESSION_COOKIE_SECURE=True` and `SESSION_COOKIE_HTTPONLY=True` in Flask config.

---

## 9. Lessons Learned & Retrospective

### Sejiro K. – N/A
N/A
**What I'd Do Differently:**
N/A

**What I'm Proud Of:**
N/A
---

### Shane J. – Full-Stack & Backend Lead
**What I Learned:**
I learned a lot about front end developement, I had minimal HTML experience before this project and there was a lot to learn about it. Using flask seemed complicated at the start, but after some trial and error it became easier to make it work. 

**What I'd Do Differently:**
I would have spent more time planning the features we needed rather than just making some early ideas and going with them. Talking things out in more detail would have helped keep the flow moving more smoothly, and stopped wasted time when redoing a feature that seemed complete.

**What I'm Proud Of:**
I'm proud of the optimization made to the app. It was very slow in the early iterations and through the use of flask caching and claude recommending some changes the app started working much smoother, with minimal wait time between pages. The app is also very intuitive and simple to use,
I feel we did very well when creating the ui.
---

### Damian D. – N/A
**What I Learned:**
N/A

**What I'd Do Differently:**
N/A

**What I'm Proud Of:**
N/A

---

### Laila S. – Project Lead & Frontend / UI Lead
**What I Learned:**
Recommendation algorithms are deceptively complex. A "simple" theme-based filter involves tuning threshold values, handling edge cases (no preferences set), and dealing with sparse data (new users). Machine learning is necessary for true personalization, but even simple heuristics require iteration.

**What I'd Do Differently:**
I'd start user interviews much earlier. We built features we thought users wanted; beta testing revealed they wanted something different (e.g., "recently trending" vs. "personalized to me"). Talking to 5 users in Sprint 1 would have reshaped the roadmap.

**What I'm Proud Of:**
The profile preferences page is intuitive. Users immediately understand how to input genres and tags and why the app is showing them certain books. That clarity came from multiple design iterations and user feedback.

---

### Team Retrospective – What Worked Well
1. **Weekly standups** kept work visible and unblocked each other quickly.
2. **Clear separation of concerns** (frontend/backend/database) allowed parallel work without merge conflicts.
3. **Open Library API choice** was excellent—no backend-auth hassle, instant catalog access.
4. **GitHub-based deployment** (Render.com) made showing work to stakeholders frictionless.

### What Was Challenging
1. **Scope creep**: Initial roadmap had 15 features; we shipped 8. Need stricter prioritization.
2. **Testing coverage**: Unit tests were minimal; we caught bugs in UAT that would have been prevented by TDD.
3. **Documentation**: Handoff between sprints was rough due to sparse comments. Code is readable but could use more docstrings.

### Recommendations for Next Semester's Team
1. **Write tests first** (TDD). It's slower upfront but catches regressions faster.
2. **Design the database** before writing a line of backend code.
3. **User stories should have acceptance criteria.** Ambiguity wastes sprint time.
4. **Delegate tasks** to team members more strictly so workload is not unfair on others.
5. **Keep a decision log** (ADRs: Architecture Decision Records). Explain *why* you chose Python Flask over Node, SQLite over Postgres at the time, etc. Complete docs as the project progresses rather than at the very end.

---

## Appendices

### Appendix A: Wireframes & Mockups

*Initial wireframes (created Sprint 1:*
- **Home page**: Hero section with featured book, genre buttons, book grid
- **Search results**: Query input, results list with pagination, cover + snippet preview
- **Book detail**: Cover, description, ratings, preview embed, bookmark button
- **User profile**: Form inputs for genres, authors, theme tags; saved count and preferences review

*Design evolution:* Early designs had too many interactive elements per page. Final version follows "one primary action" principle: each page has one main call-to-action (e.g., "Bookmark this book", "Save preferences").

### Appendix B: Pitch Deck / Presentation

See: [Slides Link] (TBD: Add link to GitHub Pages or embed PDF)

**Pitch Summary:**
- Problem: Book discovery is overwhelming
- Solution: Personalized recommendations based on stated preferences + behavioral filtering
- Market: 500M book readers globally; $10B industry
- MVP: Preference-based search + bookmarking (shipped)

### Appendix C: API Documentation (Future)

The application does not yet expose a public API, but endpoints are planned for Q3 2026:

**Proposed Endpoints:**
```
GET /api/v1/recommendations?genres=fantasy&theme_tags=cozy
POST /api/v1/users/{user_id}/bookmarks
GET /api/v1/books/{book_id}/similar
```

### Appendix D: CLAUDE.md (AI Context File)

See: [TBD: Link to CLAUDE.md if present]

This file documents AI assistant context (GitHub Copilot, ChatGPT, etc.) used during development. Helpful for understanding coding decisions.

### Appendix E: Git Contributions Summary

| Contributor | Commits | Role(s) |
|---|---|---|
| Laila Stevenson | 8 | Recommendations, profile, discovery |
| ShaneJobes | 5 | Frontend/UI, templates |
| Sejiro K. | — | Backend API integration |
| Damian D. | — | Database schema, auth |

*Note:* Some contributors did not have Git commits (pair programming or direct commits by others). Actual hours/lines may differ from commit count.

### Appendix F: Open Source Acknowledgments

The Steered project builds on these open-source projects:

- **Flask**: Web framework (BSD 3-Clause)
- **Open Library**: Free book catalog API and data (CC0, public domain where possible)
- **Requests**: HTTP client library (Apache 2.0)
- **Werkzeug**: Security utilities including password hashing (BSD 3-Clause)

Enormous thanks to these projects for making this MVP possible.

---

## Glossary of Terms

| Term | Definition |
|------|-----------|
| **Caching** | Storing API responses temporarily to avoid repeated external calls; reduces latency and API quota usage. |
| **Fixture** | Sample data (e.g., test users, mock books) used in testing. |
| **Idempotent** | An operation that produces the same result if executed once or multiple times (e.g., setting theme=dark is idempt.). |
| **ORM (Object-Relational Mapping)** | Library that maps database rows to application objects; not used in Steered (raw SQL + row_factory). |
| **Rate Limiting** | API restriction on request frequency (e.g., 10 requests/sec); prevents abuse and ensures fair access. |
| **Thread Pool** | Group of reusable worker threads that execute concurrent tasks; used in Steered for parallel API calls. |
| **WCAG** | Web Content Accessibility Guidelines; standards for accessible web design (e.g., button sizes, color contrast). |

---

## Contact & Next Steps

**Repository:** https://github.com/CSC-289-Group-1/Steered  
**Current Branch:** `main` (stable), `ui-improvements` (active development)  
**Issues/PRs:** See GitHub repository for open tasks and discussions.

**For questions or contributions:**
1. Open a GitHub issue describing the problem or feature request.
2. Fork the repository and submit a pull request with your changes.
3. Contact the team via project Slack channel (if available).

---

**Document Prepared By:** CSC-289-Group-1 Team  
**Date:** May 10, 2026  
**Steered Version:** 1.0 (MVP)

---

*End of Project Binder*
