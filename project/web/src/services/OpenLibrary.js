const OPEN_LIBRARY_SEARCH_URL = 'https://openlibrary.org/search.json'
const OPEN_LIBRARY_WORKS_URL = 'https://openlibrary.org'
const COVER_BASE_URL = 'https://covers.openlibrary.org/b/id'
const FALLBACK_COVER = 'https://via.placeholder.com/240x320?text=Book'

const TRENDING_QUERIES = [
  'bestseller',
  'award winning fiction',
  'popular fantasy',
  'notable mystery',
]

const GENRE_TO_QUERY = {
  All: 'bestseller',
  Fiction: 'fiction',
  Fantasy: 'fantasy',
  Romance: 'romance',
  History: 'history',
  'Sci-Fi': 'science fiction',
  Mystery: 'mystery',
}

const worksDescriptionCache = new Map()
const authorNameCache = new Map()

function extractWorkKey(doc) {
  if (doc.key && doc.key.startsWith('/works/')) return doc.key
  if (Array.isArray(doc.seed)) {
    const found = doc.seed.find(
      (item) => typeof item === 'string' && item.startsWith('/works/'),
    )
    if (found) return found
  }
  return null
}

function normalizeDescription(description) {
  if (!description) return ''
  if (typeof description === 'string') return description
  if (typeof description === 'object' && typeof description.value === 'string') {
    return description.value
  }
  return ''
}

function excerptFromText(text = '') {
  if (!text) return 'No excerpt available.'
  if (text.length <= 160) return text
  return `${text.slice(0, 160)}...`
}

function buildPreviewEmbedUrl(archiveId) {
  if (!archiveId) return ''
  return `https://archive.org/embed/${archiveId}`
}

