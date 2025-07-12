import React, { useState, useEffect } from 'react'
import { X, Clock, BookOpen, Target, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { StudyDay, StudyStatus } from '../types'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

interface DayModalProps {
  date: Date
  studyDay: StudyDay | undefined
  onClose: () => void
  onSave: (data: Partial<StudyDay>) => Promise<void>
  onDelete?: (date: string) => Promise<void>
}

export const DayModal: React.FC<DayModalProps> = ({ 
  date, 
  studyDay, 
  onClose, 
  onSave, 
  onDelete 
}) => {
  const [status, setStatus] = useState<StudyStatus>(studyDay?.status || 'productive')
  const [notes, setNotes] = useState(studyDay?.notes || '')
  const [studyHours, setStudyHours] = useState(studyDay?.study_hours || 0)
  const [subjects, setSubjects] = useState<string[]>(studyDay?.subjects_studied || [])
  const [mockTestScore, setMockTestScore] = useState<number | null>(studyDay?.mock_test_score || null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const subjectOptions = ['Physics', 'Chemistry', 'Mathematics']

  // Update form when studyDay changes
  useEffect(() => {
    if (studyDay) {
      setStatus(studyDay.status)
      setNotes(studyDay.notes || '')
      setStudyHours(studyDay.study_hours || 0)
      setSubjects(studyDay.subjects_studied || [])
      setMockTestScore(studyDay.mock_test_score || null)
    }
  }, [studyDay])

  const handleSubjectChange = (subject: string, checked: boolean) => {
    if (checked) {
      setSubjects(prev => [...prev, subject])
    } else {
      setSubjects(prev => prev.filter(s => s !== subject))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave({
        status: status as 'productive' | 'partial' | 'unproductive',
        notes,
        study_hours: studyHours,
        subjects_studied: subjects,
        mock_test_score: mockTestScore
      })
      
      console.log('Study day saved successfully!')
      onClose()
    } catch (error) {
      console.error('Error saving study day:', error)
      alert('Failed to save study day. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete || !studyDay) return
    
    if (!confirm('Are you sure you want to delete this study day?')) return

    setDeleting(true)
    try {
      await onDelete(format(date, 'yyyy-MM-dd'))
      onClose()
    } catch (error) {
      console.error('Error deleting study day:', error)
      alert('Failed to delete study day. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  const getStatusColor = (statusType: StudyStatus) => {
    switch (statusType) {
      case 'productive':
        return 'bg-green-500 text-white border-green-500'
      case 'partial':
        return 'bg-yellow-500 text-white border-yellow-500'
      case 'unproductive':
        return 'bg-red-500 text-white border-red-500'
      default:
        return 'bg-gray-300 text-gray-600 border-gray-300'
    }
  }

  const getStatusIcon = (statusType: StudyStatus) => {
    switch (statusType) {
      case 'productive': return '🔥'
      case 'partial': return '⚡'
      case 'unproductive': return '😞'
      default: return '❌'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {format(date, 'EEEE, MMMM dd, yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            {studyDay && onDelete && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Delete study day"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How was your study session?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'productive', label: 'Productive', icon: '🔥' },
                { value: 'partial', label: 'Partial', icon: '⚡' },
                { value: 'unproductive', label: 'Unproductive', icon: '😞' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatus(option.value as StudyStatus)}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200 text-center hover:scale-105
                    ${status === option.value
                      ? getStatusColor(option.value as StudyStatus)
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <div className="text-sm font-medium">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Study Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Study Hours
            </label>
            <input
              type="number"
              value={studyHours}
              onChange={(e) => setStudyHours(Number(e.target.value))}
              min="0"
              max="24"
              step="0.5"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter hours studied"
            />
          </div>

          {/* Subjects */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <BookOpen className="w-4 h-4 inline mr-1" />
              Subjects Studied
            </label>
            <div className="grid grid-cols-3 gap-3">
              {subjectOptions.map((subject) => (
                <label 
                  key={subject} 
                  className={`
                    flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all
                    ${subjects.includes(subject)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={subjects.includes(subject)}
                    onChange={(e) => handleSubjectChange(subject, e.target.checked)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{subject}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Mock Test Score */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Target className="w-4 h-4 inline mr-1" />
              Mock Test Score (Optional)
            </label>
            <input
              type="number"
              value={mockTestScore || ''}
              onChange={(e) => setMockTestScore(e.target.value ? Number(e.target.value) : null)}
              min="0"
              max="720"
              placeholder="Enter score out of 720"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Study Notes & Reflections
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <ReactQuill
                value={notes}
                onChange={setNotes}
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link'],
                    ['clean']
                  ]
                }}
                formats={[
                  'header', 'bold', 'italic', 'underline',
                  'list', 'bullet', 'link'
                ]}
                placeholder="What did you study today? Any difficulties, insights, or key concepts learned?"
                className="bg-white"
                style={{ minHeight: '120px' }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-500">
            {studyDay ? 'Last updated: ' + format(new Date(studyDay.updated_at), 'MMM dd, h:mm a') : 'New entry'}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`
                px-6 py-2 rounded-lg font-medium transition-all duration-200
                ${saving
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                }
              `}
            >
              {saving ? 'Saving...' : 'Save Study Day'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}