// lib/supabase.ts
import { createClient, SupabaseClient, User } from '@supabase/supabase-js'
import { Database } from './database.types'

// ------------------------
// SUPABASE CLIENT
// ------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables'
  )
}

export const supabase: SupabaseClient<Database> = createClient<Database>(supabaseUrl, supabaseAnonKey)

// ------------------------
// UTILS
// ------------------------
export class DatabaseError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export const handleSupabaseError = (error: { message?: string; code?: string }): never => {
  console.error('Supabase Error:', error)
  throw new DatabaseError(error.message || 'Помилка бази даних', error.code)
}

// ------------------------
// TYPES
// ------------------------
export type Trainer = Database['public']['Tables']['trainers']['Row']
export type Client = Database['public']['Tables']['clients']['Row']
export type TrainingProgram = Database['public']['Tables']['training_programs']['Row']
export type Session = Database['public']['Tables']['sessions']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']

export type InsertRow<T extends { id?: any }> = Omit<T, 'id' | 'created_at' | 'updated_at'>
export type UpdateRow<T extends { id: any }> = Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>> & { id: T['id'] }

// ------------------------
// AUTH HELPERS
// ------------------------
export const authHelpers = {
  async signUp(email: string, password: string, metadata?: Record<string, unknown>) {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: metadata } })
    if (error) handleSupabaseError(error)
    return data.user
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) handleSupabaseError(error)
    return data.user
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) handleSupabaseError(error)
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) handleSupabaseError(error)
    return user
  },

  async updateUserMetadata(metadata: Record<string, unknown>) {
    const { data, error } = await supabase.auth.updateUser({ data: metadata })
    if (error) handleSupabaseError(error)
    return data.user
  }
}

// ------------------------
// CRUD FACTORY
// ------------------------
const crudFactory = <T extends { id: any }>(table: keyof Database['public']['Tables']) => ({
  async getAll(): Promise<T[]> {
    const { data, error } = await supabase.from<T>(table).select('*')
    if (error) handleSupabaseError(error)
    return data || []
  },

  async getById(id: string): Promise<T | null> {
    const { data, error } = await supabase.from<T>(table).select('*').eq('id', id).single()
    if (error) handleSupabaseError(error)
    return data
  },

  async insert(row: InsertRow<T>): Promise<T> {
    const { data, error } = await supabase.from<T>(table).insert([row]).select().single()
    if (error) handleSupabaseError(error)
    return data
  },

  async update(row: UpdateRow<T>): Promise<T> {
    const { id, ...rest } = row
    const { data, error } = await supabase.from<T>(table).update(rest).eq('id', id).select().single()
    if (error) handleSupabaseError(error)
    return data
  },

  async delete(id: string): Promise<T> {
    const { data, error } = await supabase.from<T>(table).delete().eq('id', id).select().single()
    if (error) handleSupabaseError(error)
    return data
  }
})

// ------------------------
// TABLES CRUD
// ------------------------
export const Trainers = crudFactory<Trainer>('trainers')
export const Clients = crudFactory<Client>('clients')
export const TrainingPrograms = crudFactory<TrainingProgram>('training_programs')
export const Sessions = crudFactory<Session>('sessions')
export const Payments = crudFactory<Payment>('payments')

// ------------------------
// REAL-TIME SUBSCRIPTIONS
// ------------------------
export const subscribeToTrainerData = async (callback: (payload: any) => void) => {
  const user = await authHelpers.getCurrentUser()
  if (!user) throw new DatabaseError('Неавторизований користувач')
  const trainerId = user.id

  return supabase.channel('trainer-data')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'clients', filter: `trainer_id=eq.${trainerId}` }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'sessions', filter: `trainer_id=eq.${trainerId}` }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'payments', filter: `trainer_id=eq.${trainerId}` }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'training_programs', filter: `trainer_id=eq.${trainerId}` }, callback)
    .subscribe()
}

export const unsubscribe = (subscription: any) => {
  if (subscription?.unsubscribe) subscription.unsubscribe()
}
