import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Typography,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  ArrowBack,
  Person,
} from '@mui/icons-material'
import { Chat, Message } from '../../api/types'
import { messengerService } from '../../services/messengerService'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'

interface ChatWindowProps {
  chat: Chat | null
  onBack?: () => void
  onMessageSent?: () => void
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  onBack,
  onMessageSent,
}) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Загрузка сообщений чата
  const loadMessages = async (chatId: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await messengerService.getChatMessages(chatId, 50, 0)
      setMessages(response.messages)

      // Отмечаем чат как прочитанный
      if (chat?.unread_count && chat.unread_count > 0) {
        await messengerService.markChatAsRead(chatId)
      }
    } catch (err) {
      setError('Не удалось загрузить сообщения')
      console.error('Error loading messages:', err)
    } finally {
      setLoading(false)
    }
  }

  // Загрузка сообщений при выборе чата
  useEffect(() => {
    if (chat) {
      loadMessages(chat.id)
    } else {
      setMessages([])
    }
  }, [chat?.id])

  // Прокрутка к последнему сообщению
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Отправка сообщения
  const handleSendMessage = async (text: string, imageFile?: File) => {
    if (!chat) return

    try {
      setSending(true)
      setError(null)

      if (imageFile) {
        // Сначала загружаем изображение
        const uploadResponse = await messengerService.uploadImage(imageFile)
        // Затем отправляем сообщение с изображением
        await messengerService.sendImageMessage({
          chat_id: chat.id,
          image_id: uploadResponse.url, // Предполагаем, что API возвращает ID изображения
        })
      } else {
        // Отправляем текстовое сообщение
        await messengerService.sendMessage({
          chat_id: chat.id,
          message: text,
        })
      }

      // Перезагружаем сообщения
      await loadMessages(chat.id)
      onMessageSent?.()
    } catch (err) {
      setError('Не удалось отправить сообщение')
      console.error('Error sending message:', err)
      throw err
    } finally {
      setSending(false)
    }
  }

  // Группировка сообщений по отправителю
  const groupMessagesBySender = (messages: Message[]) => {
    const groups: Message[][] = []
    let currentGroup: Message[] = []

    messages.forEach((message) => {
      if (currentGroup.length === 0) {
        currentGroup.push(message)
      } else {
        const lastMessage = currentGroup[currentGroup.length - 1]
        const timeDiff = new Date(message.timestamp).getTime() - new Date(lastMessage.timestamp).getTime()
        const isSameSender = message.from_user === lastMessage.from_user

        if (isSameSender && timeDiff < 5 * 60 * 1000) { // 5 минут
          currentGroup.push(message)
        } else {
          groups.push(currentGroup)
          currentGroup = [message]
        }
      }
    })

    if (currentGroup.length > 0) {
      groups.push(currentGroup)
    }

    return groups
  }

  if (!chat) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Выберите чат для начала общения
        </Typography>
      </Box>
    )
  }

  const messageGroups = groupMessagesBySender(messages)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Заголовок чата */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          {onBack && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={onBack}
              sx={{ mr: 1 }}
            >
              <ArrowBack />
            </IconButton>
          )}

          <Avatar
            src={chat.avatar}
            sx={{ width: 40, height: 40, mr: 2, bgcolor: 'primary.main' }}
          >
            {chat.username ? chat.username.charAt(0).toUpperCase() : 'П'}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div">
              {chat.username || `Пользователь ${chat.user_id}`}
            </Typography>
            <Typography variant="caption" color="inherit" sx={{ opacity: 0.7 }}>
              {chat.unread_count > 0
                ? `${chat.unread_count} непрочитанных`
                : 'Активен'
              }
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Сообщения */}
      <Box
        ref={messagesContainerRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          bgcolor: 'grey.50',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading && messages.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Нет сообщений в этом чате
            </Typography>
          </Box>
        ) : (
          <>
            {messageGroups.map((group) => (
              <Box key={group[0]?.id || Math.random()} sx={{ mb: 2 }}>
                {group.map((message, messageIndex) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    showAvatar={messageIndex === 0}
                    isFirstInGroup={messageIndex === 0}
                    isLastInGroup={messageIndex === group.length - 1}
                  />
                ))}
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>

      <Divider />

      {/* Поле ввода */}
      <MessageInput
        onSendMessage={handleSendMessage}
        loading={sending}
        disabled={!chat}
      />
    </Box>
  )
}

export default ChatWindow