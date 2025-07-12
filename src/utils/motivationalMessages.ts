import { StudyStats } from '../types'

export const getMotivationalMessage = (stats: StudyStats): string => {
  const { currentStreak, productivePercentage, daysUntilJEE } = stats

  if (currentStreak >= 7) {
    return "🔥 Amazing consistency! You're building the habits that crack JEE!"
  }
  
  if (currentStreak >= 3) {
    return "💪 Great streak going! Consistency is the key to success!"
  }
  
  if (productivePercentage >= 80) {
    return "⭐ Outstanding performance! You're on track for JEE success!"
  }
  
  if (productivePercentage >= 60) {
    return "📈 Good progress! Keep pushing your limits!"
  }
  
  if (daysUntilJEE <= 30) {
    return `⏰ Final sprint! Only ${daysUntilJEE} days left. Make every moment count!`
  }
  
  if (daysUntilJEE <= 100) {
    return `🎯 ${daysUntilJEE} days to JEE! Your dedication today shapes your tomorrow!`
  }
  
  if (currentStreak === 0) {
    return "🌟 Every expert was once a beginner. Start your journey today!"
  }
  
  return "📚 Remember: Small daily improvements lead to massive results!"
}

export const getSubjectMotivation = (subject: string): string => {
  const motivations = {
    Physics: "🔬 Physics is the universe's language. Master it, master the world!",
    Chemistry: "⚗️ Chemistry is the art of transformation. Transform your future!",
    Mathematics: "📐 Mathematics is the foundation of all sciences. Build strong!"
  }
  
  return motivations[subject as keyof typeof motivations] || "📖 Knowledge is power. Keep learning!"
}