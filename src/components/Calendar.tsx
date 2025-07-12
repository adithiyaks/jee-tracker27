import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addMonths, subMonths } from 'date-fns'
import { getCalendarDays, formatDate, isToday, isCurrentMonth } from '../utils/dateUtils'
import { StudyDay, StudyStatus } from '../types'

interface CalendarProps {
  studyDays: StudyDay[]
  onDayClick: (date: Date) => void
  currentMonth: Date
  onMonthChange: (month: Date) => void
}

export const Calendar: React.FC<CalendarProps> = ({
  studyDays,
  onDayClick,
  currentMonth,
  onMonthChange
}) => {
  const calendarDays = getCalendarDays(currentMonth)
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getStatusForDate = (date: Date): StudyStatus => {
    const dateStr = formatDate(date)
    const studyDay = studyDays.find(d => d.date === dateStr)
    return studyDay?.status || 'untracked'
  }

  const getStudyHours = (date: Date): number => {
    const dateStr = formatDate(date)
    const studyDay = studyDays.find(d => d.date === dateStr)
    return studyDay?.study_hours || 0
  }

  const getStatusColor = (status: StudyStatus, isCurrentMonthDay: boolean) => {
    if (!isCurrentMonthDay) return 'bg-gray-50 text-gray-300 cursor-default'
    
    switch (status) {
      case 'productive':
        return 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200 hover:scale-105 cursor-pointer'
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200 hover:scale-105 cursor-pointer'
      case 'unproductive':
        return 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200 hover:scale-105 cursor-pointer'
      default:
        return 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:scale-105 cursor-pointer'
    }
  }

  const getStatusIcon = (status: StudyStatus) => {
    switch (status) {
      case 'productive': return '🔥'
      case 'partial': return '⚡'
      case 'unproductive': return '😞'
      default: return ''
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = direction === 'prev' ? subMonths(currentMonth, 1) : addMonths(currentMonth, 1)
    onMonthChange(newMonth)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-semibold text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const isCurrentMonthDay = isCurrentMonth(day, currentMonth)
          const status = getStatusForDate(day)
          const studyHours = getStudyHours(day)
          const isTodayDate = isToday(day)
          const statusIcon = getStatusIcon(status)
          
          return (
            <button
              key={index}
              onClick={() => isCurrentMonthDay && onDayClick(day)}
              className={`
                aspect-square p-2 text-sm font-medium border rounded-lg transition-all duration-200 relative
                ${getStatusColor(status, isCurrentMonthDay)}
                ${isTodayDate ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
              `}
              disabled={!isCurrentMonthDay}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-base font-semibold">
                  {format(day, 'd')}
                </div>
                {statusIcon && (
                  <div className="text-xs mt-1">
                    {statusIcon}
                  </div>
                )}
                {studyHours > 0 && isCurrentMonthDay && (
                  <div className="text-xs text-gray-600 mt-1">
                    {studyHours}h
                  </div>
                )}
              </div>
              
              {/* Today indicator */}
              {isTodayDate && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded flex items-center justify-center text-xs">
            🔥
          </div>
          <span>Productive</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded flex items-center justify-center text-xs">
            ⚡
          </div>
          <span>Partial</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded flex items-center justify-center text-xs">
            😞
          </div>
          <span>Unproductive</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
          <span>Untracked</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center text-sm text-gray-500">
        Click on any day to track your study progress
      </div>
    </div>
  )
}