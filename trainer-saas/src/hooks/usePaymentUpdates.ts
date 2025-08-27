"use client"

import { useEffect, useState, useCallback } from 'react'
import { PaymentsAPI } from '@/lib/api/payments'

export interface PaymentUpdate {
  id: string
  orderId: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded'
  timestamp: string
}

export function usePaymentUpdates() {
  const [updates, setUpdates] = useState<PaymentUpdate[]>([])
  const [isListening, setIsListening] = useState(false)

  // Симуляція real-time оновлень через polling
  const checkForUpdates = useCallback(async () => {
    try {
      // В реальному проекті тут би був WebSocket або Server-Sent Events
      // Для демо використовуємо localStorage для відстеження змін
      const logs = PaymentsAPI.getWebhookLogs()
      const recentLogs = logs.filter(log => {
        const logTime = new Date(log.timestamp).getTime()
        const now = Date.now()
        return now - logTime < 30000 // Останні 30 секунд
      })

      const newUpdates: PaymentUpdate[] = recentLogs.map(log => ({
        id: Math.random().toString(36).substr(2, 9),
        orderId: log.webhook_data.order_id,
        status: PaymentsAPI.mapLiqPayStatus(log.webhook_data.status),
        timestamp: log.timestamp
      }))

      if (newUpdates.length > 0) {
        setUpdates(prev => {
          const merged = [...newUpdates, ...prev]
          // Зберігати тільки останні 20 оновлень
          return merged.slice(0, 20)
        })
      }
    } catch (error) {
      console.error('Error checking for payment updates:', error)
    }
  }, [])

  // Почати прослуховування оновлень
  const startListening = useCallback(() => {
    if (isListening) return

    setIsListening(true)

    // Перевіряти оновлення кожні 2 секунди
    const interval = setInterval(checkForUpdates, 2000)

    // Cleanup function
    return () => {
      clearInterval(interval)
      setIsListening(false)
    }
  }, [isListening, checkForUpdates])

  // Зупинити прослуховування
  const stopListening = useCallback(() => {
    setIsListening(false)
  }, [])

  // Очистити оновлення
  const clearUpdates = useCallback(() => {
    setUpdates([])
  }, [])

  // Автоматично почати прослуховування при mount
  useEffect(() => {
    const cleanup = startListening()

    return () => {
      cleanup?.()
    }
  }, [startListening])

  // Notification API для сповіщень в браузері
  const showNotification = useCallback((update: PaymentUpdate) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const statusText = {
        pending: 'в обробці',
        completed: 'успішно завершено',
        failed: 'не вдалось',
        cancelled: 'скасовано',
        refunded: 'повернено'
      }[update.status]

      new Notification(`Платіж ${statusText}`, {
        body: `Order ID: ${update.orderId}`,
        icon: '/favicon.ico',
        tag: update.orderId, // Prevent duplicate notifications
        requireInteraction: false
      })
    }
  }, [])

  // Запросити дозвіл на сповіщення
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }, [])

  // Відстежувати нові оновлення та показувати сповіщення
  useEffect(() => {
    if (updates.length > 0) {
      const latestUpdate = updates[0]
      const updateTime = new Date(latestUpdate.timestamp).getTime()
      const now = Date.now()

      // Показати сповіщення тільки для дуже свіжих оновлень (останні 5 секунд)
      if (now - updateTime < 5000) {
        showNotification(latestUpdate)
      }
    }
  }, [updates, showNotification])

  return {
    updates,
    isListening,
    startListening,
    stopListening,
    clearUpdates,
    requestNotificationPermission,
    hasNewUpdates: updates.length > 0,
    latestUpdate: updates[0] || null
  }
}

// Hook для конкретного платежу
export function usePaymentStatus(orderId: string) {
  const { updates } = usePaymentUpdates()
  const [currentStatus, setCurrentStatus] = useState<string | null>(null)

  useEffect(() => {
    // Знайти останнє оновлення для цього платежу
    const paymentUpdate = updates.find(update => update.orderId === orderId)
    if (paymentUpdate) {
      setCurrentStatus(paymentUpdate.status)
    }
  }, [updates, orderId])

  return currentStatus
}
