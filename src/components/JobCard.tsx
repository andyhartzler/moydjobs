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
      <div className="card-elevated p-6 cursor-pointer h-full flex flex-col">
        {job.featured && (
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wide text-white rounded-full mb-3 self-start" style={{ backgroundColor: '#d97706', letterSpacing: '0.05em' }}>
            ⭐ Featured
          </span>
        )}

        <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase" style={{ fontFamily: 'Montserrat', letterSpacing: '-0.04em' }}>
          {job.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 font-medium">{job.organization}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full uppercase ${typeColors[job.job_type] || typeColors['contract']}`} style={{ letterSpacing: '0.05em' }}>
            {job.job_type.replace('-', ' ')}
          </span>

          {job.location_type && (
            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full uppercase" style={{ backgroundColor: '#e5e7eb', color: '#374151', letterSpacing: '0.05em' }}>
              {job.location_type}
            </span>
          )}

          {job.is_paid && (
            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full uppercase" style={{ backgroundColor: '#d1fae5', color: '#065f46', letterSpacing: '0.05em' }}>
              💰 Paid
            </span>
          )}
        </div>

        {job.location && (
          <p className="text-sm mb-4 font-medium" style={{ color: '#5B9FBD' }}>
            📍 {job.location}
          </p>
        )}

        <p className="text-gray-700 text-sm line-clamp-3 flex-grow">
          {job.description}
        </p>

        {job.expires_at && (
          <p className="text-xs text-gray-500 mt-4 font-medium">
            Expires: {new Date(job.expires_at).toLocaleDateString()}
          </p>
        )}
      </div>
    </Link>
  )
}
