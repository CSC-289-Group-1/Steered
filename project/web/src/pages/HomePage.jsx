import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BookCard from '../components/BookCard.jsx'
import CategoryPills from '../components/CategoryPills.jsx'
import Layout from '../components/Layout.jsx'
import SearchBar from '../components/SearchBar.jsx'
import {
  fetchBooksByGenre,
  fetchTrendingBooks,
  supportedGenres,
} from '../services/OpenLibrary.js'

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true">
      <path d="M15 5 8 12l7 7" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true">
      <path d="m9 5 7 7-7 7" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true">
      <path d="m5 12 4.2 4.2L19 6.5" />
    </svg>
  )
}

function HomePage({ theme, onToggleTheme }) {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [genre, setGenre] = useState('All')
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const quizQuestions = useMemo(
    () => [
      {
        id: 1,
        label: 'Favorite pace',
        options: ['Fast-paced', 'Balanced', 'Slow burn'],
      },
      {
        id: 2,
        label: 'Preferred length',
        options: ['Short reads', 'Medium', 'Long novels'],
      },
      {
        id: 3,
        label: 'Main mood',
        options: ['Inspiring', 'Chill', 'Intense'],
      },
      {
        id: 4,
        label: 'Read frequency',
        options: ['Daily', 'Weekly', 'Occasionally'],
      },
      {
        id: 5,
        label: 'Discovery style',
        options: ['Popular picks', 'Hidden gems', 'Mix of both'],
      },
    ],
    [],
  )
  const [quizStep, setQuizStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState({})

  useEffect(() => {
    async function loadInitialBooks() {
      setStatus('loading')
      setError('')
      try {
        const initialBooks = await fetchTrendingBooks()
        setBooks(initialBooks)
        setStatus('success')
      } catch (loadError) {
        setStatus('error')
        setError(loadError.message)
      }
    }

    loadInitialBooks()
  }, [])

  async function handleGenreSelect(nextGenre) {
    setGenre(nextGenre)
    setStatus('loading')
    setError('')
    try {
      const filteredBooks =
        nextGenre === 'All'
          ? await fetchTrendingBooks()
          : await fetchBooksByGenre(nextGenre)
      setBooks(filteredBooks)
      setStatus('success')
    } catch (loadError) {
      setStatus('error')
      setError(loadError.message)
    }
  }

  function handleSearch(query) {
    navigate(`/search?q=${encodeURIComponent(query)}&category=books`)
  }

  const bookOfDay = useMemo(() => books[0] ?? null, [books])
  const showcaseBooks = useMemo(() => books.slice(1, 10), [books])

  function handleQuizAnswerChange(questionId, value) {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  function handleQuizNext() {
    setQuizStep((prev) => Math.min(prev + 1, quizQuestions.length - 1))
  }

  function handleQuizBack() {
    setQuizStep((prev) => Math.max(prev - 1, 0))
  }

  const activeQuestion = quizQuestions[quizStep]
  const quizProgress = ((quizStep + 1) / quizQuestions.length) * 100

  return (
    <Layout theme={theme} onToggleTheme={onToggleTheme}>
      <section className="home-grid">
        <div className="home-main-col">
          <section className="hero-card">
            <div className="hero-copy">
              <h1 className="hero-title">Your reading universe starts today</h1>
              <p className="hero-subtitle">
                Discover books with rich previews, genre-based discovery, and a
                cleaner recommendation experience built for focus.
              </p>
              <button
                type="button"
                className="hero-cta"
                onClick={() => navigate('/search?category=books')}
              >
                Explore Library
              </button>
            </div>
            <div className="hero-graphic" aria-hidden="true">
              <div className="shape shape-a"></div>
              <div className="shape shape-b"></div>
              <div className="shape shape-c"></div>
            </div>
          </section>

          <section className="search-panel">
            <SearchBar onSearch={handleSearch} autoFocus />
            <CategoryPills />
          </section>

          <section className="section-card widget-row">
            <div className="widget book-of-day-widget">
              <p className="widget-label">Book of the day</p>
              {status === 'success' && bookOfDay && (
                <BookCard key={bookOfDay.id} book={bookOfDay} />
              )}
              {status === 'loading' && (
                <p className="status-message">Selecting book of the day...</p>
              )}
              {status === 'error' && <p className="status-message error">{error}</p>}
            </div>

            <div className="widget filter-widget">
              <div className="section-head">
                <h2 className="section-title">Discover by genre</h2>
                <p className="section-subtitle">
                  Tailor recommendations to your preferences.
                </p>
              </div>
              <div className="genre-filters" role="tablist" aria-label="Genre filters">
                {supportedGenres.map((item) => (
                  <button
                    key={item}
                    type="button"
                    role="tab"
                    aria-selected={genre === item}
                    className={`genre-chip${genre === item ? ' active' : ''}`}
                    onClick={() => handleGenreSelect(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="section-card">
            <div className="section-head">
              <h2 className="section-title">Recommended for you</h2>
              <p className="section-subtitle">
                Curated suggestions, enriched with Open Library descriptions.
              </p>
            </div>

            {status === 'loading' && (
              <p className="status-message">Loading recommendations...</p>
            )}
            {status === 'error' && (
              <p className="status-message error">{error}</p>
            )}

            {status === 'success' && (
              <div className="results-grid cards-home">
                {showcaseBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="featured-rail">
          <h3 className="rail-title">Quick widgets</h3>
          <div className="rail-widget compact">
            <p className="widget-label">Reading streak</p>
            <p className="rail-number">12 days</p>
            <p className="rail-muted">Keep momentum with 15 mins/day.</p>
          </div>

          <div className="rail-widget compact">
            <p className="widget-label">Top category</p>
            <p className="rail-number">Fantasy</p>
            <p className="rail-muted">Based on your latest activity.</p>
          </div>

          <div className="rail-widget compact">
            <p className="widget-label">Saved books</p>
            <p className="rail-number">27</p>
            <p className="rail-muted">Bookmarks are ready for your next session.</p>
          </div>

          <div className="rail-widget quiz-widget compact">
            <p className="widget-label">Preference check (demo)</p>
            <form className="mini-profile-form" onSubmit={(event) => event.preventDefault()}>
              <label>
                {activeQuestion.id}) {activeQuestion.label}
                <select
                  value={quizAnswers[activeQuestion.id] || activeQuestion.options[0]}
                  onChange={(event) =>
                    handleQuizAnswerChange(activeQuestion.id, event.target.value)
                  }
                >
                  {activeQuestion.options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>

              <div className="mini-quiz-actions icon-actions">
                <button
                  type="button"
                  className="mini-icon-btn"
                  onClick={handleQuizBack}
                  disabled={quizStep === 0}
                  aria-label="Previous question"
                  title="Previous question"
                >
                  <ArrowLeftIcon />
                </button>
                <button
                  type="button"
                  className="mini-icon-btn"
                  onClick={handleQuizNext}
                  disabled={quizStep === quizQuestions.length - 1}
                  aria-label="Next question"
                  title="Next question"
                >
                  <ArrowRightIcon />
                </button>
                <button
                  type="button"
                  className="mini-icon-btn save"
                  aria-label="Save quiz to profile"
                  title="Save quiz to profile"
                >
                  <CheckIcon />
                </button>
              </div>
              <p className="rail-muted">Saved locally for demo preview only.</p>
              <div
                className="mini-quiz-progress"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={Math.round(quizProgress)}
                aria-label="Quiz completion"
              >
                <div
                  className="mini-quiz-progress-fill"
                  style={{ width: `${quizProgress}%` }}
                ></div>
              </div>
            </form>
          </div>
        </aside>
      </section>
    </Layout>
  )
}

export default HomePage
