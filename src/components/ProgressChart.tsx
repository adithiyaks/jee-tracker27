import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { StudyStats } from '../types'

interface ProgressChartProps {
  stats: StudyStats
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ stats }) => {
  const subjectData = [
    { name: 'Physics', value: stats.subjectDistribution.Physics },
    { name: 'Chemistry', value: stats.subjectDistribution.Chemistry },
    { name: 'Mathematics', value: stats.subjectDistribution.Mathematics }
  ]

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658']

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Subject Distribution</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={subjectData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {subjectData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
        {subjectData.map((subject, index) => (
          <div key={subject.name} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: COLORS[index] }}
            ></div>
            <span className="text-gray-700">{subject.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}