function extractArchiveIdFromUrl(url = '') {
  if (typeof url !== 'string') return ''
  const detailsMatch = url.match(/archive\.org\/details\/([^/?#]+)/)
  const embedMatch = url.match(/archive\.org\/embed\/([^/?#]+)/)
  return detailsMatch?.[1] || embedMatch?.[1] || ''
}

function buildOpenLibraryPreviewUrl(workKey) {
  if (!workKey) return ''
  return `${OPEN_LIBRARY_WORKS_URL}${workKey}#bookPreview`
}

async function fetchWorkDescription(workKey) {
  if (!workKey) return ''
  if (worksDescriptionCache.has(workKey)) {
    return worksDescriptionCache.get(workKey)
  }

  try {
    const response = await fetch(`${OPEN_LIBRARY_WORKS_URL}${workKey}.json`)
    if (!response.ok) {
      worksDescriptionCache.set(workKey, '')
      return ''
    }
    const data = await response.json()
    const desc = normalizeDescription(data.description)
    worksDescriptionCache.set(workKey, desc)
    return desc
  } catch {
    worksDescriptionCache.set(workKey, '')
    return ''
  }
}

function buildFallbackDescription(doc) {
  if (Array.isArray(doc.first_sentence) && doc.first_sentence[0]) {
    return String(doc.first_sentence[0])
  }
  if (typeof doc.first_sentence === 'string') {
    return doc.first_sentence
  }
  if (Array.isArray(doc.subject) && doc.subject.length > 0) {
    return `Topics: ${doc.subject.slice(0, 8).join(', ')}.`
  }
  return 'No description available yet for this title.'
}

function normalizeDoc(doc, index = 0) {
  const title = doc.title || 'Untitled'
  const authors = Array.isArray(doc.author_name)
    ? doc.author_name.join(', ')
    : 'Unknown'
  const year = doc.first_publish_year ? String(doc.first_publish_year) : 'N/A'
  const isbn = Array.isArray(doc.isbn) && doc.isbn.length > 0 ? doc.isbn[0] : 'N/A'
  const coverImage = doc.cover_i
    ? `${COVER_BASE_URL}/${doc.cover_i}-M.jpg`
    : FALLBACK_COVER

  const workKey = extractWorkKey(doc) || doc.key || ''
  const previewLink = doc.key
    ? `https://openlibrary.org${doc.key}`
    : `https://openlibrary.org/search?q=${encodeURIComponent(title)}`

  const fallbackDescription = buildFallbackDescription(doc)
  const coverSeed = String(doc.cover_i || title || index)
  const archiveId = Array.isArray(doc.ia) && doc.ia.length > 0 ? doc.ia[0] : ''

  return {
    id: doc.key || `${title}-${index}`,
    title,
    authors,
    year,
    isbn,
    categories: Array.isArray(doc.subject) ? doc.subject : [],
    coverImage,
    previewLink,
    description: fallbackDescription,
    fallbackDescription,
    coverSeed,
    workKey,
    archiveId,
    previewEmbedUrl: buildPreviewEmbedUrl(archiveId),
    hasPreview: Boolean(archiveId),
    rating: 'N/A',
    excerpt: excerptFromText(fallbackDescription),
  }
}

function dedupeById(books) {
  const seen = new Set()
  return books.filter((book) => {
    if (seen.has(book.id)) return false
    seen.add(book.id)
    return true
  })
}

function shuffle(array) {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

async function enrichDescriptions(books) {
  const enriched = await Promise.all(
    books.map(async (book) => {
      const remoteDescription = await fetchWorkDescription(book.workKey)
      const finalDescription = remoteDescription || book.fallbackDescription
      return {
        ...book,
        description: finalDescription,
        excerpt: excerptFromText(finalDescription),
      }
    }),
  )
  return enriched
}

async function fetchDocs(query, limit = 24) {
  const endpoint = `${OPEN_LIBRARY_SEARCH_URL}?q=${encodeURIComponent(query)}&limit=${limit}`
  const response = await fetch(endpoint)

  if (!response.ok) {
    throw new Error('Failed to fetch books. Please try again.')
  }

  const data = await response.json()
  const docs = Array.isArray(data.docs) ? data.docs : []
  const normalized = docs.map((doc, index) => normalizeDoc(doc, index))
  return enrichDescriptions(normalized)
}

async function fetchAuthorName(authorKey) {
  if (!authorKey) return ''
  if (authorNameCache.has(authorKey)) return authorNameCache.get(authorKey)

  try {
    const response = await fetch(`${OPEN_LIBRARY_WORKS_URL}${authorKey}.json`)
    if (!response.ok) {
      authorNameCache.set(authorKey, '')
      return ''
    }

    const data = await response.json()
    const name = typeof data?.name === 'string' ? data.name : ''
    authorNameCache.set(authorKey, name)
    return name
  } catch {
    authorNameCache.set(authorKey, '')
    return ''
  }
}

function deriveNumericRating(workData) {
  const ratingValue = workData?.ratings_average
  if (typeof ratingValue === 'number' && Number.isFinite(ratingValue)) {
    return `${ratingValue.toFixed(1)} / 5`
  }
  return 'N/A'
}

export async function fetchBookDetailsById(bookId) {
  const workKey =
    typeof bookId === 'string' && bookId.startsWith('/works/')
      ? bookId
      : `/works/${String(bookId || '').replace(/^\/+/, '')}`

  const workRes = await fetch(`${OPEN_LIBRARY_WORKS_URL}${workKey}.json`)
  if (!workRes.ok) {
    throw new Error('Unable to load book details from Open Library.')
  }

  const workData = await workRes.json()
  const title = workData.title || 'Untitled'
  const description =
    normalizeDescription(workData.description) ||
    'No description available yet for this book.'

  const subjects = Array.isArray(workData.subjects) ? workData.subjects : []
  const authorRefs = Array.isArray(workData.authors)
    ? workData.authors.map((a) => a?.author?.key).filter(Boolean)
    : []

  let authors = 'Unknown'
  if (authorRefs.length > 0) {
    const fetchedNames = await Promise.all(
      authorRefs.slice(0, 4).map((authorRef) => fetchAuthorName(authorRef)),
    )
    const validNames = fetchedNames.filter(Boolean)
    authors =
      validNames.length > 0 ? validNames.join(', ') : `Author ref(s): ${authorRefs.slice(0, 3).join(', ')}`
  }

  const year =
    typeof workData.first_publish_date === 'string'
      ? workData.first_publish_date
      : 'N/A'

  const coverId =
    Array.isArray(workData.covers) && workData.covers.length > 0
      ? workData.covers[0]
      : null

  const coverImage = coverId
    ? `${COVER_BASE_URL}/${coverId}-L.jpg`
    : FALLBACK_COVER

  let archiveId = ''

  if (typeof workData?.ocaid === 'string' && workData.ocaid) {
    archiveId = workData.ocaid
  }

  if (!archiveId && Array.isArray(workData?.identifiers?.ia) && workData.identifiers.ia.length > 0) {
    archiveId = workData.identifiers.ia[0]
  }

  if (!archiveId && Array.isArray(workData.links) && workData.links.length > 0) {
    const foundArchive = workData.links.find(
      (link) =>
        typeof link?.url === 'string' &&
        (link.url.includes('archive.org/details/') ||
          link.url.includes('archive.org/embed/')),
    )

    if (foundArchive?.url) {
      archiveId = extractArchiveIdFromUrl(foundArchive.url)
    }
  }

  const archivePreviewUrl = buildPreviewEmbedUrl(archiveId)
  const openLibraryPreviewUrl = buildOpenLibraryPreviewUrl(workKey)

  const previewEmbedUrl = archivePreviewUrl || openLibraryPreviewUrl
  const previewSource = archivePreviewUrl ? 'archive' : openLibraryPreviewUrl ? 'openlibrary' : 'none'
  const hasPreview = Boolean(previewEmbedUrl)

  return {
    id: workKey,
    title,
    authors,
    year,
    isbn: 'N/A',
    categories: subjects,
    coverImage,
    previewLink: `${OPEN_LIBRARY_WORKS_URL}${workKey}`,
    previewEmbedUrl,
    hasPreview,
    description,
    excerpt: excerptFromText(description),
    rating: deriveNumericRating(workData),
    archiveId,
    previewSource,
  }
}

export async function searchBooks(query) {
  return fetchDocs(query, 24)
}

export async function fetchTrendingBooks() {
  const resultSets = await Promise.all(
    TRENDING_QUERIES.map((query) => fetchDocs(query, 12).catch(() => [])),
  )

  const merged = dedupeById(resultSets.flat())
  return shuffle(merged).slice(0, 18)
}

export async function fetchBooksByGenre(genre) {
  const query = GENRE_TO_QUERY[genre] || GENRE_TO_QUERY.All
  const books = await fetchDocs(query, 24)

  if (genre === 'All') return books

  const genreLower = genre.toLowerCase().replace('-', ' ')
  const strictMatches = books.filter((book) =>
    book.categories.some((category) =>
      category.toLowerCase().includes(genreLower),
    ),
  )

  return strictMatches.length > 0 ? strictMatches : books
}

export const supportedGenres = Object.keys(GENRE_TO_QUERY)
