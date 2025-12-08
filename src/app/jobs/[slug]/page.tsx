import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface JobDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params
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

  // Get job details
  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'approved')
    .single()

  if (error || !job) {
    notFound()
  }

  // Check if job is expired
  if (job.expires_at && new Date(job.expires_at) < new Date()) {
    notFound()
  }

  const typeColors: Record<string, string> = {
    'full-time': 'bg-green-100 text-green-800',
    'part-time': 'bg-blue-100 text-blue-800',
    'internship': 'bg-purple-100 text-purple-800',
    'volunteer': 'bg-yellow-100 text-yellow-800',
    'contract': 'bg-gray-100 text-gray-800'
  }

  // If not a member, redirect to membership prompt
  if (!isMember) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Member Access Required
            </h1>

            <p className="text-gray-600 mb-6">
              Join Missouri Young Democrats to view full job details and apply for opportunities.
            </p>

            <div className="space-y-3">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSd5Hd_cgdFmgE7f9gdIxmwXSAdxkuFuITENO_x5VkhDrtR8Ag/viewform?pli=1"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 font-medium"
              >
                Become a Member
              </a>

              <a
                href="https://members.moyoungdemocrats.org/login"
                className="block w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-200 font-medium"
              >
                Already a Member? Log In
              </a>

              <Link
                href="/"
                className="block text-blue-600 hover:text-blue-700 font-medium mt-4"
              >
                ← Back to All Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show full job details for members
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to All Jobs
        </Link>

        {/* Job Details Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
            {job.featured && (
              <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-900 bg-yellow-400 rounded-full mb-3">
                ⭐ Featured Opportunity
              </span>
            )}

            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {job.title}
            </h1>

            <p className="text-xl text-blue-100 mb-4">
              {job.organization}
            </p>

            <div className="flex flex-wrap gap-2">
              <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${typeColors[job.job_type] || typeColors['contract']}`}>
                {job.job_type.replace('-', ' ').toUpperCase()}
              </span>

              {job.location_type && (
                <span className="inline-block px-3 py-1 text-sm font-semibold bg-white text-gray-800 rounded-full">
                  {job.location_type}
                </span>
              )}

              {job.is_paid && (
                <span className="inline-block px-3 py-1 text-sm font-semibold bg-green-400 text-green-900 rounded-full">
                  💰 Paid Position
                </span>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            {/* Location */}
            {job.location && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Location</h2>
                <p className="text-gray-700">📍 {job.location}</p>
              </div>
            )}

            {/* Compensation */}
            {job.is_paid && (job.salary_range || job.hourly_rate) && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Compensation</h2>
                {job.salary_range && <p className="text-gray-700">Salary: {job.salary_range}</p>}
                {job.hourly_rate && <p className="text-gray-700">Hourly Rate: {job.hourly_rate}</p>}
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">About This Opportunity</h2>
              <div className="text-gray-700 whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Requirements</h2>
                <div className="text-gray-700 whitespace-pre-line">
                  {job.requirements}
                </div>
              </div>
            )}

            {/* Qualifications */}
            {job.qualifications && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Preferred Qualifications</h2>
                <div className="text-gray-700 whitespace-pre-line">
                  {job.qualifications}
                </div>
              </div>
            )}

            {/* Application Instructions */}
            {job.application_instructions && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">How to Apply</h2>
                <div className="text-gray-700 whitespace-pre-line">
                  {job.application_instructions}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h2>
              <div className="space-y-2">
                {job.contact_name && (
                  <p className="text-gray-700">
                    <strong>Contact:</strong> {job.contact_name}
                  </p>
                )}
                {job.contact_email && (
                  <p className="text-gray-700">
                    <strong>Email:</strong>{' '}
                    <a href={`mailto:${job.contact_email}`} className="text-blue-600 hover:text-blue-700">
                      {job.contact_email}
                    </a>
                  </p>
                )}
                {job.contact_phone && (
                  <p className="text-gray-700">
                    <strong>Phone:</strong> {job.contact_phone}
                  </p>
                )}
              </div>
            </div>

            {/* Application Button */}
            <div className="mt-8 flex flex-wrap gap-4">
              {job.application_url ? (
                <a
                  href={job.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Apply Now
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : job.contact_email && (
                <a
                  href={`mailto:${job.contact_email}`}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Apply via Email
                </a>
              )}

              {job.expires_at && (
                <p className="flex items-center text-sm text-gray-500">
                  <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Application Deadline: {new Date(job.expires_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
