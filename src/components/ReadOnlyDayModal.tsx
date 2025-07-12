import React from 'react'
import { X, Clock, BookOpen, Target, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { StudyDay } from '../types'

interface ReadOnlyDayModalProps {
  studyDay: StudyDay
  onClose: () => void
}

export const ReadOnlyDayModal: React.FC<ReadOnlyDayModalProps> = ({ 
  studyDay, 
  onClose
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'productive':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'unproductive':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'productive': return '🔥'
      case 'partial': return '⚡'
      case 'unproductive': return '😞'
      default: return '❌'
    }
  }

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'EEEE, MMMM dd, yyyy')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {formatDate(studyDay.date)}
              </h2>
              <p className="text-sm text-gray-600">Study Day Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Display */}
          <div className="text-center">
            <div className={`
              inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 text-lg font-semibold
              ${getStatusColor(studyDay.status)}
            `}>
              <span className="text-2xl">{getStatusIcon(studyDay.status)}</span>
              <span className="capitalize">{studyDay.status} Day</span>
            </div>
          </div>

          {/* Study Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Study Hours */}
            <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
              <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-800">
                {studyDay.study_hours || 0}h
              </div>
              <div className="text-sm text-blue-600">Study Hours</div>
            </div>

            {/* Subjects Studied */}
            <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
              <BookOpen className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-green-800">
                {studyDay.subjects_studied?.length || 0}
              </div>
              <div className="text-sm text-green-600">Subjects</div>
            </div>

            {/* Mock Test Score */}
            <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
              <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-purple-800">
                {studyDay.mock_test_score || 'N/A'}
              </div>
              <div className="text-sm text-purple-600">Mock Test Score</div>
            </div>
          </div>

          {/* Subjects Studied Details */}
          {studyDay.subjects_studied && studyDay.subjects_studied.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Subjects Studied
              </h3>
              <div className="flex flex-wrap gap-2">
                {studyDay.subjects_studied.map((subject, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Study Notes & Reflections
            </h3>
            {studyDay.notes && studyDay.notes.trim() ? (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div 
                  className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: studyDay.notes }}
                />
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                <p className="text-gray-500 italic">No notes recorded for this day</p>
              </div>
            )}
          </div>

          {/* Additional Details */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2">Session Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Created:</span>
                <span className="ml-2 font-medium">
                  {format(new Date(studyDay.created_at), 'MMM dd, yyyy h:mm a')}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Last Updated:</span>
                <span className="ml-2 font-medium">
                  {format(new Date(studyDay.updated_at), 'MMM dd, yyyy h:mm a')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}