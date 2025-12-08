import Link from 'next/link'

export default function SubmitSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
          Thank you for posting an opportunity with Missouri Young Democrats. You&apos;ve been added to our mailing list and will receive updates on your submission status.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 font-medium"
          >
            View All Jobs
          </Link>

          <Link
            href="/submit"
            className="block w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-200 font-medium"
          >
            Post Another Opportunity
          </Link>
        </div>
      </div>
    </div>
  )
}
