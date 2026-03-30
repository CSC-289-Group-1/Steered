import { useState } from 'react'

function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon-svg category-icon" aria-hidden="true">
      <path d="M4 14h16l-1.5-5a2 2 0 0 0-1.9-1.4H7.4A2 2 0 0 0 5.5 9L4 14Z" />
      <circle cx="7.5" cy="16.5" r="1.6" />
      <circle cx="16.5" cy="16.5" r="1.6" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon-svg category-icon" aria-hidden="true">
      <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17h-12a2.5 2.5 0 0 0-2.5 2.5V4.5Z" />
      <path d="M8 6h8M8 9h8M8 12h6" />
    </svg>
  )
}

function ShopIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon-svg category-icon" aria-hidden="true">
      <path d="M4 9h16l-1 11H5L4 9Z" />
      <path d="M3 9 5.5 4h13L21 9" />
      <path d="M9 13h6v7H9z" />
    </svg>
  )
}

function RecipeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon-svg category-icon" aria-hidden="true">
      <path d="M4 8h16v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V8Z" />
      <path d="M8 8V6a4 4 0 1 1 8 0v2" />
    </svg>
  )
}

const CATEGORIES = [
  { name: 'Cars', Icon: CarIcon, disabled: true },
  { name: 'Books', Icon: BookIcon, disabled: false },
  { name: 'Restaurants', Icon: ShopIcon, disabled: true },
  { name: 'Recipes', Icon: RecipeIcon, disabled: true },
]

function CategoryPills() {
  const [expanded, setExpanded] = useState('Books')

  return (
    <section aria-label="Recommendation categories" className="categories-wrap">
      {CATEGORIES.map((category) => {
        const Icon = category.Icon
        const isExpanded = expanded === category.name || category.name === 'Books'

        return (
          <button
            key={category.name}
            type="button"
            className={`category-pill${category.name === 'Books' ? ' is-active' : ''}`}
            disabled={category.disabled}
            aria-pressed={category.name === 'Books'}
            onClick={() => setExpanded(category.name)}
            onMouseEnter={() => setExpanded(category.name)}
            onFocus={() => setExpanded(category.name)}
          >
            <Icon />
            <span className={`category-label${isExpanded ? ' show' : ''}`}>
              {category.name}
            </span>
          </button>
        )
      })}
    </section>
  )
}

export default CategoryPills
