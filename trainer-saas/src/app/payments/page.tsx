"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { PaymentInvoiceComponent, PaymentStatusBadge } from "@/components/PaymentInvoice"
import { WebhookTester } from "@/components/WebhookTester"
import {
  DollarSign,
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Zap,
  Globe,
  Smartphone
} from "lucide-react"

export default function PaymentsPage() {
  const clients = [
    {
      id: "1",
      name: "Марина Коваленко",
      email: "marina.kovalenko@email.com",
      phone: "+380 67 123 4567",
      avatar: "МК"
    },
    {
      id: "2",
      name: "Андрій Петров",
      email: "andrii.petrov@email.com",
      phone: "+380 95 234 5678",
      avatar: "АП"
    },
    {
      id: "3",
      name: "Олена Сидоренко",
      email: "olena.sydorenko@email.com",
      phone: "+380 50 345 6789",
      avatar: "ОС"
    },
    {
      id: "4",
      name: "Дмитро Іваненко",
      email: "dmytro.ivanenko@email.com",
      phone: "+380 63 456 7890",
      avatar: "ДІ"
    },
    {
      id: "5",
      name: "Анна Волошко",
      email: "anna.voloshko@email.com",
      phone: "+380 99 567 8901",
      avatar: "АВ"
    }
  ]

  const payments = [
    {
      id: 1,
      client: "Марина Коваленко",
      amount: 800,
      service: "Персональне тренування",
      date: "2024-08-21",
      status: "paid" as const,
      method: "LiqPay (Visa)",
      avatar: "МК",
      dueDate: null,
      liqpayOrderId: "TP_1724234567890_abc123"
    },
    {
      id: 2,
      client: "Андрій Петров",
      amount: 1200,
      service: "Місячний абонемент",
      date: "2024-08-20",
      status: "paid" as const,
      method: "LiqPay (Mastercard)",
      avatar: "АП",
      dueDate: null,
      liqpayOrderId: "TP_1724148167890_def456"
    },
    {
      id: 3,
      client: "Олена Сидоренко",
      amount: 600,
      service: "Групове тренування",
      date: "2024-08-19",
      status: "pending" as const,
      method: "LiqPay",
      avatar: "ОС",
      dueDate: "2024-08-25",
      liqpayOrderId: "TP_1724061767890_ghi789"
    },
    {
      id: 4,
      client: "Дмитро Іваненко",
      amount: 1500,
      service: "Тренувальна програма",
      date: "2024-08-18",
      status: "failed" as const,
      method: "LiqPay",
      avatar: "ДІ",
      dueDate: "2024-08-15",
      liqpayOrderId: "TP_1723975367890_jkl012"
    },
    {
      id: 5,
      client: "Анна Волошко",
      amount: 900,
      service: "Консультація + план харчування",
      date: "2024-08-17",
      status: "paid" as const,
      method: "LiqPay (Apple Pay)",
      avatar: "АВ",
      dueDate: null,
      liqpayOrderId: "TP_1723888967890_mno345"
    }
  ]

  const monthlyStats = [
    { month: "Січ", income: 18500, expenses: 5200 },
    { month: "Лют", income: 22400, expenses: 4800 },
    { month: "Бер", income: 19800, expenses: 5500 },
    { month: "Кві", income: 24200, expenses: 6100 },
    { month: "Тра", income: 21600, expenses: 5800 },
    { month: "Чер", income: 26800, expenses: 6400 },
    { month: "Лип", income: 23400, expenses: 5900 },
    { month: "Сер", income: 25200, expenses: 6200 }
  ]

  const handleInvoiceCreated = (invoice: unknown) => {
    console.log('New invoice created:', invoice)
    // В реальному додатку тут би було збереження в базу даних
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Оплати
            </h1>
            <p className="text-slate-600">
              Управління платежами через LiqPay
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Експорт
            </Button>
            <PaymentInvoiceComponent
              clients={clients}
              onInvoiceCreated={handleInvoiceCreated}
            />
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* LiqPay Info Banner */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Zap className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">LiqPay інтеграція активна</h3>
                  <p className="text-sm text-blue-700">
                    Приймайте платежі через картки, Apple Pay, Google Pay та інші методи
                  </p>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-4 text-sm text-blue-600">
                <div className="flex items-center gap-1">
                  <CreditCard className="h-4 w-4" />
                  <span>Картки</span>
                </div>
                <div className="flex items-center gap-1">
                  <Smartphone className="h-4 w-4" />
                  <span>Mobile Pay</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span>Онлайн банкінг</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Дохід цього місяця</p>
                  <p className="text-2xl font-bold text-green-600">₴25,200</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% від минулого місяця
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">LiqPay платежі</p>
                  <p className="text-2xl font-bold text-blue-600">₴21,800</p>
                  <p className="text-xs text-blue-600">86% від загального доходу</p>
                </div>
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Очікується</p>
                  <p className="text-2xl font-bold text-yellow-600">₴1,200</p>
                  <p className="text-xs text-slate-500">2 платежі</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Всього транзакцій</p>
                  <p className="text-2xl font-bold text-slate-900">47</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8 цього місяця
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-slate-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Income Chart */}
          <Card className="lg:col-span-2 bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Доходи за місяцями</CardTitle>
              <CardDescription>
                Порівняння доходів та витрат
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 w-20">
                      <span className="text-sm font-medium text-slate-900">
                        {stat.month}
                      </span>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2 relative">
                        <div
                          className="absolute top-0 left-0 h-2 bg-green-500 rounded-full"
                          style={{ width: `${(stat.income / 30000) * 100}%` }}
                        ></div>
                        <div
                          className="absolute top-0 left-0 h-2 bg-red-500 rounded-full"
                          style={{
                            width: `${(stat.expenses / 30000) * 100}%`,
                            marginTop: '4px'
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-right w-24">
                      <div className="text-sm font-medium text-green-600">
                        ₴{stat.income.toLocaleString()}
                      </div>
                      <div className="text-xs text-red-600">
                        ₴{stat.expenses.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-2 bg-green-500 rounded"></div>
                  <span>Доходи</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-2 bg-red-500 rounded"></div>
                  <span>Витрати</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Швидкі дії</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <PaymentInvoiceComponent
                clients={clients}
                onInvoiceCreated={handleInvoiceCreated}
              />
              <Button className="w-full justify-start" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Перевірити статус
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Звіт LiqPay
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Налаштувати автоплатежі
              </Button>
              <div className="pt-2 border-t">
                <WebhookTester onWebhookTested={() => window.location.reload()} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payments List */}
        <Card className="mt-6 bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Останні платежі</CardTitle>
                <CardDescription>
                  Всі транзакції через LiqPay
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Пошук платежів..."
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Фільтр
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {payments.map((payment) => (
                <div key={payment.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="text-sm">
                          {payment.avatar}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-slate-900">
                            {payment.client}
                          </h3>
                          <PaymentStatusBadge status={payment.status} />
                          {payment.method.includes('LiqPay') && (
                            <Badge variant="outline" className="text-blue-600 border-blue-200">
                              <Zap className="h-3 w-3 mr-1" />
                              LiqPay
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-slate-600">
                          <div>
                            <span className="font-medium">Послуга:</span> {payment.service}
                          </div>
                          <div>
                            <span className="font-medium">Метод:</span> {payment.method}
                          </div>
                          <div>
                            <span className="font-medium">Дата:</span> {new Date(payment.date).toLocaleDateString('uk-UA')}
                          </div>
                        </div>

                        {payment.liqpayOrderId && (
                          <div className="mt-1 text-xs text-slate-500">
                            ID транзакції: {payment.liqpayOrderId}
                          </div>
                        )}

                        {payment.dueDate && payment.status === 'pending' && (
                          <div className="mt-1 text-xs text-yellow-600">
                            Термін оплати: {new Date(payment.dueDate).toLocaleDateString('uk-UA')}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-900">
                          ₴{payment.amount}
                        </div>
                        {payment.status === 'paid' && (
                          <div className="text-xs text-green-600">
                            Оплачено
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
