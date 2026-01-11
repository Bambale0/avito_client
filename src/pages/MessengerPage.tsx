import React, { useState, useEffect } from 'react'
import {
  Typography,
  Box,
  Paper,
  Drawer,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Button,
} from '@mui/material'
import {
  Menu,
  Refresh,
  Chat as ChatIcon,
} from '@mui/icons-material'

import { Chat } from '../api/types'
import { messengerService } from '../services/messengerService'
import ChatList from '../components/Messenger/ChatList'
import ChatWindow from '../components/Messenger/ChatWindow'

const DRAWER_WIDTH = 320

const MessengerPage: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(!isMobile)
  const [totalUnread, setTotalUnread] = useState(0)

  // Загрузка списка чатов
  const loadChats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await messengerService.getChats(100, 0, false)
      setChats(response.chats)
      setTotalUnread(messengerService.getTotalUnreadCount(response.chats))
    } catch (err) {
      setError('Не удалось загрузить чаты')
      console.error('Error loading chats:', err)
    } finally {
      setLoading(false)
    }
  }

  // Загрузка чатов при монтировании
  useEffect(() => {
    loadChats()
  }, [])

  // Управление drawer на мобильных устройствах
  useEffect(() => {
    if (isMobile) {
      setDrawerOpen(false)
    } else {
      setDrawerOpen(true)
    }
  }, [isMobile])

  // Обработчик выбора чата
  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat)
    if (isMobile) {
      setDrawerOpen(false)
    }
  }

  // Обработчик отправки сообщения
  const handleMessageSent = () => {
    loadChats() // Обновляем список чатов для актуализации последнего сообщения
  }

  // Обработчик возврата к списку чатов (мобильные)
  const handleBackToChats = () => {
    setSelectedChat(null)
    setDrawerOpen(true)
  }

  const drawer = (
    <Box sx={{ width: DRAWER_WIDTH, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Заголовок */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            <ChatIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Чаты
          </Typography>
          <Button
            size="small"
            startIcon={<Refresh />}
            onClick={loadChats}
            disabled={loading}
          >
            Обновить
          </Button>
        </Box>
        {totalUnread > 0 && (
          <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
            {totalUnread} непрочитанных сообщений
          </Typography>
        )}
      </Box>

      {/* Список чатов */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <ChatList
          chats={chats}
          selectedChatId={selectedChat?.id}
          onChatSelect={handleChatSelect}
          loading={loading}
        />
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      {/* Drawer для списка чатов */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Основная область */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Мобильный AppBar */}
        {isMobile && (
          <AppBar position="static" elevation={1}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setDrawerOpen(true)}
                sx={{ mr: 2 }}
              >
                <Badge badgeContent={totalUnread} color="error">
                  <Menu />
                </Badge>
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {selectedChat
                  ? (selectedChat.username || `Пользователь ${selectedChat.user_id}`)
                  : 'Мессенджер Avito'
                }
              </Typography>
            </Toolbar>
          </AppBar>
        )}

        {/* Окно чата */}
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <ChatWindow
            chat={selectedChat}
            onBack={isMobile ? handleBackToChats : undefined}
            onMessageSent={handleMessageSent}
          />
        </Box>
      </Box>

      {/* Ошибка */}
      {error && (
        <Box sx={{ position: 'absolute', top: 80, right: 20, zIndex: 1000 }}>
          <Paper sx={{ p: 2, bgcolor: 'error.main', color: 'error.contrastText' }}>
            <Typography variant="body2">{error}</Typography>
          </Paper>
        </Box>
      )}
    </Box>
  )
}

export default MessengerPage