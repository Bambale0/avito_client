import { apiClient } from '../api/client'
import {
  CallsStatsRequest,
  CallsStatsResponse,
  ItemsStatsRequest,
  ItemsStatsResponse,
  ProfileStatsRequest,
  ProfileStatsResponse,
  UserOperationsHistoryRequest,
  UserOperationsHistoryResponse,
  UserBalanceResponse,
  UserInfoResponse,
  ChartDataPoint,
  MetricData,
} from '../api/types'

export class StatsService {
  // Получение статистики звонков
  async getCallsStats(request: CallsStatsRequest): Promise<CallsStatsResponse> {
    return apiClient.post<CallsStatsResponse>('/ads/calls/stats', request)
  }

  // Получение статистики по объявлениям
  async getItemsStats(request: ItemsStatsRequest): Promise<ItemsStatsResponse> {
    return apiClient.post<ItemsStatsResponse>('/ads/stats/items', request)
  }

  // Получение статистики по профилю
  async getProfileStats(request: ProfileStatsRequest): Promise<ProfileStatsResponse> {
    return apiClient.post<ProfileStatsResponse>('/ads/stats/profile', request)
  }

  // Получение истории операций пользователя
  async getUserOperationsHistory(request: UserOperationsHistoryRequest): Promise<UserOperationsHistoryResponse> {
    return apiClient.post<UserOperationsHistoryResponse>('/user/operations_history', request)
  }

  // Получение баланса пользователя
  async getUserBalance(userId: number): Promise<UserBalanceResponse> {
    return apiClient.get<UserBalanceResponse>(`/user/${userId}/balance`)
  }

  // Получение информации о пользователе
  async getUserInfo(): Promise<UserInfoResponse> {
    return apiClient.get<UserInfoResponse>('/user/self')
  }

  // Вспомогательные методы для обработки данных в формат графиков

  // Преобразование данных статистики в формат для графиков
  transformToChartData(data: Record<string, any>): ChartDataPoint[] {
    const chartData: ChartDataPoint[] = []

    for (const [date, values] of Object.entries(data)) {
      if (typeof values === 'object' && values !== null) {
        // Предполагаем, что values содержит числовые метрики
        const value = Object.values(values).reduce((sum: number, val) => {
          return sum + (typeof val === 'number' ? val : 0)
        }, 0)

        chartData.push({
          date,
          value,
        })
      }
    }

    return chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  // Расчет метрик с изменениями
  calculateMetrics(currentData: ChartDataPoint[], previousData: ChartDataPoint[]): MetricData[] {
    const currentTotal = currentData.reduce((sum, point) => sum + point.value, 0)
    const previousTotal = previousData.reduce((sum, point) => sum + point.value, 0)

    const change = currentTotal - previousTotal
    const changePercent = previousTotal > 0 ? (change / previousTotal) * 100 : 0

    return [
      {
        label: 'Просмотры',
        value: currentTotal,
        change,
        changePercent,
      },
      // Можно добавить другие метрики
    ]
  }

  // Получение данных за период
  async getStatsForPeriod(
    userId: number,
    dateFrom: string,
    dateTo: string,
    itemIds?: number[]
  ): Promise<{
    profileStats: ProfileStatsResponse
    itemsStats?: ItemsStatsResponse
    callsStats?: CallsStatsResponse
    balance: UserBalanceResponse
  }> {
    const profileRequest: ProfileStatsRequest = {
      dateFrom,
      dateTo,
      grouping: 'day',
      limit: 100,
      metrics: ['views', 'contacts', 'favorites'],
      offset: 0,
    }

    const [profileStats, balance] = await Promise.all([
      this.getProfileStats(profileRequest),
      this.getUserBalance(userId),
    ])

    let itemsStats: ItemsStatsResponse | undefined
    let callsStats: CallsStatsResponse | undefined

    if (itemIds && itemIds.length > 0) {
      const itemsRequest: ItemsStatsRequest = {
        dateFrom,
        dateTo,
        fields: ['views', 'contacts', 'favorites'],
        itemIds,
        periodGrouping: 'day',
      }

      const callsRequest: CallsStatsRequest = {
        dateFrom,
        dateTo,
        itemIds,
      }

      ;[itemsStats, callsStats] = await Promise.all([
        this.getItemsStats(itemsRequest),
        this.getCallsStats(callsRequest),
      ])
    }

    return {
      profileStats,
      itemsStats,
      callsStats,
      balance,
    }
  }

  // Получение сводной статистики для dashboard
  async getDashboardSummary(userId: number): Promise<{
    user: UserInfoResponse
    balance: UserBalanceResponse
    profileStats: ProfileStatsResponse
    operations: any[]
  }> {
    const today = new Date().toISOString().split('T')[0]
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const profileRequest: ProfileStatsRequest = {
      dateFrom: weekAgo,
      dateTo: today,
      grouping: 'day',
      limit: 10,
      metrics: ['views', 'contacts', 'favorites'],
      offset: 0,
    }

    const operationsRequest: any = {
      dateTimeFrom: `${weekAgo}T00:00:00`,
      dateTimeTo: `${today}T23:59:59`,
    }

    const [user, balance, profileStats, operations] = await Promise.all([
      this.getUserInfo(),
      this.getUserBalance(userId),
      this.getProfileStats(profileRequest),
      this.getUserOperationsHistory(operationsRequest).catch(() => ({ operations: [] })),
    ])

    return {
      user,
      balance,
      profileStats,
      operations: operations.operations || [],
    }
  }
}

export const statsService = new StatsService()