import { apiClient } from '../api/client'
import {
  Chat,
  Message,
  SendMessageRequest,
  SendImageMessageRequest,
  ChatsResponse,
  MessagesResponse,
  MessageResponse,
} from '../api/types'

export class MessengerService {
  // Получение списка чатов
  async getChats(limit: number = 100, offset: number = 0, unreadOnly: boolean = false): Promise<ChatsResponse> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      unread_only: unreadOnly.toString(),
    })

    return apiClient.get<ChatsResponse>(`/chats?${params}`)
  }

  // Получение сообщений чата
  async getChatMessages(chatId: string, limit: number = 100, offset: number = 0): Promise<MessagesResponse> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    })

    return apiClient.get<MessagesResponse>(`/chats/${chatId}/messages?${params}`)
  }

  // Отправка текстового сообщения
  async sendMessage(request: SendMessageRequest): Promise<MessageResponse> {
    return apiClient.post<MessageResponse>('/messages', request)
  }

  // Отправка сообщения с изображением
  async sendImageMessage(request: SendImageMessageRequest): Promise<MessageResponse> {
    return apiClient.post<MessageResponse>('/messages/image', request)
  }

  // Загрузка изображения
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append('file', file)

    return apiClient.post<{ url: string }>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  // Отметить чат как прочитанный
  async markChatAsRead(chatId: string): Promise<void> {
    await apiClient.post(`/chats/${chatId}/read`)
  }

  // Вспомогательные методы

  // Форматирование времени сообщения
  formatMessageTime(timestamp: string): string {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = diffInMs / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      })
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString('ru-RU', {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      })
    }
  }

  // Группировка сообщений по датам
  groupMessagesByDate(messages: Message[]): { date: string; messages: Message[] }[] {
    const groups: { [key: string]: Message[] } = {}

    messages.forEach(message => {
      const date = new Date(message.timestamp).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })

    return Object.entries(groups)
      .map(([date, messages]) => ({
        date,
        messages: messages.sort((a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        ),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  // Получение количества непрочитанных сообщений
  getTotalUnreadCount(chats: Chat[]): number {
    return chats.reduce((total, chat) => total + chat.unread_count, 0)
  }
}

export const messengerService = new MessengerService()