"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase, authHelpers, type Trainer } from '@/lib/supabase'

interface AuthUser extends SupabaseUser {
  trainer_profile?: Trainer
}

interface AuthContextType {
  user: AuthUser | null
  trainer: Trainer | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  updateTrainerProfile: (updates: Partial<Trainer>) => Promise<Trainer | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [trainer, setTrainer] = useState<Trainer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Завантажити профіль тренера
  const loadTrainerProfile = async (userId: string): Promise<Trainer | null> => {
    try {
      const { data, error } = await supabase
        .from('trainers')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error loading trainer profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error loading trainer profile:', error)
      return null
    }
  }

  // Ініціалізація: перевірити поточну сесію
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        // Отримати поточну сесію
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Error getting session:', error)
          setIsLoading(false)
          return
        }

        if (session?.user && mounted) {
          const trainerProfile = await loadTrainerProfile(session.user.id)
          const userWithProfile = {
            ...session.user,
            trainer_profile: trainerProfile || undefined
          }

          setUser(userWithProfile)
          setTrainer(trainerProfile)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    initializeAuth()

    // Слухати зміни аутентифікації
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        console.log('Auth state changed:', event, session?.user?.email)

        if (session?.user) {
          const trainerProfile = await loadTrainerProfile(session.user.id)
          const userWithProfile = {
            ...session.user,
            trainer_profile: trainerProfile || undefined
          }

          setUser(userWithProfile)
          setTrainer(trainerProfile)
        } else {
          setUser(null)
          setTrainer(null)
        }

        setIsLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Спочатку спробувати Supabase
      if (email !== 'demo@trainerpro.com') {
        const authData = await authHelpers.signIn(email, password)

        if (authData.user) {
          const trainerProfile = await loadTrainerProfile(authData.user.id)
          const userWithProfile = {
            ...authData.user,
            trainer_profile: trainerProfile || undefined
          }

          setUser(userWithProfile)
          setTrainer(trainerProfile)
          setIsLoading(false)
          return true
        }
      } else {
        // Демо логін - використати статичні дані
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Симуляція демо користувача
        const demoUser = {
          id: '00000000-0000-0000-0000-000000000001',
          email: 'demo@trainerpro.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          aud: 'authenticated',
          role: 'authenticated',
          app_metadata: {},
          user_metadata: {},
          identities: [],
          factors: []
        } as AuthUser

        const demoTrainer: Trainer = {
          id: '00000000-0000-0000-0000-000000000001',
          email: 'demo@trainerpro.com',
          first_name: 'Олексій',
          last_name: 'Тренер',
          phone: '+380 67 123 4567',
          bio: 'Сертифікований персональний тренер з 5-річним досвідом. Спеціалізуюся на силових тренуваннях та функціональному фітнесі.',
          business_name: 'FitLife Studio',
          business_address: 'вул. Хрещатик, 1, Київ, 01001',
          business_website: 'https://fitlife.ua',
          business_instagram: '@fitlife_studio',
          work_hours: 'Пн-Пт: 07:00-22:00',
          default_currency: 'UAH',
          timezone: 'Europe/Kiev',
          language: 'uk',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        demoUser.trainer_profile = demoTrainer
        setUser(demoUser)
        setTrainer(demoTrainer)
        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
      return false
    }
  }

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true)

    try {
      const authData = await authHelpers.signUp(email, password, {
        first_name: firstName,
        last_name: lastName
      })

      if (authData.user) {
        // Профіль тренера буде створено автоматично через тригер в базі
        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error('Signup error:', error)
      setIsLoading(false)
      return false
    }
  }

  const logout = async () => {
    try {
      if (user?.email === 'demo@trainerpro.com') {
        // Демо вихід
        setUser(null)
        setTrainer(null)
        return
      }

      await authHelpers.signOut()
      setUser(null)
      setTrainer(null)
    } catch (error) {
      console.error('Logout error:', error)
      // Навіть якщо виникла помилка, очистити локальний стан
      setUser(null)
      setTrainer(null)
    }
  }

  const updateTrainerProfile = async (updates: Partial<Trainer>): Promise<Trainer | null> => {
    if (!user || !trainer) return null

    try {
      const { data, error } = await supabase
        .from('trainers')
        // @ts-ignore - временное решение для типов Supabase
        .update(updates)
        .eq('id', user.id)
        .select('*')
        .single()

      if (error) {
        console.error('Error updating trainer profile:', error)
        return null
      }

      if (!data) return null

      setTrainer(data)

      // Оновити користувача з новим профілем
      const updatedUser = {
        ...user,
        trainer_profile: data
      }
      setUser(updatedUser)

      return data
    } catch (error) {
      console.error('Error updating trainer profile:', error)
      return null
    }
  }

  const value = {
    user,
    trainer,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    updateTrainerProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
