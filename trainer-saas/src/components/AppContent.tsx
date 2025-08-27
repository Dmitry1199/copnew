"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Navigation } from "@/components/navigation"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { usePathname } from "next/navigation"

interface AppContentProps {
  children: React.ReactNode
}

export function AppContent({ children }: AppContentProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const pathname = usePathname()

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/forgot-password', '/terms', '/privacy']
  const isPublicRoute = publicRoutes.includes(pathname)

  // Show loading state
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

  // If it's a public route, render without protection
  if (isPublicRoute) {
    return <>{children}</>
  }

  // For protected routes, wrap with authentication
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Navigation />
        <main className="flex-1 lg:ml-64">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}
