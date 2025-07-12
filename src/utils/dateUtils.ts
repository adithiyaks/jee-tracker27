import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns'

export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd')
}

export const formatDisplayDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy')
}

export const getMonthDays = (date: Date) => {
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  return eachDayOfInterval({ start, end })
}

export const getCalendarDays = (date: Date) => {
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)
  
  // Get the start of the week for the first day of the month
  const calendarStart = new Date(monthStart)
  calendarStart.setDate(calendarStart.getDate() - monthStart.getDay())
  
  // Get the end of the week for the last day of the month
  const calendarEnd = new Date(monthEnd)
  calendarEnd.setDate(calendarEnd.getDate() + (6 - monthEnd.getDay()))
  
  return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
}

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date())
}

export const isCurrentMonth = (date: Date, currentMonth: Date): boolean => {
  return isSameMonth(date, currentMonth)
}