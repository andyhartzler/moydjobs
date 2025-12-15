'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import CustomQuestionsBuilder, { CustomQuestion } from './CustomQuestionsBuilder'

interface PosterJobFormProps {
  job: {
    id: string
    title: string
    organization: string
    description: string
    job_type: string
    location?: string
    location_type?: string
    is_paid?: boolean
    salary_range?: string
    hourly_rate?: string
    requirements?: string
    qualifications?: string
    contact_email: string
    contact_name?: string
    contact_phone?: string
    application_url?: string
    application_instructions?: string
    expires_at?: string
    custom_questions?: CustomQuestion[]
  }
}

export default function PosterJobForm({ job }: PosterJobFormProps) {
  const [formData, setFormData] = useState({
    title: job.title,
    organization: job.organization,
    description: job.description,
    job_type: job.job_type,
    location: job.location || '',
    location_type: job.location_type || 'in-person',
    is_paid: job.is_paid || false,
    salary_range: job.salary_range || '',
    hourly_rate: job.hourly_rate || '',
    requirements: job.requirements || '',
    qualifications: job.qualifications || '',
    contact_email: job.contact_email,
    contact_name: job.contact_name || '',
    contact_phone: job.contact_phone || '',
    application_url: job.application_url || '',
    application_instructions: job.application_instructions || '',
    expires_at: job.expires_at ? job.expires_at.split('T')[0] : '',
  })
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>(job.custom_questions || [])
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setFormData(prev => ({ ...prev, [name]: newValue }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    const { error: updateError } = await supabase
      .from('jobs')
      .update({
        ...formData,
        expires_at: formData.expires_at || null,
        custom_questions: customQuestions.length > 0 ? customQuestions : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', job.id)

    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    setSaving(false)
  }

  async function handleDelete() {
    setDeleting(true)

    const { error: deleteError } = await supabase
      .from('jobs')
      .update({ status: 'archived' })
      .eq('id', job.id)

    if (deleteError) {
      setError(deleteError.message)
      setDeleting(false)
    } else {
      router.push('/poster/dashboard')
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">Changes saved successfully!</p>
          </div>
        )}

        {/* Title & Organization */}
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Position Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
              Organization
            </label>
            <input
              type="text"
              id="organization"
              name="organization"
              required
              value={formData.organization}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Job Type & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="job_type" className="block text-sm font-medium text-gray-700 mb-1">
              Position Type
            </label>
            <select
              id="job_type"
              name="job_type"
              value={formData.job_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
              Location Type
            </label>
            <select
              id="location_type"
              name="location_type"
              value={formData.location_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="City, State"
          />
        </div>

        {/* Compensation */}
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_paid"
              name="is_paid"
              checked={formData.is_paid}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="is_paid" className="ml-2 text-sm text-gray-700">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., $15-20/hour"
                />
              </div>
            </div>
          )}
        </div>

        {/* Requirements */}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Contact & Application */}
        <div className="space-y-4">
          <div>
            <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              id="contact_email"
              name="contact_email"
              required
              value={formData.contact_email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Custom Questions */}
        <div className="space-y-4 pt-6 border-t border-gray-200">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">Custom Application Questions</h3>
            <p className="text-xs text-gray-500 mb-4">
              Add additional questions for applicants to answer when they apply.
            </p>
            <CustomQuestionsBuilder
              questions={customQuestions}
              onChange={setCustomQuestions}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 text-red-600 hover:text-red-700 font-medium"
          >
            Archive Listing
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 rounded-md text-white font-medium disabled:opacity-50"
            style={{ backgroundColor: '#273351' }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Archive This Listing?</h3>
            <p className="text-gray-600 mb-6">
              This will remove the job posting from the public listing. You can still view it in your dashboard.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Archiving...' : 'Archive'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
