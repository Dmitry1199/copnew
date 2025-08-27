"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  CreditCard,
  Plus,
  Send,
  Copy,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Calculator,
  User,
  Mail,
  Phone,
  X
} from "lucide-react"
import { liqPayService, generateOrderId, formatCurrency, type PaymentInvoice } from "@/lib/liqpay"

interface PaymentInvoiceProps {
  clients: Array<{
    id: string
    name: string
    email: string
    phone: string
    avatar: string
  }>
  onInvoiceCreated?: (invoice: PaymentInvoice) => void
}

export function PaymentInvoiceComponent({ clients, onInvoiceCreated }: PaymentInvoiceProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedClient, setSelectedClient] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [currency, setCurrency] = useState<string>("UAH")
  const [paymentData, setPaymentData] = useState<{ data: string; signature: string } | null>(null)

  const serviceTypes = [
    { value: "personal_training", label: "Персональне тренування", price: 800 },
    { value: "group_training", label: "Групове тренування", price: 400 },
    { value: "monthly_subscription", label: "Місячний абонемент", price: 1200 },
    { value: "training_program", label: "Тренувальна програма", price: 1500 },
    { value: "consultation", label: "Консультація", price: 300 },
    { value: "nutrition_plan", label: "План харчування", price: 600 }
  ]

  const handleServiceSelect = (serviceValue: string) => {
    const service = serviceTypes.find(s => s.value === serviceValue)
    if (service) {
      setAmount(service.price.toString())
      setDescription(service.label)
    }
  }

  const generateInvoice = async () => {
    if (!selectedClient || !amount || !description) {
      alert("Будь ласка, заповніть всі поля")
      return
    }

    setIsLoading(true)

    try {
      const client = clients.find(c => c.id === selectedClient)
      if (!client) return

      const orderId = generateOrderId()
      const paymentAmount = parseFloat(amount)

      // Створення даних для LiqPay
      const payment = liqPayService.generatePaymentData({
        action: 'pay',
        amount: paymentAmount,
        currency: currency,
        description: description,
        order_id: orderId,
        customer: client.email,
        customer_user_id: client.id,
        phone: client.phone,
        product_name: description,
        product_category: 'fitness_services',
        product_description: `Послуги персонального тренера: ${description}`,
        language: 'uk',
        result_url: `${window.location.origin}/payment-result`,
        server_url: `${window.location.origin}/api/liqpay-webhook`
      })

      setPaymentData(payment)

      // Створення інвойсу
      const invoice: PaymentInvoice = {
        id: Math.random().toString(36).substr(2, 9),
        clientId: client.id,
        clientName: client.name,
        clientEmail: client.email,
        amount: paymentAmount,
        currency: currency,
        description: description,
        status: 'pending',
        createdAt: new Date(),
        liqpayOrderId: orderId
      }

      onInvoiceCreated?.(invoice)

      // Очищення форми
      setSelectedClient("")
      setAmount("")
      setDescription("")

    } catch (error) {
      console.error('Error generating invoice:', error)
      alert("Виникла помилка при створенні інвойсу")
    } finally {
      setIsLoading(false)
    }
  }

  const copyPaymentLink = () => {
    if (paymentData) {
      const paymentUrl = `https://www.liqpay.ua/api/3/checkout?data=${paymentData.data}&signature=${paymentData.signature}`
      navigator.clipboard.writeText(paymentUrl)
      alert("Посилання скопійовано!")
    }
  }

  const openLiqPayForm = () => {
    if (paymentData) {
      // Створення форми та автоматична відправка
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = 'https://www.liqpay.ua/api/3/checkout'
      form.target = '_blank'

      const dataInput = document.createElement('input')
      dataInput.type = 'hidden'
      dataInput.name = 'data'
      dataInput.value = paymentData.data

      const signatureInput = document.createElement('input')
      signatureInput.type = 'hidden'
      signatureInput.name = 'signature'
      signatureInput.value = paymentData.signature

      form.appendChild(dataInput)
      form.appendChild(signatureInput)
      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Створити інвойс
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
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  Створення інвойсу для оплати
                </CardTitle>
                <CardDescription>
                  Виберіть клієнта та послугу для створення рахунку через LiqPay
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {!paymentData ? (
              <>
                {/* Вибір клієнта */}
                <div className="space-y-2">
                  <Label>Клієнт</Label>
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Оберіть клієнта" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback className="text-xs">
                                {client.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{client.name}</div>
                              <div className="text-xs text-slate-500">{client.email}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Швидкий вибір послуги */}
                <div className="space-y-2">
                  <Label>Тип послуги (швидкий вибір)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {serviceTypes.map((service) => (
                      <Button
                        key={service.value}
                        variant="outline"
                        className="justify-start h-auto p-3"
                        onClick={() => handleServiceSelect(service.value)}
                      >
                        <div className="text-left">
                          <div className="font-medium text-sm">{service.label}</div>
                          <div className="text-xs text-slate-500">
                            {formatCurrency(service.price)}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Сума та валюта */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="amount">Сума</Label>
                    <div className="relative">
                      <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        id="amount"
                        type="number"
                        placeholder="800"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Валюта</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UAH">UAH (₴)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Опис */}
                <div className="space-y-2">
                  <Label htmlFor="description">Опис послуги</Label>
                  <textarea
                    id="description"
                    placeholder="Персональне тренування - 1 сесія"
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Превью */}
                {selectedClient && amount && description && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Превью інвойсу:</h4>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="text-blue-700">Клієнт:</span>{" "}
                          {clients.find(c => c.id === selectedClient)?.name}
                        </div>
                        <div>
                          <span className="text-blue-700">Послуга:</span> {description}
                        </div>
                        <div>
                          <span className="text-blue-700">Сума:</span>{" "}
                          <span className="font-medium">
                            {formatCurrency(parseFloat(amount) || 0, currency)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={generateInvoice}
                    disabled={!selectedClient || !amount || !description || isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Створення...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Створити інвойс
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Скасувати
                  </Button>
                </div>
              </>
            ) : (
              /* Результат створення інвойсу */
              <div className="space-y-4">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-green-900">
                    Інвойс успішно створено!
                  </h3>
                  <p className="text-green-700">
                    Тепер клієнт може оплатити через LiqPay
                  </p>
                </div>

                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Сума до оплати:</span>
                      <span className="font-semibold text-lg">
                        {formatCurrency(parseFloat(amount), currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Клієнт:</span>
                      <span className="font-medium">
                        {clients.find(c => c.id === selectedClient)?.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Послуга:</span>
                      <span className="font-medium">{description}</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={openLiqPayForm} className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Оплатити зараз
                  </Button>
                  <Button variant="outline" onClick={copyPaymentLink} className="w-full">
                    <Copy className="h-4 w-4 mr-2" />
                    Копіювати посилання
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setPaymentData(null)
                    setIsOpen(false)
                  }}
                  className="w-full"
                >
                  Закрити
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

// Компонент для відображення статусу платежу
export function PaymentStatusBadge({ status }: { status: PaymentInvoice['status'] }) {
  const statusConfig = {
    pending: {
      icon: Clock,
      label: 'Очікується',
      className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
    },
    paid: {
      icon: CheckCircle,
      label: 'Оплачено',
      className: 'bg-green-100 text-green-700 hover:bg-green-100'
    },
    failed: {
      icon: XCircle,
      label: 'Помилка',
      className: 'bg-red-100 text-red-700 hover:bg-red-100'
    },
    cancelled: {
      icon: AlertCircle,
      label: 'Скасовано',
      className: 'bg-slate-100 text-slate-700 hover:bg-slate-100'
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge className={config.className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  )
}
