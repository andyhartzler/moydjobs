import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
              MOYD Jobs
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            <Link
              href="/submit"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Post a Job
            </Link>
            <a
              href="https://members.moyoungdemocrats.org/login"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Member Login
            </a>
            <a
              href="https://moyoungdemocrats.org"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Main Site
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
