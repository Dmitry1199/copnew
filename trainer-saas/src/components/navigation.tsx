"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"
import {
  LayoutDashboard,
  Users,
  Calendar,
  Activity,
  DollarSign,
  Settings,
  Dumbbell,
  Menu,
  X,
  LogOut
} from "lucide-react"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Клієнти", href: "/clients", icon: Users },
  { name: "Календар", href: "/calendar", icon: Calendar },
  { name: "Програми", href: "/programs", icon: Activity },
  { name: "Оплати", href: "/payments", icon: DollarSign },
  { name: "Налаштування", href: "/settings", icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, trainer, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    setMobileMenuOpen(false)
  }

  // Отримати ініціали тренера
  const getInitials = () => {
    if (trainer) {
      return `${trainer.first_name[0]}${trainer.last_name[0]}`
    }
    if (user?.email) {
      return user.email[0].toUpperCase()
    }
    return 'T'
  }

  // Отримати повне ім'я тренера
  const getFullName = () => {
    if (trainer) {
      return `${trainer.first_name} ${trainer.last_name}`
    }
    if (user?.email) {
      return user.email
    }
    return 'Тренер'
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-white/80 backdrop-blur-sm"
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white/95 backdrop-blur-sm border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 p-6 border-b">
            <Dumbbell className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">TrainerPro</h1>
            {trainer?.business_name && (
              <div className="ml-auto">
                <div className="text-xs text-slate-500 text-right">
                  {trainer.business_name}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={trainer?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {getFullName()}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.email}
                </p>
                {trainer?.phone && (
                  <p className="text-xs text-slate-400 truncate">
                    {trainer.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Additional trainer info */}
            {trainer && (
              <div className="mb-3 text-xs text-slate-500">
                {trainer.business_name && (
                  <div className="truncate">🏢 {trainer.business_name}</div>
                )}
                {trainer.work_hours && (
                  <div className="truncate">🕒 {trainer.work_hours}</div>
                )}
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Вийти
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
