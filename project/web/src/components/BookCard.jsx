import { Link } from 'react-router-dom'

function clampText(value = '', max = 120) {
  if (value.length <= max) return value
  return `${value.slice(0, max)}...`
}

function BookCard({ book }) {
  const previewQuery = new URLSearchParams({
    title: book.title,
    authors: book.authors,
    year: book.year,
    cover: book.coverImage,
    link: book.previewLink,
    description: book.description || '',
  })

  return (
    <article className="book-card square">
      <div className="book-cover-wrap">
        <img
          src={book.coverImage}
          alt={`Cover of ${book.title}`}
          className="book-cover"
          loading="lazy"
        />
      </div>

      <div className="book-body">
        <p className="book-year">{book.year}</p>
        <h3 className="book-title">{clampText(book.title, 72)}</h3>
        <p className="book-meta">
          <strong>Author:</strong> {clampText(book.authors, 68)}
        </p>

        <div className="book-hover-preview">
          {clampText(book.description || 'No description available yet.', 150)}
        </div>

        <Link
          className="preview-link icon-button"
          to={`/book/${encodeURIComponent(book.id)}?${previewQuery.toString()}`}
          aria-label={`View preview for ${book.title}`}
          title="View Preview"
        >
          <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true">
            <path d="M2 12s3.8-6 10-6 10 6 10 6-3.8 6-10 6-10-6-10-6Z" />
            <circle cx="12" cy="12" r="2.8" />
          </svg>
        </Link>
      </div>
    </article>
  )
}

export default BookCard
