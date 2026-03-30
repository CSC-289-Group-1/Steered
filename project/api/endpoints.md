# STEERED API Endpoints Reference

This document defines the endpoint strategy for the STEERED recommendation platform. Can be updated as/if implementations are made.

- Current implementation status: **Books (only?)**
- Current architecture: **Frontend React app calls external data sources directly through a service layer**
- Internal backend: **Not implemented yet** (planned for future consolidation)

---

## 1) API Architecture Overview

## Current (Implemented)
- UI routes call functions in `web/src/services/OpenLibrary.js`
- Service functions fetch and normalize data from:
  - Open Library Search + metadata endpoints
  - Open Library Covers API
  - Archive/Open Library preview-compatible links (fallback flow)

## Planned (Future)
- Add backend/API gateway (recommended) to:
  - unify all category providers (Books/Cars/Restaurants/Recipes)
  - handle API keys securely server-side
  - cache responses and apply retry/rate-limit policies centrally

---

## 2) Implemented External Endpoints (Books)

> Note: The service filename is `googleBooks.js` for project continuity, but current data source behavior is Open Library/Archive-compatible.

## 2.1 Open Library Search
- **Method:** `GET`
- **URL:** `https://openlibrary.org/search.json`
- **Primary use:** Query books for homepage recommendations and search results

### Query Params
- `q` (required): search query
- Optional common params:
  - `limit`
  - `page`
  - `language`
  - `subject`

### Example
```bash
curl "https://openlibrary.org/search.json?q=best%20sellers&limit=20"
```

### Key fields typically used from response docs
- `key`
- `title`
- `author_name`
- `first_publish_year`
- `isbn`
- `cover_i`
- `language`
- `subject`
