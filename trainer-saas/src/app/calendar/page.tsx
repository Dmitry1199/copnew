"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  MapPin
} from "lucide-react"

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week')

  const todaysSessions = [
    {
      id: 1,
      time: "09:00",
      duration: "60 хв",
      client: "Марина Коваленко",
      type: "Силове тренування",
      status: "confirmed",
      location: "Зал 1",
      avatar: "МК"
    },
    {
      id: 2,
      time: "10:30",
      duration: "45 хв",
      client: "Андрій Петров",
      type: "Кардіо",
      status: "confirmed",
      location: "Зал 2",
      avatar: "АП"
    },
    {
      id: 3,
      time: "12:00",
      duration: "60 хв",
      client: "Олена Сидоренко",
      type: "Функціональне тренування",
      status: "pending",
      location: "Зал 1",
      avatar: "ОС"
    },
    {
      id: 4,
      time: "14:00",
      duration: "90 хв",
      client: "Дмитро Іваненко",
      type: "Персональне тренування",
      status: "confirmed",
      location: "Зал 3",
      avatar: "ДІ"
    },
    {
      id: 5,
      time: "16:00",
      duration: "60 хв",
      client: "Анна Волошко",
      type: "Йога",
      status: "confirmed",
      location: "Студія йоги",
      avatar: "АВ"
    }
  ]

  const weekDays = [
    { day: 'Пн', date: 19, sessions: 4 },
    { day: 'Вт', date: 20, sessions: 6 },
    { day: 'Ср', date: 21, sessions: 5 },
    { day: 'Чт', date: 22, sessions: 3 },
    { day: 'Пт', date: 23, sessions: 7 },
    { day: 'Сб', date: 24, sessions: 2 },
    { day: 'Нд', date: 25, sessions: 1 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Календар
            </h1>
            <p className="text-slate-600">
              Планування та розклад тренувань
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white/50 rounded-lg p-1">
              {(['day', 'week', 'month'] as const).map((view) => (
                <Button
                  key={view}
                  variant={currentView === view ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView(view)}
                  className={currentView === view ? 'bg-blue-600 text-white' : ''}
                >
                  {view === 'day' ? 'День' : view === 'week' ? 'Тиждень' : 'Місяць'}
                </Button>
              ))}
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Нове тренування
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar Widget */}
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
                Календар
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
              />

              {/* Quick Stats */}
              <div className="mt-6 space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Сьогодні</span>
                    <span className="font-semibold text-blue-900">5 тренувань</span>
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">Цей тиждень</span>
                    <span className="font-semibold text-green-900">28 тренувань</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-700">Вільних слотів</span>
                    <span className="font-semibold text-purple-900">12</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Calendar View */}
          <div className="lg:col-span-3 space-y-6">
            {/* Week View */}
            <Card className="bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Тиждень 19-25 серпня 2024</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border text-center ${
                        day.date === 21 ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="text-sm font-medium text-slate-900">
                        {day.day}
                      </div>
                      <div className={`text-lg font-bold ${
                        day.date === 21 ? 'text-blue-600' : 'text-slate-900'
                      }`}>
                        {day.date}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {day.sessions} сесій
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card className="bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-green-600" />
                      Розклад на сьогодні
                    </CardTitle>
                    <CardDescription>
                      Среда, 21 серпня 2024
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Фільтр
                    </Button>
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      Пошук
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {todaysSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-white border hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-slate-900">
                          {session.time}
                        </div>
                        <div className="text-xs text-slate-500">
                          {session.duration}
                        </div>
                      </div>

                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="text-sm">
                          {session.avatar}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="font-medium text-slate-900">
                          {session.client}
                        </div>
                        <div className="text-sm text-slate-600">
                          {session.type}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                          <MapPin className="h-3 w-3" />
                          {session.location}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        variant={session.status === 'confirmed' ? 'default' : 'secondary'}
                        className={
                          session.status === 'confirmed'
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                        }
                      >
                        {session.status === 'confirmed' ? 'Підтверджено' : 'Очікування'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Деталі
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
