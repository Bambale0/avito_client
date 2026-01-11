import { apiClient } from '../api/client'
import { WebhookSubscriptionRequest } from '../api/types'

export class SettingsService {
  // Подписка на webhook уведомления
  async subscribeWebhook(request: WebhookSubscriptionRequest): Promise<void> {
    await apiClient.post('/webhooks/subscribe', request)
  }

  // Отписка от webhook уведомлений
  async unsubscribeWebhook(request: WebhookSubscriptionRequest): Promise<void> {
    await apiClient.post('/webhooks/unsubscribe', request)
  }

  // Получение системной информации
  async getSystemInfo(): Promise<{
    version: string
    uptime: number
    environment: string
  }> {
    // Имитация системной информации
    return {
      version: '1.0.0',
      uptime: Date.now(),
      environment: 'production',
    }
  }

  // Валидация webhook URL
  validateWebhookUrl(url: string): { isValid: boolean; error?: string } {
    try {
      const urlObj = new URL(url)

      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return { isValid: false, error: 'URL должен использовать HTTP или HTTPS протокол' }
      }

      return { isValid: true }
    } catch (error) {
      return { isValid: false, error: 'Некорректный URL формат' }
    }
  }

  // Получение настроек уведомлений (локальные)
  getNotificationSettings(): {
    email: boolean
    push: boolean
    sms: boolean
  } {
    const settings = localStorage.getItem('notification_settings')
    if (settings) {
      return JSON.parse(settings)
    }

    return {
      email: true,
      push: true,
      sms: false,
    }
  }

  // Сохранение настроек уведомлений
  saveNotificationSettings(settings: {
    email: boolean
    push: boolean
    sms: boolean
  }): void {
    localStorage.setItem('notification_settings', JSON.stringify(settings))
  }

  // Получение темы приложения (локальные настройки)
  getThemeSettings(): {
    mode: 'light' | 'dark' | 'auto'
    primaryColor: string
  } {
    const settings = localStorage.getItem('theme_settings')
    if (settings) {
      return JSON.parse(settings)
    }

    return {
      mode: 'auto',
      primaryColor: '#1976d2',
    }
  }

  // Сохранение темы приложения
  saveThemeSettings(settings: {
    mode: 'light' | 'dark' | 'auto'
    primaryColor: string
  }): void {
    localStorage.setItem('theme_settings', JSON.stringify(settings))
  }

  // Получение настроек языка
  getLanguageSettings(): {
    language: string
    timezone: string
  } {
    const settings = localStorage.getItem('language_settings')
    if (settings) {
      return JSON.parse(settings)
    }

    return {
      language: 'ru',
      timezone: 'Europe/Moscow',
    }
  }

  // Сохранение настроек языка
  saveLanguageSettings(settings: {
    language: string
    timezone: string
  }): void {
    localStorage.setItem('language_settings', JSON.stringify(settings))
  }

  // Экспорт настроек
  exportSettings(): string {
    const settings = {
      notifications: this.getNotificationSettings(),
      theme: this.getThemeSettings(),
      language: this.getLanguageSettings(),
      exportedAt: new Date().toISOString(),
    }

    return JSON.stringify(settings, null, 2)
  }

  // Импорт настроек
  importSettings(settingsJson: string): { success: boolean; error?: string } {
    try {
      const settings = JSON.parse(settingsJson)

      if (settings.notifications) {
        this.saveNotificationSettings(settings.notifications)
      }
      if (settings.theme) {
        this.saveThemeSettings(settings.theme)
      }
      if (settings.language) {
        this.saveLanguageSettings(settings.language)
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Некорректный формат файла настроек' }
    }
  }

  // Сброс всех настроек
  resetSettings(): void {
    localStorage.removeItem('notification_settings')
    localStorage.removeItem('theme_settings')
    localStorage.removeItem('language_settings')
  }
}

export const settingsService = new SettingsService()