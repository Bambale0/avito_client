import { apiClient } from '../api/client'
import {
  EmailConfigResponse,
  EmailConfigRequest,
  SendEmailRequest,
  ReceiveEmailResponse,
} from '../api/types'

export class EmailService {
  // Получение всех email конфигураций
  async getEmailConfigs(): Promise<EmailConfigResponse[]> {
    return apiClient.get<EmailConfigResponse[]>('/email/configs')
  }

  // Получение email конфигурации пользователя
  async getUserEmailConfig(userId?: string): Promise<EmailConfigResponse> {
    const query = userId ? `?user_id=${userId}` : ''
    return apiClient.get<EmailConfigResponse>(`/dashboard/email/config${query}`)
  }

  // Создание email конфигурации
  async createEmailConfig(config: EmailConfigRequest): Promise<EmailConfigResponse> {
    return apiClient.post<EmailConfigResponse>('/email/config', config)
  }

  // Создание email конфигурации через dashboard
  async createUserEmailConfig(config: EmailConfigRequest, userId?: string): Promise<EmailConfigResponse> {
    const query = userId ? `?user_id=${userId}` : ''
    return apiClient.post<EmailConfigResponse>(`/dashboard/email/config${query}`, config)
  }

  // Обновление email конфигурации
  async updateEmailConfig(configId: string, config: EmailConfigRequest): Promise<EmailConfigResponse> {
    return apiClient.put<EmailConfigResponse>(`/email/config/${configId}`, config)
  }

  // Обновление email конфигурации через dashboard
  async updateUserEmailConfig(config: EmailConfigRequest, userId?: string): Promise<EmailConfigResponse> {
    const query = userId ? `?user_id=${userId}` : ''
    return apiClient.put<EmailConfigResponse>(`/dashboard/email/config${query}`, config)
  }

  // Получение email конфигурации по ID
  async getEmailConfig(userId: string): Promise<EmailConfigResponse> {
    return apiClient.get<EmailConfigResponse>(`/email/config/${userId}`)
  }

  // Удаление email конфигурации
  async deleteEmailConfig(userId: string): Promise<void> {
    return apiClient.delete(`/email/config/${userId}`)
  }

  // Отправка email
  async sendEmail(email: SendEmailRequest): Promise<{ message_id: string; status: string }> {
    return apiClient.post<{ message_id: string; status: string }>('/emails', email)
  }

  // Получение входящих email
  async receiveEmails(userId: string, limit: number = 10): Promise<ReceiveEmailResponse[]> {
    const query = `?user_id=${userId}&limit=${limit}`
    return apiClient.post<ReceiveEmailResponse[]>(`/emails/receive${query}`)
  }

  // Тестирование email конфигурации
  async testEmailConfig(userId?: string): Promise<{ status: string; message: string }> {
    const query = userId ? `?user_id=${userId}` : ''
    return apiClient.post<{ status: string; message: string }>(`/dashboard/email/test${query}`)
  }

  // Вспомогательные методы

  // Получение списка популярных email провайдеров
  getPopularProviders() {
    return [
      {
        name: 'Gmail',
        smtp: { host: 'smtp.gmail.com', port: 587, useTls: true, useSsl: false },
        imap: { host: 'imap.gmail.com', port: 993, useSsl: true },
      },
      {
        name: 'Yandex.Mail',
        smtp: { host: 'smtp.yandex.ru', port: 587, useTls: true, useSsl: false },
        imap: { host: 'imap.yandex.ru', port: 993, useSsl: true },
      },
      {
        name: 'Mail.ru',
        smtp: { host: 'smtp.mail.ru', port: 587, useTls: true, useSsl: false },
        imap: { host: 'imap.mail.ru', port: 993, useSsl: true },
      },
      {
        name: 'Outlook',
        smtp: { host: 'smtp-mail.outlook.com', port: 587, useTls: true, useSsl: false },
        imap: { host: 'outlook.office365.com', port: 993, useSsl: true },
      },
    ]
  }

  // Валидация email адреса
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Создание шаблона email конфигурации
  createConfigTemplate(provider: string, email: string, password: string): EmailConfigRequest {
    const providers = this.getPopularProviders()
    const selectedProvider = providers.find(p => p.name.toLowerCase() === provider.toLowerCase())

    if (!selectedProvider) {
      throw new Error(`Провайдер ${provider} не найден`)
    }

    return {
      user_id: 'current-user', // TODO: получить текущего пользователя
      smtp_host: selectedProvider.smtp.host,
      smtp_port: selectedProvider.smtp.port,
      smtp_username: email,
      smtp_password: password,
      smtp_use_tls: selectedProvider.smtp.useTls,
      smtp_use_ssl: selectedProvider.smtp.useSsl,
      email_from: email,
      imap_host: selectedProvider.imap.host,
      imap_port: selectedProvider.imap.port,
      imap_username: email,
      imap_password: password,
      imap_use_ssl: selectedProvider.imap.useSsl,
    }
  }

  // Форматирование размера файла
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Получение описания статуса
  getStatusDescription(status: string): string {
    const descriptions = {
      active: 'Конфигурация активна',
      inactive: 'Конфигурация отключена',
      error: 'Ошибка в конфигурации',
      testing: 'Проверка конфигурации...',
    }
    return descriptions[status as keyof typeof descriptions] || status
  }
}

export const emailService = new EmailService()