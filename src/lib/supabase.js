import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore'

// Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Supabase-compatible API wrapper for Firebase
export const supabase = {
  from(tableName) {
    return {
      async select(fields = '*') {
        return {
          async order(column, options = {}) {
            try {
              const wishesRef = collection(db, tableName)
              const q = query(wishesRef, orderBy(column, options.ascending ? 'asc' : 'desc'))
              const querySnapshot = await getDocs(q)
              
              const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString()
              }))
              
              return { data, error: null }
            } catch (error) {
              console.error('Firebase select error:', error)
              return { data: [], error: error.message }
            }
          }
        }
      },

      insert(rows) {
        return {
          async select() {
            try {
              const wishesRef = collection(db, tableName)
              const insertedData = []
              
              for (const row of rows) {
                const docData = {
                  name: row.name || 'Anonymous',
                  message: row.message || '',
                  created_at: serverTimestamp()
                }
                
                const docRef = await addDoc(wishesRef, docData)
                insertedData.push({
                  id: docRef.id,
                  ...docData,
                  created_at: new Date().toISOString()
                })
              }
              
              return { data: insertedData, error: null }
            } catch (error) {
              console.error('Firebase insert error:', error)
              return { data: [], error: error.message }
            }
          }
        }
      }
    }
  }
}
