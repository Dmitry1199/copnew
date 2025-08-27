import { NextRequest, NextResponse } from 'next/server'
import { liqPayService } from '@/lib/liqpay'

// POST handler для симуляції LiqPay webhook (тільки для тестування)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, status = 'success', amount = 800, currency = 'UAH' } = body

    if (!orderId) {
      return NextResponse.json(
        { error: 'orderId is required' },
        { status: 400 }
      )
    }

    console.log('Simulating webhook for:', { orderId, status, amount, currency })

    // Створення тестових даних webhook
    const webhookData = {
      public_key: 'sandbox_i12345678901',
      version: 3,
      action: 'pay',
      payment_id: `payment_${Date.now()}`,
      status: status,
      amount: amount,
      currency: currency,
      description: 'Тестовий платіж',
      order_id: orderId,
      liqpay_order_id: `liqpay_${orderId}`,
      transaction_id: `trans_${Math.random().toString(36).substr(2, 9)}`,
      sender_phone: '+380671234567',
      sender_card_mask2: '424242******4242',
      sender_card_bank: 'pb',
      sender_card_type: 'visa',
      sender_card_country: 804,
      ip: '127.0.0.1',
      create_date: Math.floor(Date.now() / 1000),
      end_date: Math.floor(Date.now() / 1000) + 60
    }

    // Кодування даних та створення підпису (для тестування використовуємо простий підхід)
    const data = Buffer.from(JSON.stringify(webhookData)).toString('base64')
    const signature = `test_signature_${Math.random().toString(36).substr(2, 12)}`

    // Відправка webhook на наш endpoint
    const webhookUrl = new URL('/api/liqpay-webhook', request.url).toString()

    const formData = new FormData()
    formData.append('data', data)
    formData.append('signature', signature)

    console.log('Sending test webhook to:', webhookUrl)

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      body: formData
    })

    const webhookResult = await webhookResponse.json()

    console.log('Test webhook response:', {
      status: webhookResponse.status,
      result: webhookResult
    })

    return NextResponse.json({
      success: true,
      message: 'Test webhook sent successfully',
      webhook_data: webhookData,
      webhook_response: {
        status: webhookResponse.status,
        result: webhookResult
      }
    })

  } catch (error) {
    console.error('Test webhook error:', error)
    return NextResponse.json(
      { error: 'Failed to send test webhook', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET handler для отримання інструкцій
export async function GET() {
  return NextResponse.json({
    message: 'LiqPay Test Webhook Simulator',
    usage: {
      method: 'POST',
      body: {
        orderId: 'string (required) - Order ID to test',
        status: 'string (optional) - LiqPay status (default: success)',
        amount: 'number (optional) - Payment amount (default: 800)',
        currency: 'string (optional) - Currency (default: UAH)'
      },
      example: {
        orderId: 'TP_1724234567890_abc123',
        status: 'success',
        amount: 1200,
        currency: 'UAH'
      }
    },
    available_statuses: [
      'success',
      'failure',
      'error',
      'reversed',
      'refund',
      'processing',
      'prepared',
      'wait_secure',
      'wait_accept',
      'wait_card',
      'cancelled',
      'sandbox'
    ]
  })
}
