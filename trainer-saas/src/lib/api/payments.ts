import { supabase, handleSupabaseError, type Payment, type TablesInsert, type TablesUpdate } from '../supabase'

export interface LiqPayWebhookData {
  public_key: string
  version: number
  action: string
  payment_id: string
  status: string
  amount: number
  currency: string
  description: string
  order_id: string
  liqpay_order_id: string
  transaction_id: string
  sender_phone?: string
  sender_card_mask2?: string
  sender_card_bank?: string
  sender_card_type?: string
  sender_card_country?: number
  ip?: string
  create_date: number
  end_date: number
  err_code?: string
  err_description?: string
}

export class PaymentsAPI {
  // Отримати всі платежі тренера
  static async getPayments(trainerId: string): Promise<Payment[]> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          clients (
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('trainer_id', trainerId)
        .order('created_at', { ascending: false })

      if (error) handleSupabaseError(error)
      return data || []
    } catch (error) {
      console.error('Error fetching payments:', error)
      throw error
    }
  }

  // Отримати платіж за LiqPay order_id
  static async getPaymentByOrderId(orderId: string): Promise<Payment | null> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('liqpay_order_id', orderId)
        .single()

      if (error && error.code !== 'PGRST116') handleSupabaseError(error)
      return data || null
    } catch (error) {
      console.error('Error fetching payment by order ID:', error)
      throw error
    }
  }

  // Створити новий платіж
  static async createPayment(paymentData: TablesInsert<'payments'>): Promise<Payment> {
    try {
      const { data, error } = await supabase
        .from('payments')
        // @ts-ignore - временное решение для типов Supabase
        .insert(paymentData)
        .select('*')
        .single()

      if (error) handleSupabaseError(error)
      if (!data) throw new Error('No data returned from insert')
      return data as Payment
    } catch (error) {
      console.error('Error creating payment:', error)
      throw error
    }
  }

  // Оновити статус платежу
  static async updatePaymentStatus(
    orderId: string,
    status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded',
    webhookData?: Partial<LiqPayWebhookData>
  ): Promise<Payment | null> {
    try {
      const updates: TablesUpdate<'payments'> = {
        status,
        updated_at: new Date().toISOString()
      }

      // Додати додаткові дані з webhook
      if (webhookData) {
        if (webhookData.transaction_id) {
          updates.liqpay_transaction_id = webhookData.transaction_id
        }
        if (status === 'completed' && webhookData.end_date) {
          updates.paid_at = new Date(webhookData.end_date * 1000).toISOString()
        }
      }

      const { data, error } = await supabase
        .from('payments')
        // @ts-ignore - временное решение для типов Supabase
        .update(updates)
        .eq('liqpay_order_id', orderId)
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') handleSupabaseError(error)
      return (data as unknown as Payment) || null
    } catch (error) {
      console.error('Error updating payment status:', error)
      throw error
    }
  }

  // Отримати статистику платежів
  static async getPaymentsStats(trainerId: string): Promise<{
    total: number
    completed: number
    pending: number
    failed: number
    totalAmount: number
    monthlyAmount: number
  }> {
    try {
      // Загальна кількість платежів
      const { count: total, error: totalError } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', trainerId)

      if (totalError) handleSupabaseError(totalError)

      // Завершені платежі
      const { count: completed, error: completedError } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', trainerId)
        .eq('status', 'completed')

      if (completedError) handleSupabaseError(completedError)

      // Очікувані платежі
      const { count: pending, error: pendingError } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', trainerId)
        .eq('status', 'pending')

      if (pendingError) handleSupabaseError(pendingError)

      // Неуспішні платежі
      const { count: failed, error: failedError } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', trainerId)
        .eq('status', 'failed')

      if (failedError) handleSupabaseError(failedError)

      // Загальна сума завершених платежів
      const { data: completedPayments, error: amountError } = await supabase
        .from('payments')
        .select('amount')
        .eq('trainer_id', trainerId)
        .eq('status', 'completed')

      if (amountError) handleSupabaseError(amountError)

      const totalAmount = (completedPayments as any[])?.reduce((sum: number, payment: any) => sum + payment.amount, 0) || 0

      // Сума за поточний місяць
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { data: monthlyPayments, error: monthlyError } = await supabase
        .from('payments')
        .select('amount')
        .eq('trainer_id', trainerId)
        .eq('status', 'completed')
        .gte('paid_at', startOfMonth.toISOString())

      if (monthlyError) handleSupabaseError(monthlyError)

      const monthlyAmount = (monthlyPayments as any[])?.reduce((sum: number, payment: any) => sum + payment.amount, 0) || 0

      return {
        total: total || 0,
        completed: completed || 0,
        pending: pending || 0,
        failed: failed || 0,
        totalAmount,
        monthlyAmount
      }
    } catch (error) {
      console.error('Error fetching payments stats:', error)
      throw error
    }
  }

  // Логування webhook'ів
  static async logWebhook(webhookData: LiqPayWebhookData, success: boolean, error?: string): Promise<void> {
    try {
      const logData = {
        webhook_data: webhookData,
        success,
        error_message: error,
        timestamp: new Date().toISOString(),
        order_id: webhookData.order_id,
        status: webhookData.status
      }

      // В реальному проекті можна створити окрему таблицю для логів webhook'ів
      console.log('LiqPay Webhook Log:', logData)

      // Зберегти лог в localStorage для демонстрації (в продакшені використовувати базу даних)
      if (typeof window !== 'undefined') {
        const logs = JSON.parse(localStorage.getItem('liqpay_webhook_logs') || '[]')
        logs.push(logData)
        // Зберігати тільки останні 50 логів
        if (logs.length > 50) {
          logs.splice(0, logs.length - 50)
        }
        localStorage.setItem('liqpay_webhook_logs', JSON.stringify(logs))
      }
    } catch (error) {
      console.error('Error logging webhook:', error)
    }
  }

  // Отримати логи webhook'ів (для демонстрації)
  static getWebhookLogs(): Array<{
    webhook_data: LiqPayWebhookData
    success: boolean
    error_message?: string
    timestamp: string
  }> {
    if (typeof window === 'undefined') return []

    try {
      return JSON.parse(localStorage.getItem('liqpay_webhook_logs') || '[]')
    } catch {
      return []
    }
  }

  // Валідація webhook даних
  static validateWebhookData(data: unknown): data is LiqPayWebhookData {
    if (!data || typeof data !== 'object') return false

    const webhookData = data as Record<string, unknown>

    // Перевірка обов'язкових полів
    const requiredFields = [
      'public_key',
      'version',
      'action',
      'payment_id',
      'status',
      'amount',
      'currency',
      'description',
      'order_id',
      'liqpay_order_id',
      'create_date'
    ]

    for (const field of requiredFields) {
      if (!(field in webhookData)) {
        console.error(`Missing required field: ${field}`)
        return false
      }
    }

    // Перевірка типів даних
    if (typeof webhookData.public_key !== 'string' ||
        typeof webhookData.order_id !== 'string' ||
        typeof webhookData.status !== 'string' ||
        typeof webhookData.action !== 'string' ||
        typeof webhookData.currency !== 'string' ||
        typeof webhookData.description !== 'string') {
      console.error('Invalid data types in webhook')
      return false
    }

    // Перевірка числових полів
    if (typeof webhookData.amount !== 'number' ||
        typeof webhookData.version !== 'number' ||
        typeof webhookData.create_date !== 'number') {
      console.error('Invalid numeric data types in webhook')
      return false
    }

    // Перевірка валідних статусів LiqPay
    const validStatuses = [
      'success', 'failure', 'error', 'reversed', 'refund',
      'processing', 'prepared', 'wait_secure', 'wait_accept',
      'wait_card', 'cancelled', 'sandbox'
    ]

    if (!validStatuses.includes(webhookData.status as string)) {
      console.error(`Invalid status: ${webhookData.status}`)
      return false
    }

    return true
  }

  // Маппінг статусів LiqPay до наших статусів
  static mapLiqPayStatus(liqpayStatus: string): 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded' {
    switch (liqpayStatus) {
      case 'success':
      case 'sandbox':
        return 'completed'
      case 'failure':
      case 'error':
        return 'failed'
      case 'reversed':
      case 'refund':
        return 'refunded'
      case 'processing':
      case 'prepared':
      case 'wait_secure':
      case 'wait_accept':
      case 'wait_card':
        return 'pending'
      case 'cancelled':
        return 'cancelled'
      default:
        return 'pending'
    }
  }

  // Форматування суми
  static formatAmount(amount: number, currency: string = 'UAH'): string {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  // Отримати опис статусу
  static getStatusDescription(status: string): string {
    switch (status) {
      case 'pending':
        return 'Очікується оплата'
      case 'completed':
        return 'Успішно оплачено'
      case 'failed':
        return 'Помилка оплати'
      case 'cancelled':
        return 'Скасовано'
      case 'refunded':
        return 'Повернено'
      default:
        return 'Невідомий статус'
    }
  }
}
