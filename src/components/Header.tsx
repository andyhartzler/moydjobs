import Link from 'next/link'

export default function Header() {
  return (
    <header className="relative z-50">
      <div
        className="flex items-center justify-between"
        style={{
          paddingLeft: "2.7vw",
          paddingRight: "2.7vw",
          paddingTop: "20px",
          paddingBottom: "20px",
          minHeight: "68px",
          height: "auto",
        }}
      >
        {/* Logo/Title */}
        <Link href="/" className="flex items-center relative z-50">
          <span
            className="text-white hover:text-white/80 transition-colors"
            style={{
              fontFamily: "Montserrat",
              fontStyle: "normal",
              fontWeight: 800,
              fontSize: "1.5rem",
              letterSpacing: "-0.07em",
              textTransform: "uppercase",
            }}
          >
            MOYD JOBS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center" style={{ gap: "0.8vw" }}>
          <Link
            href="/"
            className="text-white hover:text-white/80 transition-colors uppercase"
            style={{
              fontFamily: "Montserrat",
              fontStyle: "normal",
              fontWeight: 800,
              fontSize: "1.1rem",
              letterSpacing: "-0.07em",
            }}
          >
            JOBS
          </Link>
          <Link
            href="/submit"
            className="text-white hover:text-white/80 transition-colors uppercase"
            style={{
              fontFamily: "Montserrat",
              fontStyle: "normal",
              fontWeight: 800,
              fontSize: "1.1rem",
              letterSpacing: "-0.07em",
            }}
          >
            POST A JOB
          </Link>
          <a
            href="https://events.moyoungdemocrats.org"
            className="text-white hover:text-white/80 transition-colors uppercase"
            style={{
              fontFamily: "Montserrat",
              fontStyle: "normal",
              fontWeight: 800,
              fontSize: "1.1rem",
              letterSpacing: "-0.07em",
            }}
          >
            EVENTS
          </a>
          <a
            href="https://members.moyoungdemocrats.org"
            className="text-white hover:text-white/80 transition-colors uppercase"
            style={{
              fontFamily: "Montserrat",
              fontStyle: "normal",
              fontWeight: 800,
              fontSize: "1.1rem",
              letterSpacing: "-0.07em",
            }}
          >
            MEMBERS
          </a>
          <a
            href="https://moyoungdemocrats.org"
            className="text-white hover:text-white/80 transition-colors uppercase"
            style={{
              fontFamily: "Montserrat",
              fontStyle: "normal",
              fontWeight: 800,
              fontSize: "1.1rem",
              letterSpacing: "-0.07em",
            }}
          >
            MAIN SITE
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" aria-label="Menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  )
}
