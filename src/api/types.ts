// Типы для статистики

export interface CallsStatsRequest {
  dateFrom: string
  dateTo: string
  itemIds?: number[] | null
}

export interface CallsStatsResponse {
  result: Record<string, any>
}

export interface ItemsStatsRequest {
  dateFrom: string
  dateTo: string
  fields: string[]
  itemIds: number[]
  periodGrouping?: string | null
}

export interface ItemsStatsResponse {
  result: Record<string, any>
}

export interface ProfileStatsRequest {
  dateFrom: string
  dateTo: string
  filter?: Record<string, any> | null
  grouping: string
  limit: number
  metrics: string[]
  offset: number
  sort?: Record<string, any> | null
}

export interface ProfileStatsResponse {
  result: Record<string, any>
}

export interface UserOperationsHistoryRequest {
  dateTimeFrom: string
  dateTimeTo: string
}

export interface UserOperationsHistoryResponse {
  operations: Record<string, any>[]
}

export interface UserBalanceResponse {
  bonus: number
  real: number
}

// Типы для объявлений

export interface ItemInfoResponse {
  autoload_item_id?: string | null
  finish_time?: string | null
  start_time?: string | null
  status: string
  url: string
  vas: VasInfo[]
}

export interface VasInfo {
  slug: string
  price: number
  priceOld?: number | null
}

export interface ItemVasPricesResponse {
  itemId: number
  vas: VasInfo[]
  stickers: StickerInfo[]
}

export interface StickerInfo {
  id: number
  title: string
  description: string
}

export interface VasPricesRequest {
  itemIds: number[]
}

export interface ApplyVasRequest {
  slugs: string[]
  stickers?: number[] | null
}

export interface ApplyVasResponse {
  operationIds: Record<string, any>
}

export interface UpdatePriceRequest {
  price: number
}

export interface UpdatePriceResponse {
  result: Record<string, any>
}

// Типы для автозагрузки

export interface AutoloadProfileRequest {
  agreement?: boolean | null
  autoload_enabled: boolean
  feeds_data: Record<string, any>[]
  report_email: string
  schedule: Record<string, any>[]
}

export interface AutoloadProfileResponse {
  autoload_enabled: boolean
  feeds_data: Record<string, any>[]
  report_email: string
  schedule: Record<string, any>[]
}

export interface AutoloadReportsResponse {
  meta: Record<string, any>
  reports: Record<string, any>[]
}

export interface AutoloadReportResponse {
  events: Record<string, any>[]
  feeds_urls: Record<string, any>[]
  finished_at: string
  listing_fees: Record<string, any>
  report_id: number
  section_stats: Record<string, any>
  source: string
  started_at: string
  status: string
}

export interface AutoloadItemsInfoResponse {
  items: Record<string, any>[]
}

export interface CategoriesTreeResponse {
  categories: Record<string, any>[]
}

export interface CategoryFieldsResponse {
  alert?: Record<string, any> | null
  fields: Record<string, any>[]
  node: Record<string, any>
}

// Типы для настроек

export interface WebhookSubscriptionRequest {
  url: string
}

export interface UserInfoResponse {
  email: string
  id: number
  name: string
  phone?: string | null
  phones: string[]
  profile_url: string
}

// Типы для мессенджера

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

export interface SendMessageRequest {
  chat_id: string
  message: string
}

export interface SendImageMessageRequest {
  chat_id: string
  image_id: string
}

export interface ChatsResponse {
  chats: Chat[]
}

export interface MessagesResponse {
  messages: Message[]
}

export interface MessageResponse {
  message_id: string
  status: string
}

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