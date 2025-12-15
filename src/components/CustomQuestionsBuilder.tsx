'use client'

import { useState } from 'react'
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
  const [newQuestion, setNewQuestion] = useState<Partial<CustomQuestion>>({
    question: '',
    type: 'text',
    required: false,
    options: [],
  })
  const [newOption, setNewOption] = useState('')

  function addQuestion() {
    if (!newQuestion.question?.trim()) return

    const question: CustomQuestion = {
      id: uuidv4(),
      question: newQuestion.question.trim(),
      type: newQuestion.type || 'text',
      required: newQuestion.required || false,
      options: newQuestion.options || [],
      order: questions.length,
    }

    onChange([...questions, question])
    setNewQuestion({
      question: '',
      type: 'text',
      required: false,
      options: [],
    })
    setNewOption('')
  }

  function removeQuestion(id: string) {
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

  const needsOptions = (type: string) => ['select', 'checkbox', 'radio'].includes(type)

  return (
    <div className="space-y-6">
      {/* Existing Questions */}
      {questions.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Added Questions</h4>
          {questions.map((q, index) => (
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
                    onClick={() => setEditingId(null)}
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
                      disabled={index === questions.length - 1}
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
        <h4 className="text-sm font-medium text-gray-700 mb-3">Add a Question</h4>
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

          <button
            type="button"
            onClick={addQuestion}
            disabled={!newQuestion.question?.trim() || (needsOptions(newQuestion.type || 'text') && (!newQuestion.options || newQuestion.options.length === 0))}
            className="w-full px-4 py-2 text-sm font-medium text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#273351' }}
          >
            Add Question
          </button>
        </div>
      </div>
    </div>
  )
}
