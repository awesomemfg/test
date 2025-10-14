import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp, connectFirestoreEmulator } from 'firebase/firestore'

// Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBkxmSs7fGxkgLYza2GHzjpqJkoygtHVsI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "test-2b9ee.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "test-2b9ee",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "test-2b9ee.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "7375017909",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:7375017909:web:69aca166f1017014b42bfc"
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
              // Return empty array instead of failing completely
              return { data: [], error: null }
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
                console.log('Attempting to add document:', docData)
                const docRef = await addDoc(wishesRef, docData)
                console.log('Document added successfully with ID:', docRef.id)
                // Fetch the inserted doc to get the real timestamp
                const insertedSnap = await getDocs(query(wishesRef, orderBy('created_at', 'desc')))
                const insertedDoc = insertedSnap.docs.find(doc => doc.id === docRef.id)
                let insertedWish = { id: docRef.id, ...docData, created_at: new Date().toISOString() }
                if (insertedDoc) {
                  const d = insertedDoc.data()
                  insertedWish = {
                    id: docRef.id,
                    ...d,
                    created_at: d.created_at?.toDate?.() ? d.created_at.toDate().toISOString() : new Date().toISOString()
                  }
                }
                insertedData.push(insertedWish)
              }
              return { data: insertedData, error: null }
            } catch (error) {
              console.error('Firebase insert error:', error)
              console.error('Error details:', {
                code: error.code,
                message: error.message,
                details: error
              })
              
              // Return a more helpful error message
              let errorMessage = 'Failed to save wish. '
              if (error.code === 'permission-denied') {
                errorMessage += 'Please check if Firestore rules allow writing to the wishes collection.'
              } else if (error.code === 'unavailable') {
                errorMessage += 'Firebase service is temporarily unavailable. Please try again.'
              } else {
                errorMessage += error.message
              }
              
              return { data: [], error: errorMessage }
            }
          }
        }
      }
    }
  }
}
