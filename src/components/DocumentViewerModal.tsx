'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface DocumentViewerModalProps {
  isOpen: boolean
  onClose: () => void
  url: string
  title: string
}

export default function DocumentViewerModal({ isOpen, onClose, url, title }: DocumentViewerModalProps) {
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      // Prevent body scroll when modal is open
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'

      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      document.addEventListener('keydown', handleEscape)

      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    } else {
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }
  }, [isOpen, onClose])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
    }
  }, [])

  if (!isOpen || !mounted) return null

  // Determine file type from URL
  const fileExtension = url.split('.').pop()?.toLowerCase().split('?')[0] || ''
  const isWordDoc = ['doc', 'docx'].includes(fileExtension)
  const isPdf = fileExtension === 'pdf'

  // For Word docs, use Microsoft Office Online viewer
  // For PDFs, embed directly
  let viewerUrl = url
  if (isWordDoc) {
    viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`
  }

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 99999,
        isolation: 'isolate'
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        style={{ zIndex: 99999 }}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-lg shadow-2xl w-[95vw] h-[90vh] max-w-6xl flex flex-col"
        style={{ zIndex: 100000 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white rounded-t-lg shrink-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate pr-4">{title}</h3>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={url}
              download
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Document viewer */}
        <div className="flex-1 relative bg-gray-100 rounded-b-lg overflow-hidden min-h-0">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-sm text-gray-600">Loading document...</p>
              </div>
            </div>
          )}

          {isPdf ? (
            <iframe
              src={url}
              className="w-full h-full border-0"
              onLoad={() => setLoading(false)}
              title={title}
              style={{ minHeight: '100%' }}
            />
          ) : isWordDoc ? (
            <iframe
              src={viewerUrl}
              className="w-full h-full border-0"
              onLoad={() => setLoading(false)}
              title={title}
              style={{ minHeight: '100%' }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600 mb-4">This file type cannot be previewed in the browser.</p>
                <a
                  href={url}
                  download
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download File
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // Use portal to render at document root level, avoiding any stacking context issues
  return createPortal(modalContent, document.body)
}
