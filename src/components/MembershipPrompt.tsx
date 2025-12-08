interface MembershipPromptProps {
  className?: string
}

export default function MembershipPrompt({ className = '' }: MembershipPromptProps) {
  return (
    <div className={`bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-lg font-medium text-blue-900">
            🔒 Full Access for Members Only
          </h3>
          <p className="mt-2 text-blue-700">
            Join Missouri Young Democrats to view and apply for exclusive job and volunteer opportunities. Membership is free!
          </p>
          <div className="mt-4">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSd5Hd_cgdFmgE7f9gdIxmwXSAdxkuFuITENO_x5VkhDrtR8Ag/viewform?pli=1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Join Now - It&apos;s Free →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
