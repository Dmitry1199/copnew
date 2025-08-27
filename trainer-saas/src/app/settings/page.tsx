"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Smartphone,
  Mail,
  Calendar,
  MapPin,
  Camera,
  Save,
  Settings as SettingsIcon,
  Globe,
  Moon,
  Sun,
  Palette,
  Zap,
  Key,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Eye,
  EyeOff
} from "lucide-react"
import { useState } from "react"

export default function SettingsPage() {
  const [showLiqPayKeys, setShowLiqPayKeys] = useState(false)
  const [liqPayPublicKey, setLiqPayPublicKey] = useState("sandbox_i12345678901")
  const [liqPayPrivateKey, setLiqPayPrivateKey] = useState("sandbox_12345678901234567890123456789012")

  const settingsSections = [
    {
      id: 'profile',
      title: 'Профіль',
      icon: User,
      description: 'Управління особистою інформацією'
    },
    {
      id: 'liqpay',
      title: 'LiqPay',
      icon: Zap,
      description: 'Налаштування платіжної системи'
    },
    {
      id: 'notifications',
      title: 'Сповіщення',
      icon: Bell,
      description: 'Налаштування повідомлень'
    },
    {
      id: 'security',
      title: 'Безпека',
      icon: Shield,
      description: 'Пароль та безпека аккаунта'
    },
    {
      id: 'billing',
      title: 'Оплата',
      icon: CreditCard,
      description: 'Підписка та платіжна інформація'
    },
    {
      id: 'preferences',
      title: 'Налаштування',
      icon: SettingsIcon,
      description: 'Персоналізація додатка'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Налаштування
            </h1>
            <p className="text-slate-600">
              Управління профілем та налаштуваннями додатка
            </p>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Розділи</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {settingsSections.map((section) => (
                <div
                  key={section.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <section.icon className="h-5 w-5 text-slate-600" />
                  <div>
                    <div className="font-medium text-slate-900">{section.title}</div>
                    <div className="text-xs text-slate-500">{section.description}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Main Settings Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Settings */}
            <Card className="bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Профіль тренера
                </CardTitle>
                <CardDescription>
                  Інформація, яку бачать ваші клієнти
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-lg">ОТ</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline">
                      <Camera className="h-4 w-4 mr-2" />
                      Змінити фото
                    </Button>
                    <p className="text-xs text-slate-500 mt-2">
                      JPG, PNG до 2MB
                    </p>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Ім'я</Label>
                    <Input id="firstName" defaultValue="Олексій" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Прізвище</Label>
                    <Input id="lastName" defaultValue="Тренер" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="trainer@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input id="phone" defaultValue="+380 67 123 4567" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Про себе</Label>
                  <textarea
                    id="bio"
                    className="w-full p-3 border rounded-lg resize-none"
                    rows={4}
                    defaultValue="Сертифікований персональний тренер з 5-річним досвідом. Спеціалізуюся на силових тренуваннях та функціональному фітнесі."
                  />
                </div>

                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Зберегти профіль
                </Button>
              </CardContent>
            </Card>

            {/* LiqPay Settings */}
            <Card className="bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Налаштування LiqPay
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Активно
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Підключення платіжної системи для прийому оплат від клієнтів
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* LiqPay Status */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="h-6 w-6 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-blue-900">LiqPay інтеграція підключена</h4>
                      <p className="text-sm text-blue-700">
                        Ваші клієнти можуть оплачувати послуги через картки, Apple Pay, Google Pay
                      </p>
                    </div>
                  </div>
                </div>

                {/* API Keys */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="liqpayPublic" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Публічний ключ (Public Key)
                    </Label>
                    <div className="relative">
                      <Input
                        id="liqpayPublic"
                        type={showLiqPayKeys ? "text" : "password"}
                        value={liqPayPublicKey}
                        onChange={(e) => setLiqPayPublicKey(e.target.value)}
                        placeholder="sandbox_i12345678901"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLiqPayKeys(!showLiqPayKeys)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showLiqPayKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="liqpayPrivate" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Приватний ключ (Private Key)
                    </Label>
                    <div className="relative">
                      <Input
                        id="liqpayPrivate"
                        type={showLiqPayKeys ? "text" : "password"}
                        value={liqPayPrivateKey}
                        onChange={(e) => setLiqPayPrivateKey(e.target.value)}
                        placeholder="sandbox_12345678901234567890123456789012"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLiqPayKeys(!showLiqPayKeys)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showLiqPayKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Warning for demo keys */}
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Демо режим</h4>
                      <p className="text-sm text-yellow-700">
                        Зараз використовуються тестові ключі. Для прийому реальних платежів
                        замініть їх на ключі з вашого аккаунта LiqPay.
                      </p>
                    </div>
                  </div>
                </div>

                {/* LiqPay Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Валюта за замовчуванням</Label>
                    <select className="w-full p-2 border rounded-lg">
                      <option value="UAH">Гривня (UAH)</option>
                      <option value="USD">Долар (USD)</option>
                      <option value="EUR">Євро (EUR)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Мова платіжної форми</Label>
                    <select className="w-full p-2 border rounded-lg">
                      <option value="uk">Українська</option>
                      <option value="ru">Російська</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>

                {/* Links */}
                <div className="flex gap-4">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Зберегти ключі
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="https://www.liqpay.ua" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Кабінет LiqPay
                    </a>
                  </Button>
                </div>

                {/* Test Payment */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-2">Тестування платежів</h4>
                  <p className="text-sm text-slate-600 mb-3">
                    Використовуйте тестові картки для перевірки інтеграції:
                  </p>
                  <div className="space-y-1 text-sm text-slate-600">
                    <div>• <span className="font-mono">4149 4399 4999 4999</span> - Тестова Visa</div>
                    <div>• <span className="font-mono">5168 7555 5555 5556</span> - Тестова Mastercard</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-yellow-600" />
                  Сповіщення
                </CardTitle>
                <CardDescription>
                  Управління повідомленнями та нагадуваннями
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Email повідомлення', description: 'Отримувати сповіщення на email', enabled: true },
                  { name: 'SMS нагадування', description: 'SMS за 1 годину до тренування', enabled: true },
                  { name: 'Push сповіщення', description: 'Сповіщення в браузері', enabled: false },
                  { name: 'Нові клієнти', description: 'Повідомлення про нових клієнтів', enabled: true },
                  { name: 'Оплати LiqPay', description: 'Сповіщення про платежі через LiqPay', enabled: true }
                ].map((setting, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium text-slate-900">{setting.name}</div>
                      <div className="text-sm text-slate-500">{setting.description}</div>
                    </div>
                    <Button
                      variant={setting.enabled ? "default" : "outline"}
                      size="sm"
                    >
                      {setting.enabled ? "Увімкнено" : "Вимкнено"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* App Preferences */}
            <Card className="bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-purple-600" />
                  Налаштування додатка
                </CardTitle>
                <CardDescription>
                  Персоналізація інтерфейсу
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Тема</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Sun className="h-4 w-4 mr-2" />
                        Світла
                      </Button>
                      <Button variant="outline" size="sm">
                        <Moon className="h-4 w-4 mr-2" />
                        Темна
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Мова</Label>
                    <div className="flex gap-2">
                      <Button variant="default" size="sm">
                        <Globe className="h-4 w-4 mr-2" />
                        Українська
                      </Button>
                      <Button variant="outline" size="sm">
                        English
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Часовий пояс</Label>
                  <select className="w-full p-2 border rounded-lg">
                    <option>Київ (UTC+2)</option>
                    <option>Львів (UTC+2)</option>
                    <option>Одеса (UTC+2)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Валюта</Label>
                  <select className="w-full p-2 border rounded-lg">
                    <option>Гривня (₴)</option>
                    <option>Долар ($)</option>
                    <option>Євро (€)</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Business Settings */}
            <Card className="bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  Бізнес інформація
                </CardTitle>
                <CardDescription>
                  Дані про ваш фітнес-бізнес
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Назва студії/залу</Label>
                    <Input id="businessName" defaultValue="FitLife Studio" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Веб-сайт</Label>
                    <Input id="website" defaultValue="https://fitlife.ua" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Адреса</Label>
                  <Input id="address" defaultValue="вул. Хрещатик, 1, Київ, 01001" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workHours">Робочі години</Label>
                    <Input id="workHours" defaultValue="Пн-Пт: 07:00-22:00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input id="instagram" defaultValue="@fitlife_studio" />
                  </div>
                </div>

                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Зберегти налаштування
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
