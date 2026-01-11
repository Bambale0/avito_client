// Re-export types from generated OpenAPI spec
export type {
  components,
  operations,
  paths
} from './generated-types'

// Import for internal use
import type { components } from './generated-types'

// Specific type exports for easier use
export type CallsStatsRequest = components['schemas']['CallsStatsRequest']
export type CallsStatsResponse = components['schemas']['CallsStatsResponse']
export type ItemsStatsRequest = components['schemas']['ItemsStatsRequest']
export type ItemsStatsResponse = components['schemas']['ItemsStatsResponse']
export type ProfileStatsRequest = components['schemas']['ProfileStatsRequest']
export type ProfileStatsResponse = components['schemas']['ProfileStatsResponse']
export type UserOperationsHistoryRequest = components['schemas']['UserOperationsHistoryRequest']
export type UserOperationsHistoryResponse = components['schemas']['UserOperationsHistoryResponse']
export type UserBalanceResponse = components['schemas']['UserBalanceResponse']

export interface ItemInfoResponse {
  autoload_item_id?: string | null
  finish_time?: string | null
  start_time?: string | null
  status: string
  url: string
  vas: VasInfo[]
}
export type VasInfo = components['schemas']['VasInfo']
export type ItemVasPricesResponse = components['schemas']['ItemVasPricesResponse']
export type StickerInfo = components['schemas']['StickerInfo']
export type VasPricesRequest = components['schemas']['VasPricesRequest']
export type ApplyVasRequest = components['schemas']['ApplyVasRequest']
export type ApplyVasResponse = components['schemas']['ApplyVasResponse']
export type UpdatePriceRequest = components['schemas']['UpdatePriceRequest']
export type UpdatePriceResponse = components['schemas']['UpdatePriceResponse']

export interface AutoloadFeed {
  url: string
  format: string
  category: string
  enabled: boolean
}

export interface AutoloadSchedule {
  // Define based on usage, assuming it's flexible
  [key: string]: any
}

export interface AutoloadProfileRequest {
  agreement?: boolean | null
  autoload_enabled: boolean
  feeds_data: AutoloadFeed[]
  report_email: string
  schedule: AutoloadSchedule[]
}

export interface AutoloadProfileResponse {
  autoload_enabled: boolean
  feeds_data: AutoloadFeed[]
  report_email: string
  schedule: AutoloadSchedule[]
}
export type AutoloadReportsResponse = components['schemas']['AutoloadReportsResponse']
export type AutoloadReportResponse = components['schemas']['AutoloadReportResponse']
export type AutoloadItemsInfoResponse = components['schemas']['AutoloadItemsInfoResponse']
export type CategoriesTreeResponse = components['schemas']['CategoriesTreeResponse']
export type CategoryFieldsResponse = components['schemas']['CategoryFieldsResponse']

export type WebhookSubscriptionRequest = components['schemas']['WebhookSubscriptionRequest']
export type UserInfoResponse = components['schemas']['UserInfoResponse']

// Email types
export type EmailConfigRequest = components['schemas']['EmailConfigRequest']
export type EmailConfigResponse = components['schemas']['EmailConfigResponse']
export type SendEmailRequest = components['schemas']['SendEmailRequest']
export type ReceiveEmailResponse = components['schemas']['ReceiveEmailResponse']

// Chat and Message types are not fully specified in OpenAPI, using custom definitions
export interface Chat {
  id: string
  user_id: string
  username?: string
  avatar?: string
  last_message?: Message
  unread_count: number
  updated_at: string
}

export interface Message {
  id: string
  chat_id: string
  text: string
  from_user: boolean
  timestamp: string
  image_id?: string
  image_url?: string
}

export type SendMessageRequest = components['schemas']['SendMessageRequest']
export type SendImageMessageRequest = components['schemas']['SendImageMessageRequest']

// Override generated types with proper interfaces
export interface ChatsResponse {
  chats: Chat[]
}

export interface MessagesResponse {
  messages: Message[]
}

export type MessageResponse = components['schemas']['MessageResponse']

// Общие типы для графиков
export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export interface MetricData {
  label: string
  value: number
  change?: number
  changePercent?: number
}