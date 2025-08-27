"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PaymentsAPI } from "@/lib/api/payments"
import {
  Settings,
  Play,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Zap,
  FileText,
  RefreshCw,
  Trash2
} from "lucide-react"

interface WebhookTesterProps {
  onWebhookTested?: () => void
}

export function WebhookTester({ onWebhookTested }: WebhookTesterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [orderId, setOrderId] = useState('TP_1724234567890_test123')
  const [status, setStatus] = useState('success')
  const [amount, setAmount] = useState(800)
  const [currency, setCurrency] = useState('UAH')
  const [lastResult, setLastResult] = useState<any>(null)
  const [webhookLogs, setWebhookLogs] = useState<any[]>([])

  const availableStatuses = [
    { value: 'success', label: 'Успішно', color: 'text-green-600' },
    { value: 'failure', label: 'Помилка', color: 'text-red-600' },
    { value: 'error', label: 'Системна помилка', color: 'text-red-600' },
    { value: 'processing', label: 'В обробці', color: 'text-yellow-600' },
    { value: 'wait_secure', label: 'Очікування 3D-Secure', color: 'text-yellow-600' },
    { value: 'cancelled', label: 'Скасовано', color: 'text-slate-600' },
    { value: 'refund', label: 'Повернено', color: 'text-blue-600' },
    { value: 'sandbox', label: 'Тестовий платіж', color: 'text-purple-600' }
  ]

  const sendTestWebhook = async () => {
    if (!orderId) {
      alert('Введіть Order ID')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/test-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          status,
          amount,
          currency
        })
      })

      const result = await response.json()
      setLastResult(result)
      onWebhookTested?.()

      // Оновити логи
      loadWebhookLogs()

      console.log('Test webhook result:', result)
    } catch (error) {
      console.error('Error sending test webhook:', error)
      setLastResult({
        success: false,
        error: 'Помилка відправки тестового webhook'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadWebhookLogs = () => {
    const logs = PaymentsAPI.getWebhookLogs()
    setWebhookLogs(logs.slice(-10)) // Останні 10 логів
  }

  const clearLogs = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('liqpay_webhook_logs')
      setWebhookLogs([])
    }
  }

  const generateRandomOrderId = () => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substr(2, 9)
    setOrderId(`TP_${timestamp}_${random}`)
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="text-purple-600 border-purple-200 hover:bg-purple-50"
      >
        <Settings className="h-4 w-4 mr-2" />
        Тестувати Webhook
      </Button>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  Тестування LiqPay Webhook
                </CardTitle>
                <CardDescription>
                  Симуляція webhook для тестування обробки статусів платежів
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Параметри тестування</h3>

                <div className="space-y-2">
                  <Label htmlFor="orderId">Order ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="orderId"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="TP_1724234567890_abc123"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateRandomOrderId}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Сума</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Валюта</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UAH">UAH</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Статус платежу</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStatuses.map((statusOption) => (
                        <SelectItem key={statusOption.value} value={statusOption.value}>
                          <span className={statusOption.color}>{statusOption.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={sendTestWebhook}
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Відправка...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Відправити тестовий webhook
                    </>
                  )}
                </Button>

                {/* Last Result */}
                {lastResult && (
                  <Card className={lastResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {lastResult.success ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className={`font-medium ${lastResult.success ? 'text-green-900' : 'text-red-900'}`}>
                          {lastResult.success ? 'Webhook відправлено успішно' : 'Помилка webhook'}
                        </span>
                      </div>
                      {lastResult.webhook_response && (
                        <div className="text-sm text-slate-600">
                          <div>HTTP Status: {lastResult.webhook_response.status}</div>
                          <div>Response: {JSON.stringify(lastResult.webhook_response.result, null, 2)}</div>
                        </div>
                      )}
                      {lastResult.error && (
                        <div className="text-sm text-red-700">
                          Помилка: {lastResult.error}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Logs Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Логи Webhook</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadWebhookLogs}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Оновити
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearLogs}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Очистити
                    </Button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2">
                  {webhookLogs.length === 0 ? (
                    <Card>
                      <CardContent className="p-4 text-center text-slate-500">
                        <FileText className="h-8 w-8 mx-auto mb-2" />
                        Логи webhook'ів відсутні
                      </CardContent>
                    </Card>
                  ) : (
                    webhookLogs.map((log, index) => (
                      <Card key={index} className="text-sm">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge
                              className={
                                log.success
                                  ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                  : 'bg-red-100 text-red-700 hover:bg-red-100'
                              }
                            >
                              {log.success ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              {log.success ? 'Success' : 'Error'}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              {new Date(log.timestamp).toLocaleTimeString('uk-UA')}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div>Order ID: <span className="font-mono">{log.webhook_data.order_id}</span></div>
                            <div>Status: <span className="font-mono">{log.webhook_data.status}</span></div>
                            {log.error_message && (
                              <div className="text-red-600">Error: {log.error_message}</div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={loadWebhookLogs}
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Завантажити логи
                </Button>
              </div>
            </div>

            {/* Info Section */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Про тестування webhook</h4>
                <div className="text-sm text-blue-700 space-y-2">
                  <div>• Webhook симулює отримання сповіщень від LiqPay про зміну статусу платежу</div>
                  <div>• Для тестування використовуються спеціальні тестові підписи</div>
                  <div>• Статуси автоматично оновлюються в базі даних</div>
                  <div>• У реальному проекті webhook'и відправляються безпосередньо від LiqPay</div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
