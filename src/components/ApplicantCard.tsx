'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

interface ApplicantCardProps {
  applicant: {
    id: string
    applicant_name: string
    applicant_email: string
    applicant_phone?: string
    applicant_city?: string
    applicant_zip_code?: string
    resume_url?: string
    cover_letter?: string
    status: string
    created_at: string
    member_id?: string
    member?: {
      first_name: string
      last_name: string
      email: string
      phone?: string
    }
  }
}

export default function ApplicantCard({ applicant }: ApplicantCardProps) {
  const [status, setStatus] = useState(applicant.status)
  const [updating, setUpdating] = useState(false)
  const supabase = createClient()

  const statusColors: Record<string, string> = {
    'submitted': 'bg-blue-100 text-blue-800',
    'reviewed': 'bg-yellow-100 text-yellow-800',
    'shortlisted': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800',
    'accepted': 'bg-emerald-100 text-emerald-800',
  }

  async function updateStatus(newStatus: string) {
    setUpdating(true)
    const { error } = await supabase
      .from('job_applications')
      .update({ status: newStatus })
      .eq('id', applicant.id)

    if (!error) {
      setStatus(newStatus)
    }
    setUpdating(false)
  }

  // Check if cover_letter is a file upload reference
  const coverLetterIsFile = applicant.cover_letter?.startsWith('[Uploaded:')
  const coverLetterUrl = coverLetterIsFile
    ? `https://faajpcarasilbfndzkmd.supabase.co/storage/v1/object/public/job-applications/${applicant.cover_letter.match(/\[Uploaded: (.+)\]/)?.[1]}`
    : null

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{applicant.applicant_name}</h3>
          <p className="text-gray-600">{applicant.applicant_email}</p>
          {applicant.applicant_phone && (
            <p className="text-gray-500 text-sm">{applicant.applicant_phone}</p>
          )}
          {applicant.applicant_city && (
            <p className="text-gray-500 text-sm">
              {applicant.applicant_city}{applicant.applicant_zip_code ? `, ${applicant.applicant_zip_code}` : ''}
            </p>
          )}
        </div>
        <div className="text-right">
          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          <p className="text-xs text-gray-500 mt-1">
            Applied {new Date(applicant.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Member badge */}
      {applicant.member_id && (
        <div className="mb-4">
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            MOYD Member
          </span>
        </div>
      )}

      {/* Cover Letter */}
      {applicant.cover_letter && !coverLetterIsFile && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Cover Letter</h4>
          <p className="text-gray-600 text-sm whitespace-pre-line">{applicant.cover_letter}</p>
        </div>
      )}

      {/* Documents */}
      <div className="flex gap-3">
        {applicant.resume_url && (
          <a
            href={applicant.resume_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Resume
          </a>
        )}
        {coverLetterUrl && (
          <a
            href={coverLetterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Cover Letter
          </a>
        )}
        <a
          href={`mailto:${applicant.applicant_email}`}
          className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Email
        </a>
      </div>

      {/* Status Update */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <label className="text-sm font-medium text-gray-700 mr-3">Update Status:</label>
        <select
          value={status}
          onChange={(e) => updateStatus(e.target.value)}
          disabled={updating}
          className="text-sm border border-gray-300 rounded-md px-2 py-1"
        >
          <option value="submitted">Submitted</option>
          <option value="reviewed">Reviewed</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
          <option value="accepted">Accepted</option>
        </select>
        {updating && <span className="ml-2 text-sm text-gray-500">Saving...</span>}
      </div>
    </div>
  )
}
