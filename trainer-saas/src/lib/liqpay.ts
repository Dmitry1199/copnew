import CryptoJS from 'crypto-js'

// LiqPay configuration - в реальному проекті використовуйте змінні середовища
const LIQPAY_PUBLIC_KEY = 'sandbox_i12345678901' // Демо ключі
const LIQPAY_PRIVATE_KEY = 'sandbox_12345678901234567890123456789012' // Демо ключі

export interface LiqPayPayment {
  version: number
  public_key: string
  action: string
  amount: number
  currency: string
  description: string
  order_id: string
  result_url?: string
  server_url?: string
  language?: string
  customer?: string
  customer_user_id?: string
  phone?: string
  product_name?: string
  product_category?: string
  product_description?: string
}

export interface PaymentInvoice {
  id: string
  clientId: string
  clientName: string
  clientEmail: string
  amount: number
  currency: string
  description: string
  status: 'pending' | 'paid' | 'failed' | 'cancelled'
  createdAt: Date
  paidAt?: Date
  liqpayOrderId?: string
}

class LiqPayService {
  private publicKey: string
  private privateKey: string

  constructor(publicKey: string, privateKey: string) {
    this.publicKey = publicKey
    this.privateKey = privateKey
  }

  // Створення підпису для LiqPay
  private createSignature(data: string): string {
    const signString = this.privateKey + data + this.privateKey
    return CryptoJS.SHA1(signString).toString(CryptoJS.enc.Base64)
  }

  // Кодування даних для LiqPay
  private encodeData(data: object): string {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(data)))
  }

  // Створення форми для оплати
  generatePaymentForm(payment: Omit<LiqPayPayment, 'version' | 'public_key'>): {
    data: string
    signature: string
    form_html: string
  } {
    const paymentData: LiqPayPayment = {
      version: 3,
      public_key: this.publicKey,
      ...payment
    }

    const data = this.encodeData(paymentData)
    const signature = this.createSignature(data)

    const formHtml = `
      <form method="POST" action="https://www.liqpay.ua/api/3/checkout" accept-charset="utf-8">
        <input type="hidden" name="data" value="${data}" />
        <input type="hidden" name="signature" value="${signature}" />
        <button type="submit" class="liqpay-button">
          Оплатити ${payment.amount} ${payment.currency}
        </button>
      </form>
    `

    return {
      data,
      signature,
      form_html: formHtml
    }
  }

  // Створення даних для JavaScript SDK
  generatePaymentData(payment: Omit<LiqPayPayment, 'version' | 'public_key'>): {
    data: string
    signature: string
  } {
    const paymentData: LiqPayPayment = {
      version: 3,
      public_key: this.publicKey,
      ...payment
    }

    const data = this.encodeData(paymentData)
    const signature = this.createSignature(data)

    return { data, signature }
  }

  // Перевірка статусу платежу
  async checkPaymentStatus(orderId: string): Promise<unknown> {
    const requestData = {
      version: 3,
      public_key: this.publicKey,
      action: 'status',
      order_id: orderId
    }

    const data = this.encodeData(requestData)
    const signature = this.createSignature(data)

    try {
      const response = await fetch('https://www.liqpay.ua/api/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data, signature })
      })

      return await response.json()
    } catch (error) {
      console.error('Error checking payment status:', error)
      throw error
    }
  }

  // Валідація webhook від LiqPay
  validateWebhook(data: string, signature: string): boolean {
    const expectedSignature = this.createSignature(data)
    return signature === expectedSignature
  }

  // Декодування даних з webhook
  decodeWebhookData(data: string): unknown {
    try {
      const decodedData = CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8)
      return JSON.parse(decodedData)
    } catch (error) {
      console.error('Error decoding webhook data:', error)
      throw error
    }
  }

  // Публічні методи для тестування (використовувати тільки в тестах)
  public encodeDataForTesting(data: object): string {
    return this.encodeData(data)
  }

  public createSignatureForTesting(data: string): string {
    return this.createSignature(data)
  }
}

// Створення екземпляра сервісу
export const liqPayService = new LiqPayService(LIQPAY_PUBLIC_KEY, LIQPAY_PRIVATE_KEY)

// Утилітарні функції для форматування
export const formatCurrency = (amount: number, currency: string = 'UAH'): string => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

export const generateOrderId = (): string => {
  return `TP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Демо дані для тестування
export const DEMO_PAYMENTS: PaymentInvoice[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'Марина Коваленко',
    clientEmail: 'marina.kovalenko@email.com',
    amount: 800,
    currency: 'UAH',
    description: 'Персональне тренування - 1 сесія',
    status: 'pending',
    createdAt: new Date('2024-08-21'),
    liqpayOrderId: 'TP_1724234567890_abc123'
  },
  {
    id: '2',
    clientId: '2',
    clientName: 'Андрій Петров',
    clientEmail: 'andrii.petrov@email.com',
    amount: 1200,
    currency: 'UAH',
    description: 'Місячний абонемент',
    status: 'paid',
    createdAt: new Date('2024-08-20'),
    paidAt: new Date('2024-08-20'),
    liqpayOrderId: 'TP_1724148167890_def456'
  }
]
