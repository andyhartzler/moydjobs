import Link from 'next/link'
import Image from 'next/image'
import { MobileMenu } from './MobileMenu'

export default function Header() {
  return (
    <header className="relative z-50">
      {/* Header Title Nav Wrapper */}
      <div className="header-title-nav-wrapper flex items-center justify-between" style={{
        paddingLeft: '2.7vw',
        paddingRight: '2.7vw',
        paddingTop: '20px',
        paddingBottom: '20px',
        minHeight: '68px',
        height: 'auto'
      }}>
        {/* Logo */}
        <Link href="https://moyoungdemocrats.org" className="flex items-center relative z-50">
          <Image
            src="/text-logo-960png.png"
            alt="Missouri Young Democrats"
            width={143}
            height={68}
            className="w-auto h-[30px] md:h-[68px]"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center" style={{ gap: '0.8vw' }}>
          <Link
            href="https://moyoungdemocrats.org/our-team"
            className="text-white hover:text-white/80 transition-colors uppercase"
            style={{
              fontFamily: 'Montserrat',
              fontStyle: 'normal',
              fontWeight: 800,
              fontSize: '1.1rem',
              height: '1.8vw',
              letterSpacing: '-0.07em'
            }}
          >
            OUR TEAM
          </Link>
          <Link
            href="https://moyoungdemocrats.org/chapters"
            className="text-white hover:text-white/80 transition-colors uppercase"
            style={{
              fontFamily: 'Montserrat',
              fontStyle: 'normal',
              fontWeight: 800,
              fontSize: '1.1rem',
              height: '1.8vw',
              letterSpacing: '-0.07em'
            }}
          >
            CHAPTERS
          </Link>
          <Link
            href="https://events.moyoungdemocrats.org"
            className="text-white hover:text-white/80 transition-colors uppercase"
            style={{
              fontFamily: 'Montserrat',
              fontStyle: 'normal',
              fontWeight: 800,
              fontSize: '1.1rem',
              height: '1.8vw',
              letterSpacing: '-0.07em'
            }}
          >
            EVENTS
          </Link>
          <Link
            href="/"
            className="text-white hover:text-white/80 transition-colors uppercase"
            style={{
              fontFamily: 'Montserrat',
              fontStyle: 'normal',
              fontWeight: 800,
              fontSize: '1.1rem',
              height: '1.8vw',
              letterSpacing: '-0.07em',
              textDecoration: 'underline'
            }}
          >
            JOBS
          </Link>
          <Link
            href="https://moyoungdemocrats.org/about"
            className="text-white hover:text-white/80 transition-colors uppercase"
            style={{
              fontFamily: 'Montserrat',
              fontStyle: 'normal',
              fontWeight: 800,
              fontSize: '1.1rem',
              height: '1.8vw',
              letterSpacing: '-0.07em'
            }}
          >
            ABOUT
          </Link>
          <Link
            href="https://moyoungdemocrats.org/donate"
            className="text-white hover:text-white/80 transition-colors uppercase"
            style={{
              fontFamily: 'Montserrat',
              fontStyle: 'normal',
              fontWeight: 800,
              fontSize: '1.1rem',
              height: '1.8vw',
              letterSpacing: '-0.07em'
            }}
          >
            DONATE
          </Link>
          <Link
            href="https://moyoungdemocrats.org/contact"
            className="text-white hover:text-white/80 transition-colors uppercase"
            style={{
              fontFamily: 'Montserrat',
              fontStyle: 'normal',
              fontWeight: 800,
              fontSize: '1.1rem',
              height: '1.8vw',
              letterSpacing: '-0.07em'
            }}
          >
            CONTACT
          </Link>
          <Link
            href="https://members.moyoungdemocrats.org"
            className="text-white hover:text-white/80 transition-colors uppercase"
            style={{
              fontFamily: 'Montserrat',
              fontStyle: 'normal',
              fontWeight: 800,
              fontSize: '1.1rem',
              height: '1.8vw',
              letterSpacing: '-0.07em'
            }}
          >
            MEMBERS
          </Link>
        </nav>

        {/* Mobile Menu */}
        <MobileMenu />
      </div>
    </header>
  )
}
