import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BookCard from '../components/BookCard.jsx'
import CategoryPills from '../components/CategoryPills.jsx'
import Layout from '../components/Layout.jsx'
import SearchBar from '../components/SearchBar.jsx'
import { fetchTrendingBooks, searchBooks } from '../services/OpenLibrary.js'

const ACCENTS = ['blue', 'yellow', 'pink']

function SearchResultsPage({ theme, onToggleTheme }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') ?? ''

  const [books, setBooks] = useState([])
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function runSearch() {
      setStatus('loading')
      setErrorMessage('')

      try {
        const result = query.trim()
          ? await searchBooks(query)
          : await fetchTrendingBooks()
        setBooks(result)
        setStatus('success')
      } catch (error) {
        setStatus('error')
        setErrorMessage(error.message)
      }
    }

    runSearch()
  }, [query])

  function handleSearch(nextQuery) {
    navigate(`/search?q=${encodeURIComponent(nextQuery)}&category=books`)
  }

  const sectionTitle = query.trim()
    ? `Results for “${query}”`
    : 'Trending recommendations'

  const displayBooks = useMemo(() => books.slice(0, 18), [books])

  return (
    <Layout theme={theme} onToggleTheme={onToggleTheme}>
      <section className="results-header section-card">
        <h1 className="results-title">Books</h1>
        <p className="results-subtitle">
          Search results powered by Open Library metadata API
        </p>
        <SearchBar initialValue={query} onSearch={handleSearch} />
        <CategoryPills />
      </section>

      <section className="section-card results-section" aria-live="polite">
        <div className="section-head">
          <h2 className="section-title">{sectionTitle}</h2>
          <p className="section-subtitle">
            Showing title, author, publication year, ISBN, cover, and details link.
          </p>
        </div>

        {status === 'loading' && <p className="status-message">Loading books...</p>}

        {status === 'error' && (
          <p className="status-message error">{errorMessage}</p>
        )}

        {status === 'success' && displayBooks.length === 0 && (
          <p className="status-message">No books found for “{query}”.</p>
        )}

        {status === 'success' && displayBooks.length > 0 && (
          <div className="results-grid">
            {displayBooks.map((book, index) => (
              <BookCard
                key={book.id}
                book={book}
                accent={ACCENTS[index % ACCENTS.length]}
              />
            ))}
          </div>
        )}
      </section>
    </Layout>
  )
}

export default SearchResultsPage
