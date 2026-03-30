# STEERED Project — Step-by-Step Build Guide (From SCRATCH!!!)

> TO VIEW THE LOCALHOST, YOU HAVE TO COPY THE URL DIRECTLY. VITE BLOCKS THE GITHUB MADE APP!!!
This guide explains how to recreate the current **Books(?) recommendation project** end-to-end, including:

- folders/files to create
- commands to run
- implementation order
- verification steps

It complements:
- `absoludation/docs/IMPLEMENTATION_MANUAL.md` (architecture + scaling guidance)
- `absoludation/web/MANUAL_SETUP_AND_RUN.md` (quick run commands)

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

Inside `absoludation/web`, ensure these files/folders exist:

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
      googleBooks.js
```

Project documentation files at repo level:

```txt
absoludation/
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