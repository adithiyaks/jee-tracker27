import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          username: string
          target_year: number
          exam_type: 'JEE Main' | 'JEE Advanced' | 'Both'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username: string
          target_year: number
          exam_type: 'JEE Main' | 'JEE Advanced' | 'Both'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string
          target_year?: number
          exam_type?: 'JEE Main' | 'JEE Advanced' | 'Both'
          created_at?: string
          updated_at?: string
        }
      }
      study_days: {
        Row: {
          id: string
          user_id: string
          date: string
          status: 'productive' | 'partial' | 'unproductive'
          notes: string
          study_hours: number
          subjects_studied: string[]
          mock_test_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          status: 'productive' | 'partial' | 'unproductive'
          notes?: string
          study_hours?: number
          subjects_studied?: string[]
          mock_test_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          status?: 'productive' | 'partial' | 'unproductive'
          notes?: string
          study_hours?: number
          subjects_studied?: string[]
          mock_test_score?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      study_goals: {
        Row: {
          id: string
          user_id: string
          goal_type: string
          target_value: number
          current_value: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          goal_type: string
          target_value: number
          current_value?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          goal_type?: string
          target_value?: number
          current_value?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}