import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PaymentUpdatesWidget } from "@/components/PaymentUpdatesWidget"
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  Target,
  Activity,
  Bell
} from "lucide-react"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Dashboard
            </h1>
            <p className="text-slate-600">
              Огляд вашої діяльності
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Сповіщення
            </Button>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Новий запис
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Вітаємо, Олексій! 👋
          </h2>
          <p className="text-slate-600">
            Ось огляд вашої діяльності сьогодні
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/50 backdrop-blur-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Всього клієнтів
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">24</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +3 цього місяця
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Тренувань сьогодні
              </CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">8</div>
              <p className="text-xs text-slate-500">
                З 10 запланованих
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Дохід цього місяця
              </CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">₴18,500</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15% від минулого місяця
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Активні програми
              </CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">12</div>
              <p className="text-xs text-slate-500">
                Тренувальних програм
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Today's Schedule */}
          <Card className="lg:col-span-2 bg-white/50 backdrop-blur-sm border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Розклад на сьогодні
              </CardTitle>
              <CardDescription>
                Ваші заплановані тренування
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { time: "09:00", client: "Марина Коваленко", type: "Силове тренування", status: "completed" },
                { time: "10:30", client: "Андрій Петров", type: "Кардіо", status: "completed" },
                { time: "12:00", client: "Олена Сидоренко", type: "Функціональне тренування", status: "current" },
                { time: "14:00", client: "Дмитро Іваненко", type: "Персональне тренування", status: "upcoming" },
                { time: "16:00", client: "Анна Волошко", type: "Йога", status: "upcoming" },
              ].map((session, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white border">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-slate-900 w-16">
                      {session.time}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {session.client.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm text-slate-900">
                        {session.client}
                      </div>
                      <div className="text-xs text-slate-500">
                        {session.type}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      session.status === 'completed' ? 'default' :
                      session.status === 'current' ? 'destructive' :
                      'secondary'
                    }
                    className={
                      session.status === 'completed' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                      session.status === 'current' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
                      'bg-slate-100 text-slate-700 hover:bg-slate-100'
                    }
                  >
                    {session.status === 'completed' ? 'Виконано' :
                     session.status === 'current' ? 'Зараз' :
                     'Заплановано'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Payment Updates Widget */}
          <PaymentUpdatesWidget />

          {/* Quick Actions */}
          <Card className="bg-white/50 backdrop-blur-sm border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Швидкі дії
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Додати клієнта
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Створити тренування
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Activity className="h-4 w-4 mr-2" />
                Нова програма
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <DollarSign className="h-4 w-4 mr-2" />
                Записати оплату
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-6 bg-white/50 backdrop-blur-sm border-slate-200">
          <CardHeader>
            <CardTitle>Недавна активність</CardTitle>
            <CardDescription>
              Останні дії в системі
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                "Марина Коваленко завершила тренування 'Силове тренування'",
                "Додано нового клієнта: Петро Мельник",
                "Оплата отримана від Андрія Петрова - ₴800",
                "Створено нову програму 'Схуднення за 30 днів'",
                "Заплановано тренування з Оленою Сидоренко на завтра"
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-slate-600">{activity}</span>
                  <span className="text-xs text-slate-400 ml-auto">
                    {Math.floor(Math.random() * 60) + 1} хв тому
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
