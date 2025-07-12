export interface User {
  id: string
  username: string
  email: string
  target_year: number
  exam_type: 'JEE Main' | 'JEE Advanced' | 'Both'
  created_at: string
}

export interface StudyDay {
  id: string
  user_id: string
  date: string
  status: 'productive' | 'partial' | 'unproductive'
  notes: string
  study_hours: number
  subjects_studied: string[]
  mock_test_score?: number
  created_at: string
  updated_at: string
}

export interface StudyStats {
  currentStreak: number
  longestStreak: number
  totalStudyDays: number
  averageHoursPerDay: number
  productivePercentage: number
  subjectDistribution: {
    Physics: number
    Chemistry: number
    Mathematics: number
  }
  monthlyConsistency: number
  daysUntilJEE: number
}

export interface StudyGoal {
  id: string
  user_id: string
  goal_type: string
  target_value: number
  current_value: number
}

export type StudyStatus = 'productive' | 'partial' | 'unproductive' | 'untracked'