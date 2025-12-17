import { createAdminClient } from '@/lib/supabase-admin'

interface UnsubscribePageProps {
  searchParams: Promise<{ member?: string; type?: string }>
}

export default async function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
  const params = await searchParams
  const memberId = params.member
  const type = params.type

  // Validate parameters
  if (!memberId || !type) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">Invalid Link</h1>
            <p className="text-gray-600 mb-6">
              This unsubscribe link is invalid or incomplete.
            </p>
            <a
              href="https://members.moyoungdemocrats.org/dashboard"
              className="inline-block px-6 py-3 rounded-md text-white font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#273351' }}
            >
              Go to Members Portal
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Handle the unsubscribe
  let success = false
  let errorMessage = ''

  try {
    const supabase = createAdminClient()

    if (type === 'job_alerts') {
      const { error } = await supabase
        .from('members')
        .update({ subscribed_to_job_alerts: false })
        .eq('id', memberId)

      if (error) {
        errorMessage = error.message
      } else {
        success = true
      }
    } else {
      errorMessage = 'Unknown unsubscribe type'
    }
  } catch (err: any) {
    errorMessage = err.message || 'An unexpected error occurred'
  }

  if (success) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">Unsubscribed!</h1>
            <p className="text-gray-600 mb-6">
              You have been successfully unsubscribed from job alerts. You will no longer receive email notifications about new job postings.
            </p>
            <a
              href="https://members.moyoungdemocrats.org/dashboard"
              className="inline-block px-6 py-3 rounded-md text-white font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#273351' }}
            >
              Go to Members Portal
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">Something Went Wrong</h1>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t process your unsubscribe request. {errorMessage && `Error: ${errorMessage}`}
          </p>
          <a
            href="https://members.moyoungdemocrats.org/dashboard"
            className="inline-block px-6 py-3 rounded-md text-white font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#273351' }}
          >
            Go to Members Portal
          </a>
        </div>
      </div>
    </div>
  )
}
