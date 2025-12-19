'use client'

import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

export interface CustomQuestion {
  id: string
  question: string
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio'
  required: boolean
  options: string[]
  order: number
}

interface CustomQuestionsBuilderProps {
  questions: CustomQuestion[]
  onChange: (questions: CustomQuestion[]) => void
}

export default function CustomQuestionsBuilder({ questions, onChange }: CustomQuestionsBuilderProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftId, setDraftId] = useState<string | null>(null) // Track the current draft question in the list
  const [newQuestion, setNewQuestion] = useState<Partial<CustomQuestion>>({
    question: '',
    type: 'text',
    required: false,
    options: [],
  })
  const [newOption, setNewOption] = useState('')

  const needsOptions = useCallback((type: string) => ['select', 'checkbox', 'radio'].includes(type), [])

  // Check if the current draft is valid and complete
  const isDraftValid = useCallback(() => {
    if (!newQuestion.question?.trim()) return false
    if (needsOptions(newQuestion.type || 'text')) {
      // Count options including any pending option text
      const optionCount = (newQuestion.options?.length || 0) + (newOption.trim() ? 1 : 0)
      return optionCount > 0
    }
    return true
  }, [newQuestion, newOption, needsOptions])

  // Auto-save draft question to the list whenever it becomes valid
  useEffect(() => {
    if (!isDraftValid()) {
      // If draft is no longer valid and we have a draft in the list, remove it
      if (draftId) {
        onChange(questions.filter(q => q.id !== draftId).map((q, i) => ({ ...q, order: i })))
        setDraftId(null)
      }
      return
    }

    // Include any pending option
    let finalOptions = newQuestion.options || []
    if (newOption.trim()) {
      finalOptions = [...finalOptions, newOption.trim()]
    }

    const draftQuestion: CustomQuestion = {
      id: draftId || uuidv4(),
      question: newQuestion.question!.trim(),
      type: newQuestion.type || 'text',
      required: newQuestion.required || false,
      options: finalOptions,
      order: draftId ? questions.find(q => q.id === draftId)?.order ?? questions.length : questions.length,
    }

    if (draftId) {
      // Update existing draft in the list
      onChange(questions.map(q => q.id === draftId ? draftQuestion : q))
    } else {
      // Add new draft to the list
      setDraftId(draftQuestion.id)
      onChange([...questions, draftQuestion])
    }
  }, [newQuestion.question, newQuestion.type, newQuestion.required, newQuestion.options, newOption])

  function startNewQuestion() {
    // Clear the form to start a new question (the current one is already saved)
    setDraftId(null)
    setNewQuestion({
      question: '',
      type: 'text',
      required: false,
      options: [],
    })
    setNewOption('')
  }

  function removeQuestion(id: string) {
    if (id === draftId) {
      setDraftId(null)
      setNewQuestion({
        question: '',
        type: 'text',
        required: false,
        options: [],
      })
      setNewOption('')
    }
    onChange(questions.filter(q => q.id !== id).map((q, i) => ({ ...q, order: i })))
  }

  function updateQuestion(id: string, updates: Partial<CustomQuestion>) {
    onChange(questions.map(q => q.id === id ? { ...q, ...updates } : q))
  }

  function moveQuestion(id: string, direction: 'up' | 'down') {
    const index = questions.findIndex(q => q.id === id)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === questions.length - 1)
    ) return

    const newQuestions = [...questions]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    ;[newQuestions[index], newQuestions[swapIndex]] = [newQuestions[swapIndex], newQuestions[index]]
    onChange(newQuestions.map((q, i) => ({ ...q, order: i })))
  }

  function addOption() {
    if (!newOption.trim()) return
    setNewQuestion(prev => ({
      ...prev,
      options: [...(prev.options || []), newOption.trim()],
    }))
    setNewOption('')
  }

  function removeNewOption(index: number) {
    setNewQuestion(prev => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index) || [],
    }))
  }

  function addOptionToExisting(questionId: string, option: string) {
    const question = questions.find(q => q.id === questionId)
    if (!question || !option.trim()) return
    updateQuestion(questionId, { options: [...question.options, option.trim()] })
  }

  function removeOptionFromExisting(questionId: string, index: number) {
    const question = questions.find(q => q.id === questionId)
    if (!question) return
    updateQuestion(questionId, { options: question.options.filter((_, i) => i !== index) })
  }

  // Filter out the current draft from the display list (it's shown in the form below)
  const savedQuestions = questions.filter(q => q.id !== draftId)

  return (
    <div className="space-y-6">
      {/* Saved Questions */}
      {savedQuestions.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Added Questions</h4>
          {savedQuestions.map((q, index) => (
            <div key={q.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              {editingId === q.id ? (
                // Editing mode
                <div className="space-y-3">
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Question text"
                  />
                  <div className="flex gap-3">
                    <select
                      value={q.type}
                      onChange={(e) => updateQuestion(q.id, { type: e.target.value as CustomQuestion['type'] })}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="text">Short Text</option>
                      <option value="textarea">Long Text</option>
                      <option value="select">Dropdown</option>
                      <option value="radio">Single Choice</option>
                      <option value="checkbox">Multiple Choice</option>
                    </select>
                    <label className="flex items-center text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={q.required}
                        onChange={(e) => updateQuestion(q.id, { required: e.target.checked })}
                        className="mr-2"
                      />
                      Required
                    </label>
                  </div>
                  {needsOptions(q.type) && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500">Options:</p>
                      {q.options.map((opt, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <span className="text-sm text-gray-700 flex-1">{opt}</span>
                          <button
                            type="button"
                            onClick={() => removeOptionFromExisting(q.id, optIndex)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          id={`edit-option-${q.id}`}
                          placeholder="Add option"
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addOptionToExisting(q.id, e.currentTarget.value)
                              e.currentTarget.value = ''
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            const input = (e.target as HTMLButtonElement).previousElementSibling as HTMLInputElement
                            addOptionToExisting(q.id, input.value)
                            input.value = ''
                          }}
                          className="px-2 py-1 text-sm text-blue-600 hover:text-blue-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      // Save any pending option text before closing
                      if (needsOptions(q.type)) {
                        const input = document.getElementById(`edit-option-${q.id}`) as HTMLInputElement
                        if (input && input.value.trim()) {
                          addOptionToExisting(q.id, input.value)
                        }
                      }
                      setEditingId(null)
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Done Editing
                  </button>
                </div>
              ) : (
                // Display mode
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{q.question}</span>
                      {q.required && <span className="text-red-500 text-xs">*</span>}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="bg-gray-200 px-2 py-0.5 rounded">
                        {q.type === 'text' ? 'Short Text' :
                         q.type === 'textarea' ? 'Long Text' :
                         q.type === 'select' ? 'Dropdown' :
                         q.type === 'radio' ? 'Single Choice' :
                         'Multiple Choice'}
                      </span>
                      {needsOptions(q.type) && q.options.length > 0 && (
                        <span>{q.options.length} options</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveQuestion(q.id, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveQuestion(q.id, 'down')}
                      disabled={index === savedQuestions.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(q.id)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeQuestion(q.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add New Question */}
      <div className="border border-dashed border-gray-300 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">
            {draftId ? 'Current Question' : 'Add a Question'}
          </h4>
          {isDraftValid() && (
            <span className="text-xs text-green-600 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Auto-saved
            </span>
          )}
        </div>
        <div className="space-y-3">
          <input
            type="text"
            value={newQuestion.question || ''}
            onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="Enter your question..."
          />

          <div className="flex flex-wrap gap-3">
            <select
              value={newQuestion.type || 'text'}
              onChange={(e) => setNewQuestion(prev => ({
                ...prev,
                type: e.target.value as CustomQuestion['type'],
                options: needsOptions(e.target.value) ? prev.options : [],
              }))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="text">Short Text</option>
              <option value="textarea">Long Text</option>
              <option value="select">Dropdown</option>
              <option value="radio">Single Choice</option>
              <option value="checkbox">Multiple Choice</option>
            </select>

            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                checked={newQuestion.required || false}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, required: e.target.checked }))}
                className="mr-2"
              />
              Required
            </label>
          </div>

          {/* Options for select/radio/checkbox */}
          {needsOptions(newQuestion.type || 'text') && (
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
              <p className="text-xs text-gray-500">Add options for this question:</p>
              {newQuestion.options?.map((opt, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 flex-1">{opt}</span>
                  <button
                    type="button"
                    onClick={() => removeNewOption(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addOption()
                    }
                  }}
                  placeholder="Type an option and press Enter"
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <button
                  type="button"
                  onClick={addOption}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Add Option
                </button>
              </div>
            </div>
          )}

          {isDraftValid() && (
            <button
              type="button"
              onClick={startNewQuestion}
              className="w-full px-4 py-2 text-sm font-medium text-white rounded-md"
              style={{ backgroundColor: '#273351' }}
            >
              + Add Another Question
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
