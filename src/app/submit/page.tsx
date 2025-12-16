'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CustomQuestionsBuilder, { CustomQuestion } from '@/components/CustomQuestionsBuilder'

export default function SubmitJobPage() {
  const [lookupData, setLookupData] = useState<any>(null)
  const [lookingUp, setLookingUp] = useState(false)
  const [phoneLookupDone, setPhoneLookupDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignedInPoster, setIsSignedInPoster] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([])
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    // Job details
    title: '',
    organization: '',
    description: '',
    job_type: 'full-time',
    location: '',
    location_type: 'in-person',
    is_paid: false,
    is_volunteer: false,
    salary_range: '',
    hourly_rate: '',
    requirements: '',
    qualifications: '',
    contact_email: '',
    contact_name: '',
    contact_phone: '',
    application_url: '',
    application_instructions: '',
    expires_at: '',
    submitter_organization: '',
    resume_enabled: true,
    resume_required: false,
    cover_letter_enabled: true,
    cover_letter_required: false,

    // Submitter personal info
    submitter_name: '',
    submitter_email: '',
    submitter_phone: '',
    submitter_address: '',
    submitter_city: '',
    submitter_state: '',
    submitter_zip_code: '',
    submitter_date_of_birth: '',
    submitter_employer: '',
  })

  // Check if user is signed in as a poster and pre-fill their info
  useEffect(() => {
    async function checkPosterSession() {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user?.email) {
        // Check if they have jobs (they're a poster)
        const { data: jobs } = await supabase
          .from('jobs')
          .select('submitter_name, submitter_email, submitter_phone, contact_email, contact_name, contact_phone, organization')
          .eq('submitter_email', session.user.email.toLowerCase())
          .order('created_at', { ascending: false })
          .limit(1)

        if (jobs && jobs.length > 0) {
          const posterInfo = jobs[0]
          setIsSignedInPoster(true)
          setPhoneLookupDone(true) // Skip phone lookup
          setFormData(prev => ({
            ...prev,
            submitter_name: posterInfo.submitter_name || prev.submitter_name,
            submitter_email: posterInfo.submitter_email || session.user.email || prev.submitter_email,
            submitter_phone: posterInfo.submitter_phone || prev.submitter_phone,
            contact_email: posterInfo.contact_email || posterInfo.submitter_email || prev.contact_email,
            contact_name: posterInfo.contact_name || posterInfo.submitter_name || prev.contact_name,
            contact_phone: posterInfo.contact_phone || posterInfo.submitter_phone || prev.contact_phone,
            organization: posterInfo.organization || prev.organization,
          }))
        }
      }
      setCheckingSession(false)
    }
    checkPosterSession()
  }, [supabase])

  // Handle phone lookup when user enters phone number
  async function handlePhoneLookup(phone: string) {
    if (!phone || phone.length < 10) return

    setLookingUp(true)
    setError(null)

    try {
      const { data, error } = await supabase.functions.invoke('submit-job', {
        body: {
          action: 'lookup',
          phone: phone
        }
      })

      if (error) throw error

      // Auto-fill form with found data
      if (data.found) {
        setLookupData(data)
        setFormData(prev => ({
          ...prev,
          submitter_name: data.name || prev.submitter_name,
          submitter_email: data.email || prev.submitter_email,
          submitter_phone: phone,
          submitter_address: data.address || prev.submitter_address,
          submitter_city: data.city || prev.submitter_city,
          submitter_state: data.state || prev.submitter_state,
          submitter_zip_code: data.zip_code || prev.submitter_zip_code,
          submitter_date_of_birth: data.date_of_birth || prev.submitter_date_of_birth,
          submitter_employer: data.employer || prev.submitter_employer,
        }))
      }
    } catch (err: any) {
      console.error('Lookup error:', err)
      // Don't show error for lookup failures - just silently fail
    } finally {
      setLookingUp(false)
      setPhoneLookupDone(true)
    }
  }

  // Handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const { data, error } = await supabase.functions.invoke('submit-job', {
        body: {
          action: 'submit',
          job: {
            title: formData.title,
            organization: formData.organization,
            description: formData.description,
            job_type: formData.job_type,
            location: formData.location,
            location_type: formData.location_type,
            is_paid: formData.is_paid,
            is_volunteer: formData.is_volunteer,
            salary_range: formData.salary_range,
            hourly_rate: formData.hourly_rate,
            requirements: formData.requirements,
            qualifications: formData.qualifications,
            contact_email: formData.contact_email,
            contact_name: formData.contact_name,
            contact_phone: formData.contact_phone,
            application_url: formData.application_url,
            application_instructions: formData.application_instructions,
            expires_at: formData.expires_at || null,
            submitter_organization: formData.submitter_organization,
            resume_enabled: formData.resume_enabled,
            resume_required: formData.resume_required,
            cover_letter_enabled: formData.cover_letter_enabled,
            cover_letter_required: formData.cover_letter_required,
            custom_questions: customQuestions.length > 0 ? customQuestions : null,
          },
          submitter: {
            name: formData.submitter_name,
            email: formData.submitter_email,
            phone: formData.submitter_phone,
            address: formData.submitter_address,
            city: formData.submitter_city,
            state: formData.submitter_state,
            zip_code: formData.submitter_zip_code,
            date_of_birth: formData.submitter_date_of_birth,
            employer: formData.submitter_employer,
            member_id: lookupData?.member_id,
            donor_id: lookupData?.donor_id,
            subscriber_id: lookupData?.subscriber_id,
          }
        }
      })

      if (error) throw error

      // Redirect to success page
      router.push('/submit/success')
    } catch (err: any) {
      console.error('Submit error:', err)
      setError(err.message || 'Failed to submit job posting')
      setSubmitting(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))

    // Trigger phone lookup when phone number is entered (only if not a signed-in poster)
    if (!isSignedInPoster && name === 'submitter_phone' && typeof newValue === 'string' && newValue.length >= 10) {
      handlePhoneLookup(newValue)
    }
  }

  // Show loading while checking session
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Back to Jobs"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="font-bold text-white" style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 'clamp(1.25rem, 5vw, 1.875rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap'
          }}>
            Post an Opportunity
          </h1>
          <p className="mt-2 text-white/80">
            Share opportunities with Missouri Young Democrats members
          </p>
        </div>

        {/* Signed-in poster banner */}
        {isSignedInPoster && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-800 text-sm">
                <strong>Welcome back!</strong> Your contact information has been pre-filled from your previous submission.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
          {/* Position Details */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-gray-900 mb-4" style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(0.9rem, 4vw, 1.125rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap'
            }}>Position Details</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Position Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Campaign Manager, Volunteer Coordinator"
                />
              </div>

              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                  Organization <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  required
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Organization or campaign name"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Position Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the position, responsibilities, and what makes it exciting..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="job_type" className="block text-sm font-medium text-gray-700 mb-1">
                    Position Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="job_type"
                    name="job_type"
                    required
                    value={formData.job_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="full-time">Full-Time</option>
                    <option value="part-time">Part-Time</option>
                    <option value="internship">Internship</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="location_type" className="block text-sm font-medium text-gray-700 mb-1">
                    Location Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="location_type"
                    name="location_type"
                    required
                    value={formData.location_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="in-person">In-Person</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="City, State (or 'Remote')"
                />
              </div>
            </div>
          </div>

          {/* Compensation */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-gray-900 mb-4" style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(0.9rem, 4vw, 1.125rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap'
            }}>Position Type</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_paid"
                    name="is_paid"
                    checked={formData.is_paid}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_paid" className="ml-2 block text-sm text-gray-700">
                    This is a paid position
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_volunteer"
                    name="is_volunteer"
                    checked={formData.is_volunteer}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_volunteer" className="ml-2 block text-sm text-gray-700">
                    This is a volunteer position
                  </label>
                </div>
              </div>

              {formData.is_paid && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="salary_range" className="block text-sm font-medium text-gray-700 mb-1">
                      Salary Range
                    </label>
                    <input
                      type="text"
                      id="salary_range"
                      name="salary_range"
                      value={formData.salary_range}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., $40,000 - $50,000"
                    />
                  </div>

                  <div>
                    <label htmlFor="hourly_rate" className="block text-sm font-medium text-gray-700 mb-1">
                      Hourly Rate
                    </label>
                    <input
                      type="text"
                      id="hourly_rate"
                      name="hourly_rate"
                      value={formData.hourly_rate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., $15-20/hour"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Requirements */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-gray-900 mb-4" style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(0.9rem, 4vw, 1.125rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap'
            }}>Criteria</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="List required qualifications, skills, or experience..."
                />
              </div>

              <div>
                <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Qualifications
                </label>
                <textarea
                  id="qualifications"
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="List preferred but not required qualifications..."
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-gray-900 mb-4" style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(0.9rem, 4vw, 1.125rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap'
            }}>Application &amp; Contact</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="contact_email"
                  name="contact_email"
                  required
                  value={formData.contact_email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="This email will be notified when members apply"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    id="contact_name"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    id="contact_phone"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="application_url" className="block text-sm font-medium text-gray-700 mb-1">
                  Application URL
                </label>
                <input
                  type="url"
                  id="application_url"
                  name="application_url"
                  value={formData.application_url}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Link to application form or job posting"
                />
              </div>

              <div>
                <label htmlFor="application_instructions" className="block text-sm font-medium text-gray-700 mb-1">
                  Application Instructions
                </label>
                <textarea
                  id="application_instructions"
                  name="application_instructions"
                  value={formData.application_instructions}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="How should candidates apply? What materials should they include?"
                />
              </div>

              <div>
                <label htmlFor="expires_at" className="block text-sm font-medium text-gray-700 mb-1">
                  Application Deadline
                </label>
                <input
                  type="date"
                  id="expires_at"
                  name="expires_at"
                  value={formData.expires_at}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Optional. Job will be automatically removed after this date.
                </p>
              </div>
            </div>
          </div>

          {/* Application Requirements */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-gray-900 mb-2" style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(0.9rem, 4vw, 1.125rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap'
            }}>Application Requirements</h2>
            <p className="text-sm text-gray-500 mb-4">
              Choose what information applicants need to provide when applying.
            </p>

            <div className="space-y-4">
              {/* Resume Options */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="resume_enabled"
                      name="resume_enabled"
                      checked={formData.resume_enabled}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="resume_enabled" className="ml-2 block text-sm font-medium text-gray-700">
                      Allow resume upload
                    </label>
                  </div>
                  {formData.resume_enabled && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="resume_required"
                        name="resume_required"
                        checked={formData.resume_required}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="resume_required" className="ml-2 block text-sm text-gray-600">
                        Required
                      </label>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500 ml-6">
                  Applicants can upload their resume as a PDF or Word document.
                </p>
              </div>

              {/* Cover Letter Options */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="cover_letter_enabled"
                      name="cover_letter_enabled"
                      checked={formData.cover_letter_enabled}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="cover_letter_enabled" className="ml-2 block text-sm font-medium text-gray-700">
                      Allow cover letter
                    </label>
                  </div>
                  {formData.cover_letter_enabled && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="cover_letter_required"
                        name="cover_letter_required"
                        checked={formData.cover_letter_required}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="cover_letter_required" className="ml-2 block text-sm text-gray-600">
                        Required
                      </label>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500 ml-6">
                  Applicants can provide a cover letter as text or upload a document.
                </p>
              </div>
            </div>
          </div>

          {/* Custom Questions */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-gray-900 mb-2" style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(0.9rem, 4vw, 1.125rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap'
            }}>Custom Application Questions</h2>
            <p className="text-sm text-gray-500 mb-4">
              Optional. Add additional questions for applicants to answer when they apply.
            </p>
            <CustomQuestionsBuilder
              questions={customQuestions}
              onChange={setCustomQuestions}
            />
          </div>

          {/* Your Information - Show simplified version for signed-in posters */}
          {isSignedInPoster ? (
            <div className="pb-6">
              <h2 className="text-gray-900 mb-4" style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 'clamp(0.9rem, 4vw, 1.125rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
              }}>Your Information</h2>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Name:</strong> {formData.submitter_name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {formData.submitter_email}
                </p>
                {formData.submitter_phone && (
                  <p className="text-sm text-gray-600">
                    <strong>Phone:</strong> {formData.submitter_phone}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="pb-6">
              <h2 className="text-gray-900 mb-4" style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 'clamp(0.9rem, 4vw, 1.125rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
              }}>Your Information</h2>

              <div className="space-y-4">
                {/* Phone Number - Always visible */}
                <div>
                  <label htmlFor="submitter_phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="submitter_phone"
                      name="submitter_phone"
                      required
                      inputMode="numeric"
                      value={formData.submitter_phone}
                      onChange={(e) => {
                        const numbersOnly = e.target.value.replace(/\D/g, '')
                        setFormData(prev => ({ ...prev, submitter_phone: numbersOnly }))
                        if (!isSignedInPoster && numbersOnly.length >= 10) {
                          handlePhoneLookup(numbersOnly)
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="5551234567"
                    />
                    {lookingUp && (
                      <div className="absolute right-3 top-2">
                        <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                  {lookupData?.found && (
                    <p className="mt-1 text-sm text-green-600">
                      Found your information!
                    </p>
                  )}
                </div>

                {/* Rest of fields - Only visible after phone lookup */}
                {phoneLookupDone && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="submitter_name" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="submitter_name"
                          name="submitter_name"
                          required
                          value={formData.submitter_name}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="submitter_email" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="submitter_email"
                          name="submitter_email"
                          required
                          value={formData.submitter_email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="submitter_date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          id="submitter_date_of_birth"
                          name="submitter_date_of_birth"
                          required
                          value={formData.submitter_date_of_birth}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="submitter_zip_code" className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="submitter_zip_code"
                          name="submitter_zip_code"
                          required
                          value={formData.submitter_zip_code}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          maxLength={5}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="submitter_address" className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        id="submitter_address"
                        name="submitter_address"
                        value={formData.submitter_address}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="submitter_city" className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          id="submitter_city"
                          name="submitter_city"
                          value={formData.submitter_city}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="submitter_state" className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <select
                          id="submitter_state"
                          name="submitter_state"
                          value={formData.submitter_state}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select...</option>
                          <option value="MO">Missouri</option>
                          <option value="KS">Kansas</option>
                          <option value="IL">Illinois</option>
                          <option value="IA">Iowa</option>
                          <option value="AR">Arkansas</option>
                          <option value="OK">Oklahoma</option>
                          <option value="NE">Nebraska</option>
                          <option value="TN">Tennessee</option>
                          <option value="KY">Kentucky</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="submitter_employer" className="block text-sm font-medium text-gray-700 mb-1">
                        Employer
                      </label>
                      <input
                        type="text"
                        id="submitter_employer"
                        name="submitter_employer"
                        value={formData.submitter_employer}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="submitter_organization" className="block text-sm font-medium text-gray-700 mb-1">
                        Organization
                      </label>
                      <input
                        type="text"
                        id="submitter_organization"
                        name="submitter_organization"
                        value={formData.submitter_organization}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your organization (if different from the job posting organization)"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed active:opacity-80"
              style={{ backgroundColor: '#273351', minHeight: '48px', touchAction: 'manipulation' }}
            >
              {submitting ? 'Submitting...' : 'Submit for Review'}
            </button>
            <p className="mt-3 text-sm text-gray-500 text-center">
              All job postings are reviewed before publication. You&apos;ll receive an email once approved.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
