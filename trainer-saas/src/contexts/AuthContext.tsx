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

  const loadTrainerProfile = async (userId: string): Promise<Trainer | null> => {
    try {
      const { data, error } = await supabase
        .from('trainers')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data || null
    } catch (err) {
      console.error('Error loading trainer profile:', err)
      return null
    }
  }

  // Ініціалізація auth
  useEffect(() => {
    let mounted = true

    const initialize = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user && mounted) {
          const profile = await loadTrainerProfile(session.user.id)
          setUser({ ...session.user, trainer_profile: profile || undefined })
          setTrainer(profile)
        }
      } catch (err) {
        console.error('Error initializing auth:', err)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    initialize()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (!mounted) return
      if (session?.user) {
        const profile = await loadTrainerProfile(session.user.id)
        setUser({ ...session.user, trainer_profile: profile || undefined })
        setTrainer(profile)
      } else {
        setUser(null)
        setTrainer(null)
      }
      setIsLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      if (email === 'demo@trainerpro.com') {
        // Демо користувач
        const demoTrainer: Trainer = {
          id: '00000000-0000-0000-0000-000000000001',
          email: 'demo@trainerpro.com',
          first_name: 'Олексій',
          last_name: 'Тренер',
          phone: '+380671234567',
          bio: 'Сертифікований персональний тренер з 5-річним досвідом.',
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
        const demoUser: AuthUser = { id: demoTrainer.id, email: demoTrainer.email, trainer_profile: demoTrainer } as AuthUser
        setUser(demoUser)
        setTrainer(demoTrainer)
        return true
      } else {
        const authData = await authHelpers.signIn(email, password)
        if (authData) {
          const profile = await loadTrainerProfile(authData.id)
          setUser({ ...authData, trainer_profile: profile || undefined })
          setTrainer(profile)
          return true
        }
      }
      return false
    } catch (err) {
      console.error('Login error:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (firstName: string, lastName: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const authData = await authHelpers.signUp(email, password, { first_name: firstName, last_name: lastName })
      return !!authData
    } catch (err) {
      console.error('Signup error:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      if (user?.email === 'demo@trainerpro.com') {
        setUser(null)
        setTrainer(null)
        return
      }
      await authHelpers.signOut()
      setUser(null)
      setTrainer(null)
    } catch (err) {
      console.error('Logout error:', err)
      setUser(null)
      setTrainer(null)
    }
  }

  const updateTrainerProfile = async (updates: Partial<Trainer>) => {
    if (!user || !trainer) return null
    try {
      const { data, error } = await supabase.from('trainers').update(updates).eq('id', user.id).select('*').single()
      if (error || !data) throw error || new Error('Update failed')
      setTrainer(data)
      setUser({ ...user, trainer_profile: data })
      return data
    } catch (err) {
      console.error('Error updating trainer profile:', err)
      return null
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        trainer,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        updateTrainerProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
