'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PosterSignInPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // First check if this email has any jobs
    const { data: jobs, error: jobError } = await supabase
      .from('jobs')
      .select('id')
      .eq('submitter_email', email.toLowerCase())
      .limit(1)

    if (jobError) {
      setError('An error occurred. Please try again.')
      setLoading(false)
      return
    }

    if (!jobs || jobs.length === 0) {
      setError('No job postings found for this email address. Please use the email you submitted your job posting with.')
      setLoading(false)
      return
    }

    // Send OTP
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase(),
      options: {
        emailRedirectTo: 'https://jobs.moyoungdemocrats.org/poster/dashboard',
        shouldCreateUser: true,
      }
    })

    if (otpError) {
      setError(otpError.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setVerifying(true)
    setError(null)

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email.toLowerCase(),
      token: otp,
      type: 'email',
    })

    if (verifyError) {
      setError(verifyError.message)
      setVerifying(false)
      return
    }

    // Redirect to dashboard on success
    router.push('/poster/dashboard')
  }

  if (sent) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
              <p className="text-gray-600">
                We sent a sign-in code to <strong>{email}</strong>
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter 6-digit code
                </label>
                <input
                  type="text"
                  id="otp"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                  autoComplete="one-time-code"
                />
              </div>

              <button
                type="submit"
                disabled={verifying || otp.length !== 6}
                className="w-full py-3 px-4 rounded-md text-white font-medium disabled:opacity-50"
                style={{ backgroundColor: '#273351' }}
              >
                {verifying ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500 mb-3">
                Or click the link in your email to sign in automatically.
              </p>
              <p className="text-sm text-gray-500">
                Didn&apos;t receive it? Check your spam folder or{' '}
                <button
                  onClick={() => {
                    setSent(false)
                    setOtp('')
                    setError(null)
                  }}
                  className="text-blue-600 hover:underline"
                >
                  try again
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Jobs
          </Link>
          <h1 className="text-2xl font-bold text-white uppercase" style={{ letterSpacing: '-0.04em' }}>
            Manage Your Job Posting
          </h1>
          <p className="mt-2 text-white/80">
            Sign in to view applicants and manage your listings
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter the email you used to submit your job"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Use the same email address you used when submitting your job posting.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-md text-white font-medium disabled:opacity-50"
              style={{ backgroundColor: '#273351' }}
            >
              {loading ? 'Sending...' : 'Send Sign-In Code'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Haven&apos;t posted a job yet?{' '}
              <Link href="/submit" className="text-blue-600 hover:underline font-medium">
                Submit one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
