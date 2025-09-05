import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://trainer-pro-demo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key-for-trainer-pro'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

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

  async getCurrentUser() {
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
// CRUD HELPERS
// ------------------------
const getTrainerId = () => {
  const user = supabase.auth.getUser()
  if (!user) throw new DatabaseError('Неавторизований користувач')
  return user
}

const crudFactory = <T extends { id: any }>(table: keyof Database['public']['Tables']) => ({
  async getAll() {
    const { data, error } = await supabase.from<T>(table).select('*')
    if (error) handleSupabaseError(error)
    return data || []
  },

  async getById(id: string) {
    const { data, error } = await supabase.from<T>(table).select('*').eq('id', id).single()
    if (error) handleSupabaseError(error)
    return data
  },

  async insert(row: InsertRow<T>) {
    const { data, error } = await supabase.from<T>(table).insert([row]).select().single()
    if (error) handleSupabaseError(error)
    return data
  },

  async update(row: UpdateRow<T>) {
    const { id, ...rest } = row
    const { data, error } = await supabase.from<T>(table).update(rest).eq('id', id).select().single()
    if (error) handleSupabaseError(error)
    return data
  },

  async delete(id: string) {
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
export const subscribeToTrainerData = (callback: (payload: any) => void) => {
  const trainer = supabase.auth.getUser()
  if (!trainer) throw new DatabaseError('Неавторизований користувач')
  const trainerId = trainer.user.id

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
