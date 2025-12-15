import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import ApplicantCard from '@/components/ApplicantCard'

interface ApplicantsPageProps {
  params: Promise<{ id: string }>
}

export default async function ApplicantsPage({ params }: ApplicantsPageProps) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  // Check authentication
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/poster')
  }

  const userEmail = session.user.email?.toLowerCase()

  // Get job and verify ownership
  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .eq('submitter_email', userEmail)
    .single()

  if (jobError || !job) {
    notFound()
  }

  // Get applicants - simplified query without member join
  const { data: applicants, error: appError } = await supabase
    .from('job_applications')
    .select('*')
    .eq('job_id', id)
    .order('created_at', { ascending: false })

  if (appError) {
    console.error('Error fetching applicants:', appError)
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back link */}
        <Link href="/poster/dashboard" className="inline-flex items-center text-white/80 hover:text-white mb-6">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
          <p className="text-gray-600">{job.organization}</p>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <span>{applicants?.length || 0} applicants</span>
            <span>-</span>
            <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Applicants */}
        {applicants && applicants.length > 0 ? (
          <div className="space-y-4">
            {applicants.map(applicant => (
              <ApplicantCard
                key={applicant.id}
                applicant={applicant}
                customQuestions={job.custom_questions || []}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applicants yet</h3>
            <p className="text-gray-500">Applicants will appear here when they apply to your posting.</p>
          </div>
        )}
      </div>
    </div>
  )
}
