// lib/supabase.ts
import { createClient } from "@supabase/supabase-js"
import { Database } from "./database.types"

// 🔹 Fallback для демо-режиму
const DEMO_SUPABASE_URL = "https://trainer-pro-demo.supabase.co"
const DEMO_SUPABASE_ANON_KEY = "demo-key-for-trainer-pro"

// 🔹 Беремо змінні середовища або демо
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEMO_SUPABASE_URL
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEMO_SUPABASE_ANON_KEY

// 🔹 Перевіряємо валідність URL (щоб не зібралось з плейсхолдерами)
try {
  new URL(supabaseUrl)
} catch {
  throw new Error(`❌ Invalid NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}`)
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// ================== Типи ==================
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]

// Основні сутності
export type Trainer = Tables<"trainers">
export type Client = Tables<"clients">
export type TrainingProgram = Tables<"training_programs">
export type Session = Tables<"sessions">
export type Payment = Tables<"payments">

// ================== Обробка помилок ==================
export class DatabaseError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = "DatabaseError"
  }
}

export const handleSupabaseError = (error: { message?: string; code?: string }): never => {
  console.error("Supabase Error:", error)
  throw new DatabaseError(
    error.message || "Виникла помилка при роботі з базою даних",
    error.code
  )
}

// ================== Аутентифікація ==================
export const authHelpers = {
  async signUp(email: string, password: string, metadata?: Record<string, unknown>) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    })
    if (error) handleSupabaseError(error)
    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) handleSupabaseError(error)
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) handleSupabaseError(error)
  },

  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) handleSupabaseError(error)
    return user
  },

  async updateUserMetadata(metadata: Record<string, unknown>) {
    const { data, error } = await supabase.auth.updateUser({ data: metadata })
    if (error) handleSupabaseError(error)
    return data
  },
}

// ================== Реалтайм підписки ==================
export const subscriptions = {
  subscribeToUserData(userId: string, callback: (payload: unknown) => void) {
    return supabase
      .channel("user-data")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "clients", filter: `trainer_id=eq.${userId}` },
        callback
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sessions", filter: `trainer_id=eq.${userId}` },
        callback
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "payments", filter: `trainer_id=eq.${userId}` },
        callback
      )
      .subscribe()
  },

  unsubscribe(subscription: any) {
    if (subscription && typeof subscription.unsubscribe === "function") {
      subscription.unsubscribe()
    }
  },
}
