import Link from 'next/link'

interface PosterJobCardProps {
  job: {
    id: string
    title: string
    organization: string
    status: string
    created_at: string
    application_count?: number
    view_count?: number
  }
}

export default function PosterJobCard({ job }: PosterJobCardProps) {
  const statusColors: Record<string, string> = {
    'approved': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'rejected': 'bg-red-100 text-red-800',
    'expired': 'bg-gray-100 text-gray-800',
    'archived': 'bg-gray-100 text-gray-800',
  }

  const statusLabels: Record<string, string> = {
    'approved': 'Active',
    'pending': 'Pending Review',
    'rejected': 'Rejected',
    'expired': 'Expired',
    'archived': 'Archived',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-3">
        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${statusColors[job.status] || 'bg-gray-100 text-gray-800'}`}>
          {statusLabels[job.status] || job.status}
        </span>
        <span className="text-sm text-gray-500">
          {new Date(job.created_at).toLocaleDateString()}
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h3>
      <p className="text-gray-600 text-sm mb-4">{job.organization}</p>

      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center text-gray-600">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {job.application_count || 0} applicants
        </div>
        <div className="flex items-center text-gray-600">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {job.view_count || 0} views
        </div>
      </div>

      <div className="flex gap-2">
        <Link
          href={`/poster/jobs/${job.id}`}
          className="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Edit
        </Link>
        {job.status === 'approved' && (
          <Link
            href={`/poster/jobs/${job.id}/applicants`}
            className="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium text-white"
            style={{ backgroundColor: '#273351' }}
          >
            View Applicants ({job.application_count || 0})
          </Link>
        )}
      </div>
    </div>
  )
}
