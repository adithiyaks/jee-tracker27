import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StudyDay, StudyStats } from '../types'
import { format, startOfMonth, endOfMonth, differenceInDays, parseISO, isBefore, isAfter } from 'date-fns'

export const useStudyData = (userId: string | undefined) => {
  const [studyDays, setStudyDays] = useState<StudyDay[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<StudyStats>({
    currentStreak: 0,
    longestStreak: 0,
    totalStudyDays: 0,
    averageHoursPerDay: 0,
    productivePercentage: 0,
    subjectDistribution: {
      Physics: 0,
      Chemistry: 0,
      Mathematics: 0
    },
    monthlyConsistency: 0,
    daysUntilJEE: 0
  })

  useEffect(() => {
    if (!userId) return
    fetchStudyDays()
  }, [userId])

  // Recalculate stats whenever studyDays changes
  useEffect(() => {
    calculateStats(studyDays)
  }, [studyDays])

  const fetchStudyDays = async () => {
    if (!userId) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('study_days')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })

      if (error) {
        console.error('Error fetching study days:', error)
        throw error
      }
      
      const studyDaysData = data || []
      console.log('Fetched study days:', studyDaysData)
      setStudyDays(studyDaysData)
    } catch (error) {
      console.error('Error fetching study days:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (days: StudyDay[]) => {
    console.log('Calculating stats for days:', days.length)
    
    if (!days.length) {
      setStats({
        currentStreak: 0,
        longestStreak: 0,
        totalStudyDays: 0,
        averageHoursPerDay: 0,
        productivePercentage: 0,
        subjectDistribution: { Physics: 0, Chemistry: 0, Mathematics: 0 },
        monthlyConsistency: 0,
        daysUntilJEE: Math.max(0, differenceInDays(new Date(new Date().getFullYear() + 1, 3, 1), new Date()))
      })
      return
    }

    const totalDays = days.length
    const productiveDays = days.filter(d => d.status === 'productive').length
    const partialDays = days.filter(d => d.status === 'partial').length
    
    // Calculate streaks more accurately
    const sortedDays = [...days].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Calculate current streak (from today backwards)
    const todayStr = format(today, 'yyyy-MM-dd')
    let checkDate = new Date(today)
    
    for (let i = 0; i < 365; i++) { // Check up to a year back
      const dateStr = format(checkDate, 'yyyy-MM-dd')
      const dayData = days.find(d => d.date === dateStr)
      
      if (dayData && (dayData.status === 'productive' || dayData.status === 'partial')) {
        if (dateStr <= todayStr) {
          currentStreak++
        }
      } else {
        break
      }
      
      checkDate.setDate(checkDate.getDate() - 1)
    }

    // Calculate longest streak
    tempStreak = 0
    for (const day of sortedDays) {
      if (day.status === 'productive' || day.status === 'partial') {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 0
      }
    }

    // Calculate subject distribution
    const subjectCounts = { Physics: 0, Chemistry: 0, Mathematics: 0 }
    days.forEach(day => {
      if (day.subjects_studied && Array.isArray(day.subjects_studied)) {
        day.subjects_studied.forEach(subject => {
          if (subject in subjectCounts) {
            subjectCounts[subject as keyof typeof subjectCounts]++
          }
        })
      }
    })

    const totalSubjects = Object.values(subjectCounts).reduce((a, b) => a + b, 0)
    const subjectDistribution = {
      Physics: totalSubjects ? Math.round((subjectCounts.Physics / totalSubjects) * 100) : 0,
      Chemistry: totalSubjects ? Math.round((subjectCounts.Chemistry / totalSubjects) * 100) : 0,
      Mathematics: totalSubjects ? Math.round((subjectCounts.Mathematics / totalSubjects) * 100) : 0
    }

    // Calculate monthly consistency
    const currentMonth = new Date()
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const monthlyDays = days.filter(d => {
      const date = parseISO(d.date)
      return date >= monthStart && date <= monthEnd
    })
    const daysInMonth = differenceInDays(monthEnd, monthStart) + 1
    const monthlyConsistency = Math.round((monthlyDays.length / daysInMonth) * 100)

    // Calculate days until JEE (JEE date: Jan 22, 2027)
    const jeeDate = new Date(2027, 0, 22) // January = 0
    const tday = new Date()              // Current actual date
    const daysUntilJEE = Math.max(0, differenceInDays(jeeDate, tday))



    // Calculate average hours
    const totalHours = days.reduce((sum, d) => sum + (d.study_hours || 0), 0)
    const averageHoursPerDay = totalDays ? Math.round((totalHours / totalDays) * 10) / 10 : 0

    // Calculate productivity percentage
    const productivePercentage = totalDays ? 
      Math.round(((productiveDays + partialDays * 0.5) / totalDays) * 100) : 0

    const newStats = {
      currentStreak,
      longestStreak,
      totalStudyDays: totalDays,
      averageHoursPerDay,
      productivePercentage,
      subjectDistribution,
      monthlyConsistency,
      daysUntilJEE
    }

    console.log('Updated stats:', newStats)
    setStats(newStats)
  }

  const updateStudyDay = async (date: string, data: Partial<StudyDay>) => {
    if (!userId) return

    try {
      console.log('Updating study day:', { date, data })
      
      const updateData = {
        user_id: userId,
        date,
        status: data.status || 'productive',
        notes: data.notes || '',
        study_hours: data.study_hours || 0,
        subjects_studied: data.subjects_studied || [],
        mock_test_score: data.mock_test_score || null,
        updated_at: new Date().toISOString()
      }

      const { data: result, error } = await supabase
        .from('study_days')
        .upsert(updateData, {
          onConflict: 'user_id,date'
        })
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Study day updated successfully:', result)
      
      // IMMEDIATE UI UPDATE - Update local state right away
      const newStudyDay = result[0] as StudyDay
      setStudyDays(currentDays => {
        const existingIndex = currentDays.findIndex(d => d.date === date)
        let updatedDays
        
        if (existingIndex >= 0) {
          // Update existing day
          updatedDays = [...currentDays]
          updatedDays[existingIndex] = newStudyDay
        } else {
          // Add new day
          updatedDays = [newStudyDay, ...currentDays]
        }
        
        // Sort by date (newest first)
        updatedDays.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        
        console.log('Updated study days locally:', updatedDays)
        return updatedDays
      })
      
      return result
    } catch (error) {
      console.error('Error updating study day:', error)
      throw error
    }
  }

  const getStudyDay = (date: string) => {
    return studyDays.find(d => d.date === date)
  }

  const deleteStudyDay = async (date: string) => {
    if (!userId) return

    try {
      const { error } = await supabase
        .from('study_days')
        .delete()
        .eq('user_id', userId)
        .eq('date', date)

      if (error) throw error
      
      // IMMEDIATE UI UPDATE - Remove from local state
      setStudyDays(currentDays => {
        const updatedDays = currentDays.filter(d => d.date !== date)
        console.log('Removed study day locally:', updatedDays)
        return updatedDays
      })
    } catch (error) {
      console.error('Error deleting study day:', error)
      throw error
    }
  }

  return {
    studyDays,
    stats,
    loading,
    updateStudyDay,
    getStudyDay,
    deleteStudyDay,
    refetch: fetchStudyDays
  }
}