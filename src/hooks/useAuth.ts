import { useState, useEffect } from 'react'
import { auth, db, COLLECTIONS } from '../lib/firebase'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen for auth changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, username: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Create profile in Firestore
    await setDoc(doc(db, COLLECTIONS.PROFILES, user.uid), {
      id: user.uid,
      user_id: user.uid,
      username,
      target_year: new Date().getFullYear() + 1,
      exam_type: 'JEE Main',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    return userCredential
  }

  const signIn = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
  }

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  }
}