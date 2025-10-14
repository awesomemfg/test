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

export { db }

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
              
              const data = querySnapshot.docs.map(doc => {
                const d = doc.data();
                let createdAt = d.created_at;
                if (createdAt && typeof createdAt.toDate === 'function') {
                  createdAt = createdAt.toDate().toISOString();
                } else if (typeof createdAt === 'string') {
                  // Already ISO string
                } else {
                  createdAt = new Date().toISOString();
                }
                return {
                  id: doc.id,
                  ...d,
                  created_at: createdAt
                };
              });
              return { data, error: null };
            } catch (error) {
              console.error('Firebase select error:', error)
              // Return empty array and an error message so callers can handle it
              return { data: [], error: error.message || String(error) }
            }
          }
        }
      },

      insert(rows) {
        return {
          async select() {
            try {
              const wishesRef = collection(db, tableName)
              for (const row of rows) {
                const docData = {
                  name: row.name || 'Anonymous',
                  message: row.message || '',
                  created_at: serverTimestamp()
                }
                console.log('Attempting to add document:', docData)
                await addDoc(wishesRef, docData)
                console.log('Document added successfully')
              }
              // After insert, fetch all wishes again to get the correct data
              const q = query(wishesRef, orderBy('created_at', 'desc'))
              const querySnapshot = await getDocs(q)
              const data = querySnapshot.docs.map(doc => {
                const d = doc.data();
                let createdAt = d.created_at;
                if (createdAt && typeof createdAt.toDate === 'function') {
                  createdAt = createdAt.toDate().toISOString();
                } else if (typeof createdAt === 'string') {
                  // Already ISO string
                } else {
                  createdAt = new Date().toISOString();
                }
                return {
                  id: doc.id,
                  ...d,
                  created_at: createdAt
                };
              });
              return { data, error: null };
            } catch (error) {
              console.error('Firebase insert error:', error)
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
