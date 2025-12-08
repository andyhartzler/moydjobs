import Link from 'next/link'

interface JobCardProps {
  job: any
}

export default function JobCard({ job }: JobCardProps) {
  const typeColors: Record<string, string> = {
    'full-time': 'bg-green-100 text-green-800',
    'part-time': 'bg-blue-100 text-blue-800',
    'internship': 'bg-purple-100 text-purple-800',
    'volunteer': 'bg-yellow-100 text-yellow-800',
    'contract': 'bg-gray-100 text-gray-800'
  }

  return (
    <Link href={`/jobs/${job.slug}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer h-full flex flex-col">
        {job.featured && (
          <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-yellow-500 rounded-full mb-2 self-start">
            ⭐ Featured
          </span>
        )}

        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {job.title}
        </h3>

        <p className="text-gray-600 text-sm mb-3">{job.organization}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${typeColors[job.job_type] || typeColors['contract']}`}>
            {job.job_type.replace('-', ' ').toUpperCase()}
          </span>

          {job.location_type && (
            <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
              {job.location_type}
            </span>
          )}

          {job.is_paid && (
            <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
              💰 Paid
            </span>
          )}
        </div>

        {job.location && (
          <p className="text-sm text-gray-500 mb-3">
            📍 {job.location}
          </p>
        )}

        <p className="text-gray-700 text-sm line-clamp-3 flex-grow">
          {job.description}
        </p>

        {job.expires_at && (
          <p className="text-xs text-gray-500 mt-4">
            Expires: {new Date(job.expires_at).toLocaleDateString()}
          </p>
        )}
      </div>
    </Link>
  )
}
