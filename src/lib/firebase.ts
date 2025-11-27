import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Firestore collection names
export const COLLECTIONS = {
  PROFILES: 'profiles',
  STUDY_DAYS: 'study_days',
  STUDY_GOALS: 'study_goals'
} as const;

// Database types (matching Supabase schema)
export interface Profile {
  id: string;
  user_id: string;
  username: string;
  target_year: number;
  exam_type: 'JEE Main' | 'JEE Advanced' | 'Both';
  created_at: string;
  updated_at: string;
}

export interface StudyDay {
  id: string;
  user_id: string;
  date: string;
  status: 'productive' | 'partial' | 'unproductive';
  notes: string;
  study_hours: number;
  subjects_studied: string[];
  mock_test_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface StudyGoal {
  id: string;
  user_id: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  created_at: string;
  updated_at: string;
}
