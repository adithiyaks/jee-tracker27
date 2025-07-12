import React from 'react'
import { Heart, Star, Target } from 'lucide-react'
import { getMotivationalMessage } from '../utils/motivationalMessages'
import { StudyStats } from '../types'

interface MotivationalCardProps {
  stats: StudyStats
}

export const MotivationalCard: React.FC<MotivationalCardProps> = ({ stats }) => {
  const message = getMotivationalMessage(stats)
  
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -ml-12 -mb-12"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-5 h-5 text-yellow-300" />
          <h3 className="text-lg font-semibold">Daily Motivation</h3>
        </div>
        
        <p className="text-lg mb-4">{message}</p>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            <span>{stats.daysUntilJEE} days to JEE</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>{stats.currentStreak} day streak</span>
          </div>
        </div>
      </div>
    </div>
  )
}