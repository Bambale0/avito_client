import React from 'react'
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Badge,
  Box,
  Chip,
  Divider,
} from '@mui/material'
import { Chat } from '../../api/types'
import { messengerService } from '../../services/messengerService'

interface ChatListProps {
  chats: Chat[]
  selectedChatId?: string
  onChatSelect: (chat: Chat) => void
  loading?: boolean
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  selectedChatId,
  onChatSelect,
  loading = false,
}) => {
  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Загрузка чатов...
        </Typography>
      </Box>
    )
  }

  if (chats.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Нет активных чатов
        </Typography>
      </Box>
    )
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {chats.map((chat, index) => (
        <React.Fragment key={chat.id}>
          <ListItem
            button
            selected={selectedChatId === chat.id}
            onClick={() => onChatSelect(chat)}
            sx={{
              '&.Mui-selected': {
                bgcolor: 'action.selected',
              },
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemAvatar>
              <Badge
                color="error"
                badgeContent={chat.unread_count}
                invisible={chat.unread_count === 0}
              >
                <Avatar
                  src={chat.avatar}
                  sx={{ bgcolor: 'primary.main' }}
                >
                  {chat.username ? chat.username.charAt(0).toUpperCase() : 'П'}
                </Avatar>
              </Badge>
            </ListItemAvatar>

            <ListItemText
              primary={
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: chat.unread_count > 0 ? 'bold' : 'normal',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {chat.username || `Пользователь ${chat.user_id}`}
                  </Typography>
                  {chat.last_message && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: 1, flexShrink: 0 }}
                    >
                      {messengerService.formatMessageTime(chat.last_message.timestamp)}
                    </Typography>
                  )}
                </Box>
              }
              secondary={
                <Box>
                  {chat.last_message ? (
                    <Typography
                      variant="body2"
                      color={chat.unread_count > 0 ? 'text.primary' : 'text.secondary'}
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontWeight: chat.unread_count > 0 ? 'medium' : 'normal',
                      }}
                    >
                      {chat.last_message.text}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Нет сообщений
                    </Typography>
                  )}
                  {chat.unread_count > 0 && (
                    <Chip
                      label={chat.unread_count}
                      size="small"
                      color="primary"
                      sx={{ mt: 0.5, height: 18, fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              }
            />
          </ListItem>
          {index < chats.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  )
}

export default ChatList