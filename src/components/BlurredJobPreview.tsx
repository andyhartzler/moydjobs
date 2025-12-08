'use client'

import { useState } from 'react'

interface BlurredJobPreviewProps {
  job: any
}

export default function BlurredJobPreview({ job }: BlurredJobPreviewProps) {
  const [showModal, setShowModal] = useState(false)

  const typeColors: Record<string, string> = {
    'full-time': 'bg-green-100 text-green-800',
    'part-time': 'bg-blue-100 text-blue-800',
    'internship': 'bg-purple-100 text-purple-800',
    'volunteer': 'bg-yellow-100 text-yellow-800',
    'contract': 'bg-gray-100 text-gray-800'
  }

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer relative overflow-hidden"
      >
        {/* Blur overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-white/30 z-10 flex items-center justify-center">
          <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">
            <p className="font-semibold">🔒 Members Only</p>
            <p className="text-sm">Click to view</p>
          </div>
        </div>

        {/* Blurred content */}
        <div className="filter blur-[3px]">
          {job.featured && (
            <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-yellow-500 rounded-full mb-2">
              Featured
            </span>
          )}

          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {job.title}
          </h3>

          <p className="text-gray-600 text-sm mb-3">{job.organization}</p>

          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${typeColors[job.job_type] || typeColors['contract']}`}>
              {job.job_type.replace('-', ' ').toUpperCase()}
            </span>

            {job.location_type && (
              <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
                {job.location_type}
              </span>
            )}
          </div>

          {job.location && (
            <p className="text-sm text-gray-500">
              📍 {job.location}
            </p>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Join MOYD to View Jobs
              </h3>

              <p className="text-gray-600 mb-6">
                Become a member to access exclusive job and volunteer opportunities.
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
              </div>

              <p className="mt-4 text-xs text-gray-500">
                Membership is free for students and young Democrats
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
