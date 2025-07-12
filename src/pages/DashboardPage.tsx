import React, { useState } from 'react'
import { LogOut, Calendar as CalendarIcon, TrendingUp, BookOpen, Target } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useStudyData } from '../hooks/useStudyData'
import { Calendar } from '../components/Calendar'
import { DayModal } from '../components/DayModal'
import { ReadOnlyDayModal } from '../components/ReadOnlyDayModal'
import { StatsCard } from '../components/StatsCard'
import { MotivationalCard } from '../components/MotivationalCard'
import { ProgressChart } from '../components/ProgressChart'
import { formatDate } from '../utils/dateUtils'

export const DashboardPage: React.FC = () => {
  const { user, signOut } = useAuth()
  const { studyDays, stats, loading, updateStudyDay, getStudyDay, deleteStudyDay } = useStudyData(user?.id)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewOnlyStudyDay, setViewOnlyStudyDay] = useState<StudyDay | null>(null)

  const handleDayClick = (date: Date) => {
    console.log('Day clicked:', date)
    setSelectedDate(date)
    setViewOnlyStudyDay(null) // Close read-only modal if open
  }

  const handleSave = async (data: any) => {
    if (!selectedDate) return
    
    const dateStr = formatDate(selectedDate)
    console.log('Saving study day:', { dateStr, data })
    
    try {
      await updateStudyDay(dateStr, data)
      console.log('Study day saved successfully')
    } catch (error) {
      console.error('Failed to save study day:', error)
      throw error
    }
  }

  const handleDelete = async (date: string) => {
    try {
      await deleteStudyDay(date)
      console.log('Study day deleted successfully')
    } catch (error) {
      console.error('Failed to delete study day:', error)
      throw error
    }
  }

  const handleRecentDayClick = (studyDay: StudyDay) => {
    setViewOnlyStudyDay(studyDay)
    setSelectedDate(null) // Close edit modal if open
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your study data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">JEE Tracker</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome back!</span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Current Streak"
            value={`${stats.currentStreak} days`}
            icon={CalendarIcon}
            color="blue"
            subtitle="Keep it going! 🔥"
          />
          <StatsCard
            title="Total Study Days"
            value={stats.totalStudyDays}
            icon={BookOpen}
            color="green"
            subtitle="Days tracked"
          />
          <StatsCard
            title="Avg Hours/Day"
            value={`${stats.averageHoursPerDay}h`}
            icon={TrendingUp}
            color="purple"
            subtitle="Study time"
          />
          <StatsCard
            title="Productivity"
            value={`${stats.productivePercentage}%`}
            icon={Target}
            color="yellow"
            subtitle="Success rate"
          />
        </div>

        {/* Motivational Card */}
        <div className="mb-8">
          <MotivationalCard stats={stats} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Calendar
              studyDays={studyDays}
              onDayClick={handleDayClick}
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
            />
          </div>

          {/* Progress Chart */}
          <div>
            <ProgressChart stats={stats} />
            
            {/* Additional Stats */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Longest Streak</span>
                  <span className="font-semibold text-gray-900">{stats.longestStreak} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Monthly Consistency</span>
                  <span className="font-semibold text-gray-900">{stats.monthlyConsistency}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Days Until JEE</span>
                  <span className="font-semibold text-blue-600">{stats.daysUntilJEE} days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {studyDays.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Study Days</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {studyDays.slice(0, 6).map((day) => (
                <div
                  key={day.id}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105
                    ${day.status === 'productive' ? 'border-green-200 bg-green-50' :
                      day.status === 'partial' ? 'border-yellow-200 bg-yellow-50' :
                      'border-red-200 bg-red-50'
                    }
                  `}
                  onClick={() => handleRecentDayClick(day)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className={`
                      px-2 py-1 text-xs rounded-full font-medium
                      ${day.status === 'productive' ? 'bg-green-100 text-green-800' :
                        day.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }
                    `}>
                      {day.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {day.study_hours}h studied
                  </div>
                  {day.subjects_studied.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {day.subjects_studied.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Day Modal */}
      {selectedDate && (
        <DayModal
          date={selectedDate}
          studyDay={getStudyDay(formatDate(selectedDate))}
          onClose={() => setSelectedDate(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}

      {/* Read-Only Day Modal */}
      {viewOnlyStudyDay && (
        <ReadOnlyDayModal
          studyDay={viewOnlyStudyDay}
          onClose={() => setViewOnlyStudyDay(null)}
        />
      )}
    </div>
  )
}