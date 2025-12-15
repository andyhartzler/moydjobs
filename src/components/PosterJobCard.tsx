import Link from 'next/link'

interface PosterJobCardProps {
  job: {
    id: string
    title: string
    organization: string
    status: string
    created_at: string
    application_count?: number
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
