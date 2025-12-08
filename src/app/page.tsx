import { createServerSupabaseClient } from '@/lib/supabase-server'
import JobCard from '@/components/JobCard'
import BlurredJobPreview from '@/components/BlurredJobPreview'
import MembershipPrompt from '@/components/MembershipPrompt'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()

  // Check if user is authenticated member
  const { data: { session } } = await supabase.auth.getSession()

  let isMember = false
  if (session) {
    const { data: member } = await supabase
      .from('members')
      .select('id')
      .eq('user_id', session.user.id)
      .single()

    isMember = !!member
  }

  // Get approved jobs
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'approved')
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Match moyd-events style */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Job &amp; Volunteer Opportunities
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Connect with opportunities to make a difference in Missouri
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/submit"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors"
            >
              Post an Opportunity
            </Link>

            {!isMember && (
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSd5Hd_cgdFmgE7f9gdIxmwXSAdxkuFuITENO_x5VkhDrtR8Ag/viewform?pli=1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-700 transition-colors"
              >
                Become a Member
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">{jobs?.length || 0}</div>
              <div className="text-gray-600">Active Opportunities</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {jobs?.filter(j => j.is_paid).length || 0}
              </div>
              <div className="text-gray-600">Paid Positions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {jobs?.filter(j => j.job_type === 'volunteer').length || 0}
              </div>
              <div className="text-gray-600">Volunteer Roles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {jobs?.filter(j => j.location_type === 'remote').length || 0}
              </div>
              <div className="text-gray-600">Remote Options</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Show membership prompt for non-members */}
        {!isMember && <MembershipPrompt className="mb-8" />}

        {/* Job Listings */}
        {jobs && jobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              isMember ? (
                <JobCard key={job.id} job={job} />
              ) : (
                <BlurredJobPreview key={job.id} job={job} />
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No opportunities available</h3>
            <p className="mt-1 text-gray-500">Check back later for new postings</p>
          </div>
        )}
      </div>

      {/* Footer - Match moyd-events */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Missouri Young Democrats. All rights reserved.
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <a href="https://moyoungdemocrats.org" className="text-gray-400 hover:text-white">
                Main Website
              </a>
              <a href="https://members.moyoungdemocrats.org" className="text-gray-400 hover:text-white">
                Member Portal
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
