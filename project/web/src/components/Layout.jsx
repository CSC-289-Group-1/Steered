import { Link, useLocation } from 'react-router-dom'

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5v9a1 1 0 0 1-1 1h-5.5v-7h-5v7H4a1 1 0 0 1-1-1v-9Z" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 5 5" />
    </svg>
  )
}

function CompassIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m15.7 8.3-2.8 6.2-6.2 2.8 2.8-6.2 6.2-2.8Z" />
    </svg>
  )
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true">
      <path d="M6 3h12v18l-6-3.8L6 21V3Z" />
    </svg>
  )
}

const NAV_ITEMS = [
  { label: 'Home', Icon: HomeIcon, to: '/' },
  { label: 'Search', Icon: SearchIcon, to: '/search' },
  { label: 'Discovery', Icon: CompassIcon, to: '/search?tab=discovery' },
  { label: 'Bookmarks', Icon: BookmarkIcon, to: '/search?tab=bookmarks' },
]

const TOP_MENU = [
  { label: 'Dashboard', href: '/' },
  { label: 'Docs', href: '#' },
  { label: 'APIs', href: '#' },
  { label: 'GitHub', href: 'https://github.com/' },
]

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.2 2.2M16.9 16.9l2.2 2.2M19.1 4.9l-2.2 2.2M7.1 16.9l-2.2 2.2" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 1 0 10.5 10.5Z" />
    </svg>
  )
}

function Layout({ children, theme = 'light', onToggleTheme }) {
  const location = useLocation()

  return (
    <div className="page-shell">
      <main className="content-area">
        <header className="top-header">
          <div className="brand">
            <span className="brand-dot" aria-hidden="true"></span>
            <span className="brand-name">STEERED</span>
          </div>

          <nav className="top-menu" aria-label="Top menu">
            {TOP_MENU.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="menu-link"
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="top-actions">
            <div className="user-pill">
              <span className="avatar" aria-hidden="true">
                SR
              </span>
              <span>Hi, Reader</span>
            </div>
            <button type="button" className="primary-pill">
              Start Reading
            </button>
            <button
              type="button"
              className="theme-pill icon-only"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={theme === 'light' ? 'Enable dark mode' : 'Enable light mode'}
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
          </div>
        </header>

        {children}
      </main>

      <nav className="right-nav" aria-label="Primary navigation">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.to === '/'
              ? location.pathname === '/'
              : item.to.startsWith('/search') && location.pathname === '/search'
          const Icon = item.Icon

          return (
            <Link
              key={item.label}
              to={item.to}
              className={`nav-icon-btn${isActive ? ' active' : ''}`}
              aria-label={item.label}
              title={item.label}
            >
              <Icon />
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default Layout
