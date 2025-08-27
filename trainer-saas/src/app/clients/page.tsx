"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"
import { ClientsAPI } from "@/lib/api/clients"
import { type Client } from "@/lib/supabase"
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  X,
  Loader2
} from "lucide-react"

// Компонент для додавання нового клієнта
function AddClientModal({
  isOpen,
  onClose,
  onClientAdded
}: {
  isOpen: boolean
  onClose: () => void
  onClientAdded: (client: Client) => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<{
    first_name: string
    last_name: string
    email: string
    phone: string
    experience_level: 'beginner' | 'intermediate' | 'advanced'
    fitness_goals: string
    notes: string
  }>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    experience_level: 'beginner',
    fitness_goals: '',
    notes: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { user } = useAuth()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.first_name.trim()) {
      newErrors.first_name = "Ім'я є обов'язковим"
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Прізвище є обов'язковим"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email є обов'язковим"
    } else if (!ClientsAPI.validateEmail(formData.email)) {
      newErrors.email = "Невірний формат email"
    }

    if (formData.phone && !ClientsAPI.validatePhone(formData.phone)) {
      newErrors.phone = "Невірний формат телефону (приклад: +380 67 123 4567)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !user) return

    setIsLoading(true)

    try {
      const clientData = {
        ...formData,
        trainer_id: user.id,
        phone: formData.phone ? ClientsAPI.formatPhone(formData.phone) : undefined
      }

      const newClient = await ClientsAPI.createClient(clientData)
      onClientAdded(newClient)
      onClose()

      // Очистити форму
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        experience_level: 'beginner',
        fitness_goals: '',
        notes: ''
      })
      setErrors({})
    } catch (error) {
      console.error('Error creating client:', error)
      setErrors({ general: 'Виникла помилка при створенні клієнта' })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                  Додати нового клієнта
                </CardTitle>
                <CardDescription>
                  Заповніть інформацію про нового клієнта
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  {errors.general}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Ім'я *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                    placeholder="Марина"
                    className={errors.first_name ? 'border-red-500' : ''}
                  />
                  {errors.first_name && (
                    <p className="text-xs text-red-600">{errors.first_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Прізвище *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                    placeholder="Коваленко"
                    className={errors.last_name ? 'border-red-500' : ''}
                  />
                  {errors.last_name && (
                    <p className="text-xs text-red-600">{errors.last_name}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="marina.kovalenko@email.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+380 67 123 4567"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience_level">Рівень підготовки</Label>
                  <select
                    id="experience_level"
                    value={formData.experience_level}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      experience_level: e.target.value as 'beginner' | 'intermediate' | 'advanced'
                    }))}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="beginner">Початківець</option>
                    <option value="intermediate">Середній</option>
                    <option value="advanced">Продвинутий</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fitness_goals">Фітнес цілі</Label>
                <textarea
                  id="fitness_goals"
                  value={formData.fitness_goals}
                  onChange={(e) => setFormData(prev => ({ ...prev, fitness_goals: e.target.value }))}
                  placeholder="Схуднення, набор м'язової маси, покращення витривалості..."
                  rows={3}
                  className="w-full p-3 border rounded-lg resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Примітки</Label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Додаткова інформація про клієнта..."
                  rows={2}
                  className="w-full p-3 border rounded-lg resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Створення...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Додати клієнта
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Скасувати
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, newThisMonth: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { user } = useAuth()

  // Завантажити клієнтів
  const loadClients = useCallback(async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const [clientsData, statsData] = await Promise.all([
        ClientsAPI.getClients(user.id),
        ClientsAPI.getClientsStats(user.id)
      ])

      setClients(clientsData)
      setFilteredClients(clientsData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading clients:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadClients()
  }, [loadClients])

  // Фільтрування клієнтів
  useEffect(() => {
    let filtered = clients

    // Фільтр за статусом
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter)
    }

    // Пошук
    if (searchQuery) {
      filtered = filtered.filter(client =>
        ClientsAPI.getFullName(client).toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.phone && client.phone.includes(searchQuery))
      )
    }

    setFilteredClients(filtered)
  }, [clients, searchQuery, statusFilter])

  const handleClientAdded = (newClient: Client) => {
    setClients(prev => [newClient, ...prev])
    loadClients() // Оновити статистику
  }

  const handleArchiveClient = async (clientId: string) => {
    if (confirm('Ви впевнені, що хочете архівувати цього клієнта?')) {
      try {
        await ClientsAPI.archiveClient(clientId)
        loadClients()
      } catch (error) {
        console.error('Error archiving client:', error)
        alert('Виникла помилка при архівуванні клієнта')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Завантаження клієнтів...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Клієнти
            </h1>
            <p className="text-slate-600">
              Управління вашими клієнтами
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Додати клієнта
          </Button>
        </div>
      </header>

      <div className="p-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Пошук клієнтів..."
              className="pl-10 bg-white/50 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-3 py-2 border rounded-lg bg-white/50 backdrop-blur-sm"
          >
            <option value="all">Всі клієнти</option>
            <option value="active">Активні</option>
            <option value="inactive">Неактивні</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Всього клієнтів</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Активних</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-green-600"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Нових цього місяця</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.newThisMonth}</p>
                </div>
                <Plus className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Неактивних</p>
                  <p className="text-2xl font-bold text-slate-600">{stats.inactive}</p>
                </div>
                <Calendar className="h-8 w-8 text-slate-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clients List */}
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Список клієнтів ({filteredClients.length})</CardTitle>
            <CardDescription>
              {searchQuery
                ? `Результати пошуку для "${searchQuery}"`
                : statusFilter !== 'all'
                  ? `Клієнти зі статусом "${statusFilter === 'active' ? 'активні' : 'неактивні'}"`
                  : 'Всі ваші клієнти'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {filteredClients.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  {searchQuery ? 'Клієнтів не знайдено' : 'Поки що немає клієнтів'}
                </h3>
                <p className="text-slate-500 mb-4">
                  {searchQuery
                    ? 'Спробуйте змінити пошуковий запит'
                    : 'Додайте вашого першого клієнта, щоб почати роботу'
                  }
                </p>
                {!searchQuery && (
                  <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Додати клієнта
                  </Button>
                )}
              </div>
            ) : (
              <div className="divide-y">
                {filteredClients.map((client) => (
                  <div key={client.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={client.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback className="text-sm font-medium bg-blue-100 text-blue-700">
                            {ClientsAPI.getInitials(client)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-slate-900">
                              {ClientsAPI.getFullName(client)}
                            </h3>
                            <Badge
                              variant={client.status === 'active' ? 'default' : 'secondary'}
                              className={
                                client.status === 'active'
                                  ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-100'
                              }
                            >
                              {client.status === 'active' ? 'Активний' : 'Неактивний'}
                            </Badge>
                            <Badge variant="outline">
                              {client.experience_level === 'beginner' ? 'Початківець' :
                               client.experience_level === 'intermediate' ? 'Середній' : 'Продвинутий'}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-slate-600">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {client.email}
                            </div>
                            {client.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {client.phone}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(client.created_at).toLocaleDateString('uk-UA')}
                            </div>
                          </div>

                          {client.fitness_goals && (
                            <div className="mt-2">
                              <p className="text-sm text-slate-500">
                                Цілі: <span className="font-medium text-slate-700">{client.fitness_goals}</span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleArchiveClient(client.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onClientAdded={handleClientAdded}
      />
    </div>
  )
}
