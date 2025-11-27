import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Validate required env variables early to avoid silent blank screen
const requiredEnv = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missing = requiredEnv.filter(k => !import.meta.env[k as keyof ImportMetaEnv]);
if (missing.length) {
  // eslint-disable-next-line no-console
  console.error('[Firebase Config] Missing environment variables:', missing);
}

// Ensure storageBucket uses the standard pattern <project-id>.appspot.com if user provided the new domain
const rawBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const normalizedBucket = rawBucket?.endsWith('.firebasestorage.app')
  ? rawBucket.replace('.firebasestorage.app', '.appspot.com')
  : rawBucket;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: normalizedBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // Optional measurement id if added later
  measurementId: (import.meta.env as any).VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase (guard in case of missing vars to avoid crash)
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (e) {
  // eslint-disable-next-line no-console
  console.error('[Firebase Init] Failed to initialize app:', e);
  throw e; // Surface error so user sees it in console rather than blank UI
}

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
