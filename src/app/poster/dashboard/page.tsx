import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
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

  const userEmail = session.user.email?.toLowerCase() || ''

  // Implement transitive email association:
  // 1. Find jobs where user's email matches submitter_email OR contact_email
  // 2. Collect ALL unique emails from those jobs
  // 3. Find ALL jobs where ANY of those emails appear

  const { data: allJobs, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching jobs:', error)
  }

  // Step 1: Find jobs directly associated with user's email
  const directJobs = (allJobs || []).filter(job =>
    job.submitter_email?.toLowerCase() === userEmail ||
    job.contact_email?.toLowerCase() === userEmail
  )

  // Step 2: Collect ALL emails from direct jobs
  const associatedEmails = new Set<string>()
  directJobs.forEach(job => {
    if (job.submitter_email) {
      associatedEmails.add(job.submitter_email.toLowerCase())
    }
    if (job.contact_email) {
      associatedEmails.add(job.contact_email.toLowerCase())
    }
  })

  // Step 3: Filter all jobs that have ANY of the associated emails
  const jobs = (allJobs || []).filter(job =>
    (job.submitter_email && associatedEmails.has(job.submitter_email.toLowerCase())) ||
    (job.contact_email && associatedEmails.has(job.contact_email.toLowerCase()))
  )

  // Get application counts for each job using admin client to bypass RLS
  let jobsWithCounts = jobs || []
  if (jobs && jobs.length > 0) {
    const adminClient = createAdminClient()
    const jobIds = jobs.map(j => j.id)
    const { data: appCounts } = await adminClient
      .from('job_applications')
      .select('job_id')
      .in('job_id', jobIds)

    // Count applications per job
    const countMap: Record<string, number> = {}
    appCounts?.forEach(app => {
      countMap[app.job_id] = (countMap[app.job_id] || 0) + 1
    })

    jobsWithCounts = jobs.map(job => ({
      ...job,
      application_count: countMap[job.id] || 0
    }))
  }

  // If no jobs found for this email, show message
  if (!jobsWithCounts || jobsWithCounts.length === 0) {
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

  const approvedJobs = jobsWithCounts.filter(j => j.status === 'approved')
  const pendingJobs = jobsWithCounts.filter(j => j.status === 'pending')
  const otherJobs = jobsWithCounts.filter(j => !['approved', 'pending'].includes(j.status))

  const totalApplications = jobsWithCounts.reduce((sum, j) => sum + (j.application_count || 0), 0)

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header - responsive layout */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
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
              className="inline-block px-4 py-2 rounded-md text-white font-medium text-center"
              style={{ backgroundColor: '#273351' }}
            >
              + Post New Job
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Total Postings</p>
            <p className="text-2xl font-bold text-gray-900">{jobsWithCounts.length}</p>
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
            <p className="text-2xl font-bold text-blue-600">{totalApplications}</p>
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
