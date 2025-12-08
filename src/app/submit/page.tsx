'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SubmitJobPage() {
  const [step, setStep] = useState<'phone' | 'form'>('phone')
  const [lookupData, setLookupData] = useState<any>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [lookingUp, setLookingUp] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

  // Handle phone lookup
  async function handlePhoneLookup(e: React.FormEvent) {
    e.preventDefault()
    setLookingUp(true)
    setError(null)

    try {
      const { data, error } = await supabase.functions.invoke('submit-job', {
        body: {
          action: 'lookup',
          phone: phoneNumber
        }
      })

      if (error) throw error

      // Auto-fill form with found data
      if (data.found) {
        setLookupData(data)
        setFormData(prev => ({
          ...prev,
          submitter_name: data.name || '',
          submitter_email: data.email || '',
          submitter_phone: phoneNumber,
          submitter_address: data.address || '',
          submitter_city: data.city || '',
          submitter_state: data.state || '',
          submitter_zip_code: data.zip_code || '',
          submitter_date_of_birth: data.date_of_birth || '',
          submitter_employer: data.employer || '',
        }))
      } else {
        // Not found - just set the phone number
        setFormData(prev => ({
          ...prev,
          submitter_phone: phoneNumber
        }))
      }

      // Move to form step
      setStep('form')
    } catch (err: any) {
      console.error('Lookup error:', err)
      setError(err.message || 'Failed to lookup information')
    } finally {
      setLookingUp(false)
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  // Render phone lookup step
  if (step === 'phone') {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">
              Post a Job Opportunity
            </h1>
            <p className="mt-2 text-white/80">
              First, let&apos;s see if we have your information on file
            </p>
          </div>

          <form onSubmit={handlePhoneLookup} className="bg-white rounded-lg shadow p-8">
            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Your Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="(555) 123-4567"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                We&apos;ll use this to auto-fill your information if you&apos;re already in our system
              </p>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={lookingUp || !phoneNumber}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {lookingUp ? 'Looking up...' : 'Continue'}
            </button>

            <p className="mt-4 text-xs text-gray-500 text-center">
              Don&apos;t worry - you&apos;ll be able to review and edit all information before submitting
            </p>
          </form>
        </div>
      </div>
    )
  }

  // Render full form
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setStep('phone')}
            className="text-white hover:text-white/80 mb-4 flex items-center"
          >
            ← Back to phone lookup
          </button>
          <h1 className="text-3xl font-bold text-white">
            Post a Job or Volunteer Opportunity
          </h1>
          <p className="mt-2 text-white/80">
            Share opportunities with Missouri Young Democrats members
          </p>
          {lookupData?.found && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                ✓ We found your information! Please review and update if needed.
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
          {/* Position Details */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Position Details</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title <span className="text-red-500">*</span>
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
                  Job Description <span className="text-red-500">*</span>
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Compensation</h2>

            <div className="space-y-4">
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements &amp; Qualifications</h2>

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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Application &amp; Contact</h2>

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
                  placeholder="Where applicants should send their applications"
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

          {/* Your Information */}
          <div className="pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h2>
            <p className="text-sm text-gray-600 mb-4">
              Please review and complete your contact information
            </p>

            <div className="space-y-4">
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
                  <label htmlFor="submitter_phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="submitter_phone"
                    name="submitter_phone"
                    required
                    value={formData.submitter_phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="submitter_date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="submitter_date_of_birth"
                    name="submitter_date_of_birth"
                    value={formData.submitter_date_of_birth}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                <div>
                  <label htmlFor="submitter_zip_code" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="submitter_zip_code"
                    name="submitter_zip_code"
                    value={formData.submitter_zip_code}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    maxLength={5}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="submitter_employer" className="block text-sm font-medium text-gray-700 mb-1">
                  Employer (Optional)
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
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
