import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import PosterJobForm from '@/components/PosterJobForm'

interface EditJobPageProps {
  params: Promise<{ id: string }>
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  // Check authentication
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/poster')
  }

  const userEmail = session.user.email?.toLowerCase()

  // Get job and verify ownership
  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .eq('submitter_email', userEmail)
    .single()

  if (error || !job) {
    notFound()
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/poster/dashboard" className="inline-flex items-center text-white/80 hover:text-white mb-6">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white uppercase" style={{ letterSpacing: '-0.04em' }}>
            Edit Job Posting
          </h1>
          {job.status === 'pending' && (
            <p className="mt-2 text-yellow-300">
              This posting is pending review. Changes will be reviewed before going live.
            </p>
          )}
          {job.status === 'approved' && (
            <p className="mt-2 text-green-300">
              This posting is live. Changes will take effect immediately.
            </p>
          )}
        </div>

        <PosterJobForm job={job} />
      </div>
    </div>
  )
}
