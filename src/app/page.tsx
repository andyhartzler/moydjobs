import { createServerSupabaseClient } from '@/lib/supabase-server'
import JobCard from '@/components/JobCard'
import MembersOnlyBanner from '@/components/MembersOnlyBanner'
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="section-padding">
        <div className="container-custom">
          <h1 className="text-white mb-4" style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.4rem)',
            fontWeight: 800,
            letterSpacing: '-0.06em',
            textTransform: 'uppercase',
            lineHeight: '1.2'
          }}>
            Job &amp; Volunteer Opportunities
          </h1>
          <p className="text-white/90 mb-8" style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
            fontWeight: 500,
            maxWidth: '800px'
          }}>
            Connect with opportunities to make a difference in Missouri
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            <Link
              href="/submit"
              className="btn-primary text-center"
              style={{
                fontSize: '1.32rem',
                padding: '1.18rem 2.65rem'
              }}
            >
              Post an Opportunity
            </Link>
            <Link
              href="/poster"
              className="btn-secondary text-center"
              style={{
                fontSize: '1.32rem',
                padding: '1.18rem 2.36rem'
              }}
            >
              Manage Your Listings
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-0 pb-16 md:pb-24">
        <div className="container-custom">
          {/* Job Listings */}
          {isMember ? (
            jobs && jobs.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="card-elevated p-12 text-center">
                <svg className="mx-auto h-16 w-16 mb-4" style={{ color: '#5B9FBD' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-900 mb-2 uppercase" style={{ letterSpacing: '-0.04em' }}>No opportunities available</h3>
                <p className="text-gray-600">Check back later for new postings</p>
              </div>
            )
          ) : (
            <MembersOnlyBanner />
          )}
        </div>
      </div>
    </div>
  )
}
