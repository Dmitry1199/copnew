import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Activity,
  Search,
  Plus,
  Clock,
  Users,
  Target,
  TrendingUp,
  Copy,
  Edit,
  MoreHorizontal,
  Star,
  Play,
  Pause,
  BarChart3
} from "lucide-react"

export default function ProgramsPage() {
  const programs = [
    {
      id: 1,
      name: "Силове тренування для початківців",
      description: "Базова програма для розвитку сили і м'язової маси",
      duration: "8 тижнів",
      difficulty: "Початківець",
      clients: 8,
      exercises: 12,
      status: "Активна",
      category: "Силове тренування",
      rating: 4.8,
      completionRate: 85,
      color: "bg-blue-500"
    },
    {
      id: 2,
      name: "Кардіо для схуднення",
      description: "Інтенсивна програма для зниження ваги та покращення витривалості",
      duration: "6 тижнів",
      difficulty: "Середній",
      clients: 12,
      exercises: 15,
      status: "Активна",
      category: "Кардіо",
      rating: 4.9,
      completionRate: 92,
      color: "bg-red-500"
    },
    {
      id: 3,
      name: "Функціональне тренування",
      description: "Комплексні вправи для покращення координації та рухливості",
      duration: "10 тижнів",
      difficulty: "Продвинутий",
      clients: 6,
      exercises: 18,
      status: "Активна",
      category: "Функціональне",
      rating: 4.7,
      completionRate: 78,
      color: "bg-green-500"
    },
    {
      id: 4,
      name: "Йога та розтяжка",
      description: "Програма для гнучкості та ментального здоров'я",
      duration: "12 тижнів",
      difficulty: "Початківець",
      clients: 15,
      exercises: 20,
      status: "Активна",
      category: "Йога",
      rating: 4.6,
      completionRate: 89,
      color: "bg-purple-500"
    },
    {
      id: 5,
      name: "HIIT тренування",
      description: "Високоінтенсивні інтервальні тренування",
      duration: "4 тижні",
      difficulty: "Продвинутий",
      clients: 4,
      exercises: 10,
      status: "Чернетка",
      category: "HIIT",
      rating: 4.5,
      completionRate: 0,
      color: "bg-orange-500"
    }
  ]

  const categories = [
    { name: "Всі програми", count: 12, active: true },
    { name: "Силове", count: 4, active: false },
    { name: "Кардіо", count: 3, active: false },
    { name: "Йога", count: 2, active: false },
    { name: "Функціональне", count: 2, active: false },
    { name: "HIIT", count: 1, active: false }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Тренувальні програми
            </h1>
            <p className="text-slate-600">
              Створення та управління програмами тренувань
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Імпорт
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Нова програма
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Всього програм</p>
                  <p className="text-2xl font-bold text-slate-900">12</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Активних програм</p>
                  <p className="text-2xl font-bold text-green-600">9</p>
                </div>
                <Play className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Клієнтів на програмах</p>
                  <p className="text-2xl font-bold text-purple-600">45</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Середня оцінка</p>
                  <p className="text-2xl font-bold text-yellow-600">4.7</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600 fill-current" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Категорії</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    category.active ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100'
                  }`}
                >
                  <span className="text-sm font-medium">{category.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Programs List */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Пошук програм..."
                className="pl-10 bg-white/50 backdrop-blur-sm"
              />
            </div>

            {/* Programs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {programs.map((program) => (
                <Card key={program.id} className="bg-white/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${program.color}`}></div>
                        <div>
                          <CardTitle className="text-lg">{program.name}</CardTitle>
                          <Badge
                            variant={program.status === 'Активна' ? 'default' : 'secondary'}
                            className={
                              program.status === 'Активна'
                                ? 'bg-green-100 text-green-700 hover:bg-green-100 mt-1'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-100 mt-1'
                            }
                          >
                            {program.status}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600">
                      {program.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span>{program.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-slate-400" />
                        <span>{program.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span>{program.clients} клієнтів</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-slate-400" />
                        <span>{program.exercises} вправ</span>
                      </div>
                    </div>

                    {/* Progress and Rating */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Завершення</span>
                        <span className="font-medium">{program.completionRate}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${program.completionRate}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{program.rating}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Редагувати
                          </Button>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Статистика
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
