"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Home,
  Receipt,
  Zap,
  Download,
  Share2,
  CreditCard
} from "lucide-react"
import { formatCurrency } from "@/lib/liqpay"

export default function PaymentResultPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [paymentData, setPaymentData] = useState<any>(null)

  useEffect(() => {
    // Симуляція отримання даних про платіж з URL параметрів або API
    const orderId = searchParams?.get('order_id')
    const status = searchParams?.get('status') || 'success' // success, failure, pending
    const amount = searchParams?.get('amount') || '800'
    const currency = searchParams?.get('currency') || 'UAH'
    const description = searchParams?.get('description') || 'Персональне тренування'

    // Симуляція затримки API
    setTimeout(() => {
      setPaymentData({
        orderId: orderId || 'TP_1724234567890_demo123',
        status: status,
        amount: parseFloat(amount),
        currency: currency,
        description: description,
        clientName: 'Марина Коваленко',
        transactionId: 'liqpay_' + Math.random().toString(36).substr(2, 9),
        paymentMethod: 'Visa **** 4999',
        timestamp: new Date().toISOString()
      })
      setIsLoading(false)
    }, 1500)
  }, [searchParams])

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'success':
        return {
          icon: CheckCircle,
          title: 'Платіж успішно проведено!',
          description: 'Ваша оплата була успішно обробляна',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          badgeClass: 'bg-green-100 text-green-700 hover:bg-green-100'
        }
      case 'failure':
        return {
          icon: XCircle,
          title: 'Помилка платежу',
          description: 'На жаль, платіж не вдалося обробити',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          badgeClass: 'bg-red-100 text-red-700 hover:bg-red-100'
        }
      case 'pending':
        return {
          icon: Clock,
          title: 'Платіж в обробці',
          description: 'Ваш платіж обробляється, будь ласка, зачекайте',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          badgeClass: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
        }
      default:
        return {
          icon: AlertTriangle,
          title: 'Невідомий статус',
          description: 'Не вдалося визначити статус платежу',
          color: 'text-slate-600',
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-200',
          badgeClass: 'bg-slate-100 text-slate-700 hover:bg-slate-100'
        }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Обробка результату платежу...</p>
        </div>
      </div>
    )
  }

  const statusConfig = getStatusConfig(paymentData?.status)
  const StatusIcon = statusConfig.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Status Card */}
          <Card className={`${statusConfig.bgColor} ${statusConfig.borderColor} border-2`}>
            <CardContent className="p-8 text-center">
              <StatusIcon className={`h-16 w-16 ${statusConfig.color} mx-auto mb-4`} />
              <h1 className={`text-2xl font-bold ${statusConfig.color} mb-2`}>
                {statusConfig.title}
              </h1>
              <p className="text-slate-600 mb-4">
                {statusConfig.description}
              </p>
              <Badge className={statusConfig.badgeClass}>
                <Zap className="h-3 w-3 mr-1" />
                LiqPay
              </Badge>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-blue-600" />
                Деталі платежу
              </CardTitle>
              <CardDescription>
                Інформація про вашу транзакцію
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Сума</label>
                  <div className="text-lg font-bold text-slate-900">
                    {formatCurrency(paymentData.amount, paymentData.currency)}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Статус</label>
                  <Badge className={statusConfig.badgeClass}>
                    {paymentData.status === 'success' ? 'Успішно' :
                     paymentData.status === 'failure' ? 'Помилка' :
                     paymentData.status === 'pending' ? 'В обробці' : 'Невідомо'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Номер замовлення</label>
                  <div className="text-sm font-mono text-slate-600">
                    {paymentData.orderId}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">ID транзакції</label>
                  <div className="text-sm font-mono text-slate-600">
                    {paymentData.transactionId}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Спосіб оплати</label>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">{paymentData.paymentMethod}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Дата та час</label>
                  <div className="text-sm text-slate-600">
                    {new Date(paymentData.timestamp).toLocaleString('uk-UA')}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="text-sm font-medium text-slate-700">Опис</label>
                <div className="text-slate-900 mt-1">
                  {paymentData.description}
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  Клієнт: {paymentData.clientName}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success Actions */}
          {paymentData.status === 'success' && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-green-900 mb-3">Наступні кроки</h3>
                <div className="space-y-2 text-sm text-green-700">
                  <div>✅ Клієнту відправлено підтвердження на email</div>
                  <div>✅ Платіж додано до вашої статистики</div>
                  <div>✅ Тренування автоматично заплановано в календарі</div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Actions */}
          {paymentData.status === 'failure' && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-red-900 mb-3">Можливі причини помилки</h3>
                <div className="space-y-2 text-sm text-red-700">
                  <div>• Недостатньо коштів на картці</div>
                  <div>• Картка заблокована або прострочена</div>
                  <div>• Помилка в даних картки</div>
                  <div>• Технічна помилка банку</div>
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="text-red-700 border-red-200">
                    Спробувати знову
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => router.push('/')}
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Повернутися на головну
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/payments')}
              className="flex-1"
            >
              <Receipt className="h-4 w-4 mr-2" />
              Переглянути всі платежі
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Завантажити квитанцію
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Поділитися
            </Button>
          </div>

          {/* Support Info */}
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-slate-600">
                Маєте питання щодо платежу?
                <br />
                Зв'яжіться з підтримкою LiqPay:
                <a href="tel:0800505700" className="text-blue-600 hover:text-blue-500 ml-1">
                  0 800 50 57 00
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
