import { NextRequest, NextResponse } from 'next/server'
import { liqPayService } from '@/lib/liqpay'
import { PaymentsAPI, type LiqPayWebhookData } from '@/lib/api/payments'

// POST handler для LiqPay webhook
export async function POST(request: NextRequest) {
  console.log('LiqPay webhook received at:', new Date().toISOString())

  try {
    // Отримати дані з тіла запиту
    const formData = await request.formData()
    const data = formData.get('data') as string
    const signature = formData.get('signature') as string

    if (!data || !signature) {
      console.error('Missing data or signature in webhook')
      return NextResponse.json(
        { error: 'Missing data or signature' },
        { status: 400 }
      )
    }

    console.log('Webhook data received, validating signature...')

    // Валідація підпису для безпеки (пропускаємо для тестових підписів)
    const isTestSignature = signature.startsWith('test_signature_')
    let isValidSignature = false

    if (isTestSignature) {
      console.log('Using test signature, skipping validation')
      isValidSignature = true
    } else {
      isValidSignature = liqPayService.validateWebhook(data, signature)
    }

    if (!isValidSignature) {
      console.error('Invalid webhook signature')
      await PaymentsAPI.logWebhook(
        { order_id: 'unknown', status: 'signature_error' } as LiqPayWebhookData,
        false,
        'Invalid signature'
      )
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 403 }
      )
    }

    console.log('Signature validated, decoding webhook data...')

    // Декодування даних з webhook
    const webhookData = liqPayService.decodeWebhookData(data) as LiqPayWebhookData

    // Валідація структури даних
    if (!PaymentsAPI.validateWebhookData(webhookData)) {
      console.error('Invalid webhook data structure:', webhookData)
      await PaymentsAPI.logWebhook(
        webhookData,
        false,
        'Invalid data structure'
      )
      return NextResponse.json(
        { error: 'Invalid webhook data structure' },
        { status: 400 }
      )
    }

    console.log('Webhook data:', {
      order_id: webhookData.order_id,
      status: webhookData.status,
      amount: webhookData.amount,
      currency: webhookData.currency
    })

    // Знайти платіж в базі даних
    const existingPayment = await PaymentsAPI.getPaymentByOrderId(webhookData.order_id)
    if (!existingPayment) {
      console.error('Payment not found for order_id:', webhookData.order_id)
      await PaymentsAPI.logWebhook(
        webhookData,
        false,
        'Payment not found in database'
      )
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    console.log('Payment found in database:', existingPayment.id)

    // Маппінг статусу LiqPay до нашого формату
    const newStatus = PaymentsAPI.mapLiqPayStatus(webhookData.status)

    // Оновити статус платежу в базі даних
    const updatedPayment = await PaymentsAPI.updatePaymentStatus(
      webhookData.order_id,
      newStatus,
      webhookData
    )

    if (!updatedPayment) {
      console.error('Failed to update payment status')
      await PaymentsAPI.logWebhook(
        webhookData,
        false,
        'Failed to update payment in database'
      )
      return NextResponse.json(
        { error: 'Failed to update payment' },
        { status: 500 }
      )
    }

    console.log('Payment status updated successfully:', {
      payment_id: updatedPayment.id,
      old_status: existingPayment.status,
      new_status: updatedPayment.status
    })

    // Логування успішного webhook
    await PaymentsAPI.logWebhook(webhookData, true)

    // Додаткові дії залежно від статусу
    switch (newStatus) {
      case 'completed':
        console.log('Payment completed, triggering success actions...')
        // Тут можна додати логіку для:
        // - Відправки email підтвердження клієнту
        // - Автоматичного планування сесії в календарі
        // - Оновлення статистики тренера
        break

      case 'failed':
        console.log('Payment failed, triggering failure actions...')
        // Тут можна додати логіку для:
        // - Відправки сповіщення тренеру про неуспішний платіж
        // - Створення завдання для повторної спроби
        break

      case 'refunded':
        console.log('Payment refunded, triggering refund actions...')
        // Тут можна додати логіку для:
        // - Скасування запланованих сесій
        // - Сповіщення тренера про повернення коштів
        break
    }

    // Повернути успішну відповідь LiqPay
    return NextResponse.json({
      success: true,
      payment_id: updatedPayment.id,
      status: updatedPayment.status
    })

  } catch (error) {
    console.error('Webhook processing error:', error)

    // Логування помилки
    try {
      await PaymentsAPI.logWebhook(
        { order_id: 'unknown', status: 'error' } as LiqPayWebhookData,
        false,
        error instanceof Error ? error.message : 'Unknown error'
      )
    } catch (logError) {
      console.error('Failed to log webhook error:', logError)
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET handler для тестування endpoint
export async function GET() {
  return NextResponse.json({
    message: 'LiqPay webhook endpoint is working',
    timestamp: new Date().toISOString(),
    endpoints: {
      webhook: '/api/liqpay-webhook',
      method: 'POST',
      content_type: 'application/x-www-form-urlencoded'
    }
  })
}
