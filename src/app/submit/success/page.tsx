import Link from 'next/link'

export default function SubmitSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Submission Received!
        </h2>

        <p className="text-gray-600 mb-6">
          Thank you for posting an opportunity with Missouri Young Democrats.
          <br /><br />
          You&apos;ll be notified via email once your submission is live or we will contact you if more information is needed.
          <br /><br />
          In the meantime feel free to reach out to us with any questions at info@moyoungdemocrats.org
        </p>

        <div className="space-y-3">
          <Link
            href="/submit"
            className="block w-full px-4 py-3 rounded-md font-medium text-white"
            style={{ backgroundColor: '#273351' }}
          >
            Post Another Opportunity
          </Link>
        </div>
      </div>
    </div>
  )
}
