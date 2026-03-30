import { useState } from 'react'

function SearchBar({ initialValue = '', onSearch, autoFocus = false }) {
  const [query, setQuery] = useState(initialValue)

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    onSearch(trimmed)
  }

  return (
    <form className="search-form" onSubmit={handleSubmit} role="search">
      <label htmlFor="global-search" className="sr-only">
        Search recommendations
      </label>
      <input
        id="global-search"
        type="search"
        autoFocus={autoFocus}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search cars, books, restaurants, recipes..."
        className="search-input"
      />
      <button className="search-button" type="submit">
        Search
      </button>
    </form>
  )
}

export default SearchBar
