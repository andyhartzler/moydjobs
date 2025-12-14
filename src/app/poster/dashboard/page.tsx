import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PosterJobCard from '@/components/PosterJobCard'

export default async function PosterDashboardPage() {
  const supabase = await createServerSupabaseClient()

  // Check authentication
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/poster')
  }

  const userEmail = session.user.email?.toLowerCase()

  // Get all jobs for this poster
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('submitter_email', userEmail)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching jobs:', error)
  }

  // If no jobs found for this email, show message
  if (!jobs || jobs.length === 0) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">No Job Postings Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t find any job postings associated with {userEmail}.
            </p>
            <Link
              href="/submit"
              className="inline-block px-6 py-3 rounded-md text-white font-medium"
              style={{ backgroundColor: '#273351' }}
            >
              Post a Job
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const approvedJobs = jobs.filter(j => j.status === 'approved')
  const pendingJobs = jobs.filter(j => j.status === 'pending')
  const otherJobs = jobs.filter(j => !['approved', 'pending'].includes(j.status))

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white uppercase" style={{ letterSpacing: '-0.04em' }}>
              Your Job Postings
            </h1>
            <p className="mt-2 text-white/80">
              Manage your listings and view applicants
            </p>
          </div>
          <Link
            href="/submit"
            className="px-4 py-2 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700"
          >
            + Post New Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Total Postings</p>
            <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-green-600">{approvedJobs.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Pending Review</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingJobs.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Total Applications</p>
            <p className="text-2xl font-bold text-blue-600">
              {jobs.reduce((sum, j) => sum + (j.application_count || 0), 0)}
            </p>
          </div>
        </div>

        {/* Active Jobs */}
        {approvedJobs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4 uppercase">Active Listings</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {approvedJobs.map(job => (
                <PosterJobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}

        {/* Pending Jobs */}
        {pendingJobs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4 uppercase">Pending Review</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {pendingJobs.map(job => (
                <PosterJobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}

        {/* Other Jobs */}
        {otherJobs.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-4 uppercase">Past Listings</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {otherJobs.map(job => (
                <PosterJobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
