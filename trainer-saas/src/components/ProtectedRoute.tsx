"use client"

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Якщо дані ще завантажуються, показуємо спіннер
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Завантаження...</p>
        </div>
      </div>
    )
  }

  // Якщо користувач не автентифікований, перенаправляємо на сторінку входу
  // Цей редирект має спрацювати, якщо користувач спробує зайти на захищену сторінку
  // без авторизації.
  if (!isAuthenticated) {
    router.push('/login')
    return null
  }

  // Якщо автентифікований, відображаємо вміст
  return <>{children}</>
}
