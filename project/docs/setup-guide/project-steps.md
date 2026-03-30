# STEERED Project — Step-by-Step Guide (From SCRATCH!!!)
> This guide explains how to recreate the current **Books(?) recommendation project** end-to-end, including:

- folders/files to create
- commands to run
- implementation order
- verification steps

It complements:
- `project/docs/IMPLEMENTATION_MANUAL.md` (architecture + scaling guidance)
- `project/web/MANUAL_SETUP_AND_RUN.md` (quick run commands)

---

## 1) Prerequisites

Install the following before starting:

- **Node.js**: v18+ recommended
- **npm**: comes with Node.js
- **Git** (optional but recommended)

Check versions:

```bash
node -v
npm -v
git --version
```

---

## 2) Create the Project Root Structure

From your workspace root, create this structure:

```txt
STEERED/
  project/
    api/
    data/
    design/
      components/
    docs/
      pitch/
    web/
```

### Example commands (Windows cmd... idk Mac the ones)

```bash
mkdir project
mkdir project\api
mkdir project\data
mkdir project\design
mkdir project\design\components
mkdir project\docs
mkdir project\docs\pitch
mkdir project\web
```

---

## 3) Scaffold the React App in `project/web`

From repository root (`STEERED`):

```bash
npm create vite@latest project/web -- --template react
```

Then install dependencies:

```bash
cd project/web
npm install
```

---

## 4) Ensure Core Frontend Dependencies

Install React Router (required for page routing):

```bash
npm install react-router-dom
```

Optional checks:

```bash
npm run dev
npm run build
```
---

## 5) Create the Required Files

Inside `project/web`, ensure these files/folders exist:

```txt
web/
  index.html
  package.json
  vite.config.js
  src/
    main.jsx
    App.jsx
    App.css
    index.css
    assets/
      hero.png
      react.svg
      vite.svg
    components/
      Layout.jsx
      SearchBar.jsx
      CategoryPills.jsx
      BookCard.jsx
    pages/
      HomePage.jsx
      SearchResultsPage.jsx
      BookPreviewPage.jsx
    services/
      OpenLibrary.js
```

Project documentation files at repo level:

```txt
project/
  README.md
  api/endpoints.md
  data/schema.md
  data/source.md
  design/style-guide.md
  design/components/navigation.md
  docs/IMPLEMENTATION_MANUAL.md
  docs/pitch/pitch-outline.md
```

---
## 6) Implement Bootstrap and Routing

### `src/main.jsx`
- Create React app bootstrap
- Wrap app in `BrowserRouter` if not handled in `App.jsx`

### `src/App.jsx`
- Define routes:
  - `/` → `HomePage`
  - `/search` → `SearchResultsPage`
  - `/book/:bookId` → `BookPreviewPage`
- Wire global shell/theme state (if used)

---

## 7) Build Reusable UI Components

Create and implement:

1. `src/components/Layout.jsx`
   - main rounded dashboard shell
   - right-side slim vertical navigation

2. `src/components/SearchBar.jsx`
   - query input
   - category support (Books-first, multi-domain-ready)
   - submit navigates to `/search?q=...&category=books`

3. `src/components/CategoryPills.jsx`
   - pills/chips for Cars, Books, Restaurants, Recipes
   - current implementation keeps non-book categories as placeholders

4. `src/components/BookCard.jsx`
   - compact card with title, authors, year, isbn, cover
   - link to preview page (`/book/:bookId`)

---

## 8) Build Pages in Implementation Order

### A) `src/pages/HomePage.jsx`
Implement:
- hero section
- search bar
- category pills
- books recommendations
- genre filter chips (e.g., All/Fiction/Fantasy/etc.)
- right rail widgets (streak/top category/saved)
- optional mini preference quiz widget

### B) `src/pages/SearchResultsPage.jsx`
Implement:
- parse `q` and `category` from URL params
- call service layer for books
- render loading/success/error/empty states
- display result cards

### C) `src/pages/BookPreviewPage.jsx`
Implement:
- parse `bookId` route param
- fetch/derive book metadata + preview source
- render preview widget (or fallback link)
- render description/excerpt/comments/rating UI

---

## 9) Implement Books Service Layer

Create `src/services/OpenLibrary.js` as the **books domain abstraction layer**.

Responsibilities:
- search books by query
- normalize API response into UI-safe shape
- construct cover URLs
- resolve preview links and fallback logic
- return consistent fields used by components

Recommended normalized shape:

```js
{
  id,
  title,
  authors,
  year,
  isbn,
  coverImage,
  previewLink,
  previewEmbedUrl,
  hasPreview,
  description,
  excerpt,
  rating
}
```

---

## 10) Styling and Theme

Use:

- `src/index.css` for base tokens/global styles/theme variables
- `src/App.css` for app shell/page-level styling

Keep consistent:
- rounded corners
- card spacing
- compact metadata hierarchy
- responsive behavior for tablet/mobile
- focus-visible accessibility states

---

## 11) Add/Update Supporting Documentation

Maintain these docs as implementation evolves:

- `project/api/endpoints.md` — current endpoints and sample payloads
- `project/data/schema.md` — normalized model and field contracts
- `project/data/source.md` — data source references
- `project/design/style-guide.md` — visual rules/tokens
- `project/docs/IMPLEMENTATION_MANUAL.md` — architecture and phased implementation

---

## 12) Local Run Commands

From `project/web`:

```bash
npm install
npm run dev
```

Open local URL shown in terminal (commonly `http://localhost:5173`).
> NOTE: TO VIEW THE LOCALHOST, YOU HAVE TO COPY THE URL DIRECTLY. VITE BLOCKS THE GITHUB MADE APP!!! **In Codespaces, this usually happens because Vite is bound to localhost and/or strict host checks block the forwarded domain.**

---

## 13) Production Build Verification

From `project/web`:

```bash
npm run build
npm run preview
```

Confirm:
- app loads
- routes work directly
- search flow works
- preview page behavior and fallbacks are valid

---

## 14) Functional QA Checklist (Minimum)

1. Home page loads with recommendations
2. Search query navigates and renders results
3. Book card opens `/book/:bookId`
4. Preview works or shows fallback path cleanly
5. Comments/rating UI interactions work (client-side behavior)
6. Theme toggle/focus states/accessibility semantics are intact
7. Responsive layout at desktop/tablet/mobile
8. `npm run build` succeeds without errors

---

## 15) Typical Development Workflow

From repo root:

```bash
cd project/web
npm install
npm run dev
```

When finished:

```bash
npm run build
npm run preview
```

---

## 16) Scaling to Cars / Restaurants / Recipes

Follow same pattern:

- add domain service (`src/services/<domain>.js`)
- add domain card component (`src/components/<Domain>Card.jsx`)
- add/extend domain page (`src/pages/<Domain>SearchPage.jsx`)
- normalize each domain payload into a shared view model

This avoids large refactors and keeps UI consistent.

---

## 17) Quick File Creation Checklist

Use this when rebuilding quickly:

- [ ] Scaffold Vite React app in `project/web`
- [ ] Install `react-router-dom`
- [ ] Create `components/`, `pages/`, `services/` folders
- [ ] Add `Layout`, `SearchBar`, `CategoryPills`, `BookCard`
- [ ] Add `HomePage`, `SearchResultsPage`, `BookPreviewPage`
- [ ] Add `googleBooks.js` normalization/service logic
- [ ] Add app routing in `App.jsx`
- [ ] Finalize styles in `App.css` + `index.css`
- [ ] Build docs + run QA checklist
