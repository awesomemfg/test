// Lightweight browser-safe mock of Supabase client for the "wishes" table.
// It provides the minimal API used by App.jsx: from('wishes').select().order() and insert().select().
// Data persists in localStorage at runtime (client only). During build (SSR), no storage is touched.

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
const STORAGE_KEY = 'wishes'

function loadWishes() {
  if (!isBrowser) return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveWishes(list) {
  if (!isBrowser) return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // ignore write errors
  }
}

function orderByCreatedAt(data, ascending = false) {
  const arr = Array.isArray(data) ? [...data] : []
  arr.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  return ascending ? arr : arr.reverse()
}

const supabase = {
  from(table) {
    // Only the 'wishes' table is supported in this mock
    if (table !== 'wishes') {
      return {
        select() {
          return {
            order() {
              return Promise.resolve({ data: [], error: null })
            },
          }
        },
        insert() {
          return {
            select() {
              return Promise.resolve({ data: [], error: new Error('Unsupported table in mock') })
            },
          }
        },
      }
    }

    return {
      select() {
        const data = loadWishes()
        return {
          order(column, options = {}) {
            if (column === 'created_at') {
              const sorted = orderByCreatedAt(data, options.ascending)
              return Promise.resolve({ data: sorted, error: null })
            }
            return Promise.resolve({ data, error: null })
          },
        }
      },

      insert(rows) {
        const now = new Date().toISOString()
        const items = (rows || []).map((r, i) => ({
          id: Date.now() + i,
          name: r?.name ?? 'Anonymous',
          message: r?.message ?? '',
          created_at: now,
        }))
        const current = loadWishes()
        const next = current.concat(items)
        saveWishes(next)
        return {
          select() {
            return Promise.resolve({ data: items, error: null })
          },
        }
      },
    }
  },
}

export { supabase }
