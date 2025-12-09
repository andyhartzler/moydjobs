'use client'

export default function MembersOnlyBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl" style={{ maxHeight: '300px' }}>
      {/* Fake blurred job cards underneath */}
      <div className="grid gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 filter blur-[8px] opacity-60">
        {/* Fake job card 1 */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-yellow-500 rounded-full mb-2">
            Featured
          </span>
          <div className="h-4 md:h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 md:h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="flex gap-2 mb-3">
            <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
              FULL-TIME
            </span>
          </div>
          <div className="h-3 md:h-4 bg-gray-200 rounded w-2/3"></div>
        </div>

        {/* Fake job card 2 */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="h-4 md:h-5 bg-gray-300 rounded w-4/5 mb-2"></div>
          <div className="h-3 md:h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
          <div className="flex gap-2 mb-3">
            <span className="inline-block px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
              INTERNSHIP
            </span>
          </div>
          <div className="h-3 md:h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Fake job card 3 */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="h-4 md:h-5 bg-gray-300 rounded w-2/3 mb-2"></div>
          <div className="h-3 md:h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="flex gap-2 mb-3">
            <span className="inline-block px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
              VOLUNTEER
            </span>
          </div>
          <div className="h-3 md:h-4 bg-gray-200 rounded w-3/4"></div>
        </div>

        {/* Fake job card 4 */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="h-4 md:h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 md:h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="flex gap-2 mb-3">
            <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
              PART-TIME
            </span>
          </div>
          <div className="h-3 md:h-4 bg-gray-200 rounded w-2/3"></div>
        </div>

        {/* Fake job card 5 - hidden on mobile */}
        <div className="hidden md:block bg-white rounded-lg shadow p-6">
          <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-yellow-500 rounded-full mb-2">
            Featured
          </span>
          <div className="h-5 bg-gray-300 rounded w-4/5 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
          <div className="flex gap-2 mb-3">
            <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
              FULL-TIME
            </span>
          </div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Fake job card 6 - hidden on mobile */}
        <div className="hidden md:block bg-white rounded-lg shadow p-6">
          <div className="h-5 bg-gray-300 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="flex gap-2 mb-3">
            <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
              CONTRACT
            </span>
          </div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>

      {/* Overlay with buttons */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
        <div className="text-center px-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center">
            <a
              href="https://members.moyoungdemocrats.org/dashboard/opportunities"
              className="inline-block px-6 py-3 rounded-lg bg-white border-2 transition-all duration-200 hover:bg-gray-50"
              style={{
                borderColor: '#273351',
                color: '#273351',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600
              }}
            >
              Sign In to View Jobs
            </a>
            <span className="text-gray-500 font-medium text-sm">or</span>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSd5Hd_cgdFmgE7f9gdIxmwXSAdxkuFuITENO_x5VkhDrtR8Ag/viewform?usp=header"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-lg bg-white border-2 transition-all duration-200 hover:bg-gray-50"
              style={{
                borderColor: '#273351',
                color: '#273351',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600
              }}
            >
              Become a Member
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
