import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Demo data for when Supabase is not configured
export const isDemoMode = !import.meta.env.VITE_SUPABASE_URL

export const generateDemoData = () => {
  const now = new Date()
  const data = []
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    data.push({
      id: crypto.randomUUID(),
      timestamp: time.toISOString(),
      temperature: 22 + Math.random() * 8 + Math.sin(i / 4) * 3,
      humidity: 45 + Math.random() * 20 + Math.cos(i / 4) * 5,
      pressure: 1010 + Math.random() * 10 + Math.sin(i / 6) * 5,
      light: Math.max(0, 500 + Math.sin((i - 6) / 4) * 400 + Math.random() * 100),
      created_at: time.toISOString()
    })
  }
  
  return data
}

export const generateRealtimeData = () => ({
  id: crypto.randomUUID(),
  timestamp: new Date().toISOString(),
  temperature: 22 + Math.random() * 8,
  humidity: 45 + Math.random() * 20,
  pressure: 1010 + Math.random() * 10,
  light: 300 + Math.random() * 400,
  created_at: new Date().toISOString()
})
