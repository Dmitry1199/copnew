"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { usePaymentUpdates } from '@/hooks/usePaymentUpdates'
import {
  Bell,
  BellOff,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Zap,
  Trash2,
  Settings
} from "lucide-react"

export function PaymentUpdatesWidget() {
  const {
    updates,
    isListening,
    startListening,
    stopListening,
    clearUpdates,
    requestNotificationPermission,
    hasNewUpdates,
    latestUpdate
  } = usePaymentUpdates()

  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  // Перевірити стан дозволу на сповіщення при mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted')
    }
  }, [])

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      const granted = await requestNotificationPermission()
      setNotificationsEnabled(granted)
    } else {
      setNotificationsEnabled(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'cancelled':
        return <AlertTriangle className="h-4 w-4 text-slate-600" />
      case 'refunded':
        return <RotateCcw className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-slate-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Успішно'
      case 'pending':
        return 'В обробці'
      case 'failed':
        return 'Помилка'
      case 'cancelled':
        return 'Скасовано'
      case 'refunded':
        return 'Повернено'
      default:
        return 'Невідомо'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 hover:bg-green-100'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
      case 'failed':
        return 'bg-red-100 text-red-700 hover:bg-red-100'
      case 'cancelled':
        return 'bg-slate-100 text-slate-700 hover:bg-slate-100'
      case 'refunded':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100'
      default:
        return 'bg-slate-100 text-slate-700 hover:bg-slate-100'
    }
  }

  return (
    <Card className="bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Оновлення платежів
              {hasNewUpdates && (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 animate-pulse">
                  {updates.length}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Real-time статуси через LiqPay webhook
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleNotifications}
              className={notificationsEnabled ? 'text-green-600' : 'text-slate-600'}
            >
              {notificationsEnabled ? (
                <Bell className="h-4 w-4" />
              ) : (
                <BellOff className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearUpdates}
              disabled={updates.length === 0}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Status Indicator */}
        <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-slate-50">
          <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
          <span className="text-sm font-medium">
            {isListening ? 'Активне прослуховування' : 'Прослуховування вимкнено'}
          </span>
          {notificationsEnabled && (
            <Badge variant="outline" className="text-xs">
              <Bell className="h-3 w-3 mr-1" />
              Сповіщення
            </Badge>
          )}
        </div>

        {/* Latest Update Highlight */}
        {latestUpdate && (
          <Card className="mb-4 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(latestUpdate.status)}
                  <div>
                    <div className="font-medium text-blue-900">
                      Останнє оновлення
                    </div>
                    <div className="text-sm text-blue-700">
                      Order: {latestUpdate.orderId}
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(latestUpdate.status)}>
                  {getStatusText(latestUpdate.status)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Updates List */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {updates.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Очікування оновлень платежів...</p>
              <p className="text-xs">Тестуйте webhook для перегляду оновлень</p>
            </div>
          ) : (
            updates.map((update, index) => (
              <div
                key={update.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                  index === 0 ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(update.status)}
                  <div>
                    <div className="font-medium text-slate-900 text-sm">
                      {update.orderId}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(update.timestamp).toLocaleString('uk-UA')}
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(update.status)}>
                  {getStatusText(update.status)}
                </Badge>
              </div>
            ))
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={isListening ? stopListening : startListening}
            className="flex-1"
          >
            {isListening ? (
              <>
                <BellOff className="h-4 w-4 mr-2" />
                Вимкнути
              </>
            ) : (
              <>
                <Bell className="h-4 w-4 mr-2" />
                Увімкнути
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearUpdates}
            disabled={updates.length === 0}
          >
            Очистити
          </Button>
        </div>

        {/* Info */}
        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <div className="text-xs text-slate-600 space-y-1">
            <div>• Автоматичне відстеження змін статусів платежів</div>
            <div>• Сповіщення в браузері про нові оновлення</div>
            <div>• Дані оновлюються через webhook від LiqPay</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
