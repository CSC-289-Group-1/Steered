import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import { fetchBookDetailsById } from '../services/OpenLibrary.js'

function LinkOutIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true">
      <path d="M14 5h5v5" />
      <path d="M10 14 19 5" />
      <path d="M19 14v4a1 1 0 0 1-1 1h-12a1 1 0 0 1-1-1v-12a1 1 0 0 1 1-1h4" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true">
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.2 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3Z" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true">
      <path d="M2 12s3.8-6 10-6 10 6 10 6-3.8 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  )
}

function BookPreviewPage({ theme, onToggleTheme }) {
  const { bookId } = useParams()
  const [params] = useSearchParams()

  const initialTitle = params.get('title') || 'Untitled'
  const initialAuthors = params.get('authors') || 'Unknown'
  const initialYear = params.get('year') || 'N/A'
  const initialCover =
    params.get('cover') || 'https://via.placeholder.com/280x360?text=Book'
  const initialLink = params.get('link') || 'https://openlibrary.org/'
  const initialDescription =
    params.get('description') || 'No description available yet for this book.'

  const [book, setBook] = useState({
    id: bookId || '',
    title: initialTitle,
    authors: initialAuthors,
    year: initialYear,
    isbn: 'N/A',
    coverImage: initialCover,
    previewLink: initialLink,
    previewEmbedUrl: '',
    hasPreview: false,
    description: initialDescription,
    categories: [],
    rating: 'N/A',
    excerpt: 'No excerpt available.',
  })

  const [detailsStatus, setDetailsStatus] = useState('loading')
  const [detailsError, setDetailsError] = useState('')
  const [previewStage, setPreviewStage] = useState('loading')
  const [comments, setComments] = useState([])
  const [draftComment, setDraftComment] = useState('')
  const [userRating, setUserRating] = useState(0)

  useEffect(() => {
    async function loadDetails() {
      if (!bookId) {
        setDetailsStatus('error')
        setDetailsError('No book selected.')
        setPreviewStage('fallback')
        return
      }

      setDetailsStatus('loading')
      setDetailsError('')
      setPreviewStage('loading')

      try {
        const details = await fetchBookDetailsById(bookId)
        const merged = {
          ...details,
          title: details.title || initialTitle,
          authors: details.authors || initialAuthors,
          year: details.year || initialYear,
          coverImage: details.coverImage || initialCover,
          previewLink: details.previewLink || initialLink,
          description: details.description || initialDescription,
          excerpt: details.excerpt || 'No excerpt available.',
        }
        setBook(merged)
        setDetailsStatus('success')
        setPreviewStage(merged.hasPreview ? 'sourceNotice' : 'fallback')
      } catch (error) {
        setDetailsStatus('error')
        setDetailsError(error.message)
        setPreviewStage('fallback')
      }
    }

    loadDetails()
  }, [
    bookId,
    initialAuthors,
    initialCover,
    initialDescription,
    initialLink,
    initialTitle,
    initialYear,
  ])

  function handleSubmitComment(event) {
    event.preventDefault()
    const cleaned = draftComment.trim()
    if (!cleaned) return

    setComments((previous) => [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        text: cleaned,
        createdAt: new Date().toLocaleString(),
      },
      ...previous,
    ])
    setDraftComment('')
  }

  const ratingText = useMemo(() => {
    if (userRating === 0) return 'No rating yet'
    return `${userRating}.0 / 5`
  }, [userRating])

  return (
    <Layout theme={theme} onToggleTheme={onToggleTheme}>
      <section className="preview-page section-card">
        <div className="preview-cover-wrap">
          <img
            src={book.coverImage}
            alt={`Cover of ${book.title}`}
            className="preview-cover"
          />

          <div className="excerpt-widget" title={book.excerpt}>
            <h3>Book Excerpt</h3>
            <p>{book.excerpt}</p>
          </div>
        </div>

        <div className="preview-content">
          <div className="preview-actions preview-actions-top">
            <Link
              className="preview-link icon-back-link"
              to="/search"
              aria-label="Back to search"
            >
              <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true">
                <path d="M15 5 8 12l7 7" />
              </svg>
            </Link>

            <a
              className="preview-link icon-expand-link"
              href={book.previewLink}
              target="_blank"
              rel="noreferrer"
              aria-label="Open in Open Library"
            >
              <LinkOutIcon />
              <span>Open Library</span>
            </a>
          </div>

          <p className="preview-id">Book ID: {book.id || bookId}</p>
          <h1 className="preview-title">{book.title}</h1>

          <div className="preview-description-box">
            <div className="preview-meta-row">
              <p className="preview-meta">
                <strong>Author(s):</strong> {book.authors}
              </p>
              <p className="preview-meta">
                <strong>Published:</strong> {book.year}
              </p>
              <p className="preview-meta">
                <strong>ISBN:</strong> {book.isbn}
              </p>
              <p className="preview-meta">
                <strong>Overall rating:</strong> {book.rating}
              </p>
            </div>
            <h2>Description</h2>
            <p>{book.description}</p>
          </div>

          <section className="preview-widget">
            <h2>Book Preview</h2>

            {previewStage === 'loading' && (
              <div className="preview-state-screen">
                <p className="status-message">Loading preview widget...</p>
              </div>
            )}

            {previewStage === 'sourceNotice' && (
              <div className="preview-state-screen">
                <p className="status-message">
                  Preview source: Open Library / Internet Archive.
                </p>
                <button
                  type="button"
                  className="search-button eye-button"
                  onClick={() => setPreviewStage('open')}
                  aria-label="Open preview"
                  title="Open preview"
                >
                  <EyeIcon />
                </button>
              </div>
            )}

            {previewStage === 'open' && book.previewEmbedUrl && (
              <div className="preview-frame-wrap">
                <iframe
                  src={book.previewEmbedUrl}
                  title={`Preview of ${book.title}`}
                  width="560"
                  height="384"
                  frameBorder="0"
                  webkitallowfullscreen="true"
                  mozallowfullscreen="true"
                  allowFullScreen
                  className="preview-frame"
                  loading="lazy"
                ></iframe>
              </div>
            )}

            {previewStage === 'fallback' && (
              <div className="preview-state-screen">
                <p className="status-message">This book has no preview.</p>
              </div>
            )}
          </section>

          <section className="review-layout">
            <div className="review-section">
              <h2>Reviews & Comments</h2>
              <form className="review-form" onSubmit={handleSubmitComment}>
                <label htmlFor="review-input" className="visually-hidden">
                  Add a comment
                </label>
                <textarea
                  id="review-input"
                  className="review-input"
                  placeholder="Write your thoughts about this book..."
                  value={draftComment}
                  onChange={(event) => setDraftComment(event.target.value)}
                  rows={3}
                />
                <button type="submit" className="search-button">
                  Post Comment
                </button>
              </form>

              <div className="comment-list">
                {comments.length === 0 && (
                  <p className="status-message">
                    No comments yet. Be the first to add a review.
                  </p>
                )}
                {comments.map((comment) => (
                  <article key={comment.id} className="comment-item">
                    <p>{comment.text}</p>
                    <span>{comment.createdAt}</span>
                  </article>
                ))}
              </div>
            </div>

            <aside className="rating-widget rail-widget compact">
              <h3>User rating</h3>
              <p className="rating-value">{ratingText}</p>
              <div className="star-row" role="radiogroup" aria-label="Rate this book from 1 to 5">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`star-btn${userRating >= value ? ' active' : ''}`}
                    onClick={() => setUserRating(value)}
                    aria-label={`${value} star${value > 1 ? 's' : ''}`}
                    role="radio"
                    aria-checked={userRating === value}
                  >
                    <StarIcon />
                  </button>
                ))}
              </div>
              <p className="rail-muted">Tap a star to set your local rating.</p>
            </aside>
          </section>

          {detailsStatus === 'error' && (
            <p className="status-message error">{detailsError}</p>
          )}
        </div>
      </section>
    </Layout>
  )
}

export default BookPreview