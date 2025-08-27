import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// Конфігурація Supabase (в production використовуйте змінні середовища)
const supabaseUrl = 'https://your-project.supabase.co' // Замініть на ваш URL
const supabaseAnonKey = 'your-anon-key' // Замініть на ваш ключ

// Для демо використовуємо публічний тестовий проект
const DEMO_SUPABASE_URL = 'https://trainer-pro-demo.supabase.co'
const DEMO_SUPABASE_ANON_KEY = 'demo-key-for-trainer-pro'

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || DEMO_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEMO_SUPABASE_ANON_KEY
)

// Типи для TypeScript
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

// Основні типи сутностей
export type Trainer = Tables<'trainers'>
export type Client = Tables<'clients'>
export type TrainingProgram = Tables<'training_programs'>
export type Session = Tables<'sessions'>
export type Payment = Tables<'payments'>

// Утилітарні функції для роботи з Supabase
export class DatabaseError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export const handleSupabaseError = (error: { message?: string; code?: string }): never => {
  console.error('Supabase Error:', error)
  throw new DatabaseError(
    error.message || 'Виникла помилка при роботі з базою даних',
    error.code
  )
}

// Функції для аутентифікації
export const authHelpers = {
  async signUp(email: string, password: string, metadata?: Record<string, unknown>) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })

    if (error) handleSupabaseError(error)
    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) handleSupabaseError(error)
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) handleSupabaseError(error)
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) handleSupabaseError(error)
    return user
  },

  async updateUserMetadata(metadata: Record<string, unknown>) {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata
    })

    if (error) handleSupabaseError(error)
    return data
  }
}

// Real-time підписки
export const subscriptions = {
  subscribeToUserData(userId: string, callback: (payload: unknown) => void) {
    return supabase
      .channel('user-data')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'clients',
        filter: `trainer_id=eq.${userId}`
      }, callback)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'sessions',
        filter: `trainer_id=eq.${userId}`
      }, callback)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'payments',
        filter: `trainer_id=eq.${userId}`
      }, callback)
      .subscribe()
  },

  unsubscribe(subscription: any) {
    if (subscription && typeof subscription.unsubscribe === 'function') {
      subscription.unsubscribe()
    }
  }
}
