"use client"

import { useEffect, useState, useCallback, useRef } from 'react'
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
  const intervalRef = useRef<NodeJS.Timer | null>(null)

  const checkForUpdates = useCallback(async () => {
    try {
      const logs = PaymentsAPI.getWebhookLogs()
      const recentLogs = logs.filter(log => Date.now() - new Date(log.timestamp).getTime() < 30000)

      const newUpdates: PaymentUpdate[] = recentLogs.map(log => ({
        id: Math.random().toString(36).substr(2, 9),
        orderId: log.webhook_data.order_id,
        status: PaymentsAPI.mapLiqPayStatus(log.webhook_data.status),
        timestamp: log.timestamp
      }))

      if (newUpdates.length > 0) {
        setUpdates(prev => [...newUpdates, ...prev].slice(0, 20))
      }
    } catch (error) {
      console.error('Error checking for payment updates:', error)
    }
  }, [])

  const startListening = useCallback(() => {
    if (isListening) return
    setIsListening(true)
    intervalRef.current = setInterval(checkForUpdates, 2000)
  }, [isListening, checkForUpdates])

  const stopListening = useCallback(() => {
    setIsListening(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const clearUpdates = useCallback(() => {
    setUpdates([])
  }, [])

  useEffect(() => {
    startListening()
    return () => stopListening()
  }, [startListening, stopListening])

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
        tag: update.orderId,
        requireInteraction: false
      })
    }
  }, [])

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }, [])

  useEffect(() => {
    if (updates.length > 0) {
      const latestUpdate = updates[0]
      if (Date.now() - new Date(latestUpdate.timestamp).getTime() < 5000) {
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
    const paymentUpdate = updates.find(update => update.orderId === orderId)
    if (paymentUpdate) setCurrentStatus(paymentUpdate.status)
  }, [updates, orderId])

  return currentStatus
}