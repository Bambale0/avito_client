import { apiClient } from '../api/client'
import {
  AutoloadProfileRequest,
  AutoloadProfileResponse,
  AutoloadReportsResponse,
  AutoloadReportResponse,
  AutoloadItemsInfoResponse,
  CategoriesTreeResponse,
  CategoryFieldsResponse,
} from '../api/types'

export class AutoloadService {
  // Получение профиля автозагрузки
  async getAutoloadProfile(): Promise<AutoloadProfileResponse> {
    return apiClient.get<AutoloadProfileResponse>('/autoload/profile')
  }

  // Создание/обновление профиля автозагрузки
  async updateAutoloadProfile(request: AutoloadProfileRequest): Promise<Record<string, any>> {
    return apiClient.post<Record<string, any>>('/autoload/profile', request)
  }

  // Получение списка отчетов автозагрузки
  async getAutoloadReports(params?: {
    per_page?: number
    page?: number
    date_from?: string
    date_to?: string
  }): Promise<AutoloadReportsResponse> {
    const searchParams = new URLSearchParams()
    if (params?.per_page) searchParams.set('per_page', params.per_page.toString())
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.date_from) searchParams.set('date_from', params.date_from)
    if (params?.date_to) searchParams.set('date_to', params.date_to)

    const query = searchParams.toString()
    return apiClient.get<AutoloadReportsResponse>(`/autoload/reports${query ? `?${query}` : ''}`)
  }

  // Получение отчета по ID
  async getAutoloadReport(reportId: number): Promise<AutoloadReportResponse> {
    return apiClient.get<AutoloadReportResponse>(`/autoload/reports/${reportId}`)
  }

  // Получение последнего завершенного отчета
  async getLastCompletedReport(): Promise<AutoloadReportResponse> {
    return apiClient.get<AutoloadReportResponse>('/autoload/reports/last')
  }

  // Получение информации по объявлениям автозагрузки
  async getAutoloadItemsInfo(itemIds: string): Promise<AutoloadItemsInfoResponse> {
    return apiClient.get<AutoloadItemsInfoResponse>(`/autoload/items?ad_ids=${itemIds}`)
  }

  // Запуск автозагрузки по URL
  async uploadAutoloadFeed(): Promise<void> {
    return apiClient.post<void>('/autoload/upload')
  }

  // Получение дерева категорий
  async getCategoriesTree(): Promise<CategoriesTreeResponse> {
    return apiClient.get<CategoriesTreeResponse>('/autoload/categories')
  }

  // Получение полей категории
  async getCategoryFields(nodeSlug: string): Promise<CategoryFieldsResponse> {
    return apiClient.get<CategoryFieldsResponse>(`/autoload/categories/${nodeSlug}/fields`)
  }

  // Вспомогательные методы

  // Получение статуса отчета
  getReportStatusInfo(status: string): { label: string; color: 'success' | 'warning' | 'error' | 'info' } {
    const statusMap = {
      'completed': { label: 'Завершен', color: 'success' as const },
      'running': { label: 'Выполняется', color: 'warning' as const },
      'failed': { label: 'Ошибка', color: 'error' as const },
      'pending': { label: 'Ожидает', color: 'info' as const },
    }

    return statusMap[status as keyof typeof statusMap] || { label: status, color: 'info' }
  }

  // Форматирование даты
  formatReportDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Расчет длительности выполнения
  calculateReportDuration(startedAt: string, finishedAt?: string): string {
    const start = new Date(startedAt)
    const end = finishedAt ? new Date(finishedAt) : new Date()
    const durationMs = end.getTime() - start.getTime()

    const minutes = Math.floor(durationMs / (1000 * 60))
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000)

    if (minutes > 0) {
      return `${minutes} мин ${seconds} сек`
    }
    return `${seconds} сек`
  }

  // Получение статистики из отчета
  extractReportStats(report: AutoloadReportResponse): {
    totalItems: number
    processedItems: number
    errors: number
    fees: number
  } {
    const stats = {
      totalItems: 0,
      processedItems: 0,
      errors: 0,
      fees: 0,
    }

    // Извлекаем статистику из section_stats
    if (report.section_stats) {
      Object.values(report.section_stats).forEach((section: any) => {
        if (typeof section === 'object') {
          stats.totalItems += section.total || 0
          stats.processedItems += section.processed || 0
          stats.errors += section.errors || 0
        }
      })
    }

    // Извлекаем комиссии
    if (report.listing_fees) {
      Object.values(report.listing_fees).forEach((fee: any) => {
        if (typeof fee === 'number') {
          stats.fees += fee
        }
      })
    }

    return stats
  }

  // Создание примера профиля автозагрузки
  createSampleProfile(): AutoloadProfileRequest {
    return {
      autoload_enabled: false,
      feeds_data: [
        {
          url: 'https://example.com/feed.xml',
          format: 'avito',
          category: 'personal_items',
          enabled: true,
        },
      ],
      report_email: 'user@example.com',
      schedule: [
        {
          days: [1, 2, 3, 4, 5, 6, 7], // Все дни недели
          time: '09:00',
          timezone: 'Europe/Moscow',
        },
      ],
    }
  }
}

export const autoloadService = new AutoloadService()