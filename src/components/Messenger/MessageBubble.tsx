import React from 'react'
import {
  Box,
  Paper,
  Typography,
  Avatar,
} from '@mui/material'
import { Message } from '../../api/types'
import { messengerService } from '../../services/messengerService'

interface MessageBubbleProps {
  message: Message
  showAvatar?: boolean
  isFirstInGroup?: boolean
  isLastInGroup?: boolean
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  showAvatar = true,
  isFirstInGroup = false,
  isLastInGroup = false,
}) => {
  const isFromUser = message.from_user

  return (
    <Box
      sx={{
        display: 'flex',
        mb: 1,
        alignItems: 'flex-end',
        flexDirection: isFromUser ? 'row-reverse' : 'row',
      }}
    >
      {/* Аватар */}
      {showAvatar && (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: isFromUser ? 'primary.main' : 'grey.400',
            mr: isFromUser ? 0 : 1,
            ml: isFromUser ? 1 : 0,
            opacity: isFirstInGroup ? 1 : 0.7,
          }}
        >
          {isFromUser ? 'Я' : 'П'}
        </Avatar>
      )}

      {/* Сообщение */}
      <Box sx={{ maxWidth: '70%', minWidth: showAvatar ? 'auto' : '0' }}>
        <Paper
          elevation={1}
          sx={{
            p: 1.5,
            bgcolor: isFromUser ? 'primary.main' : 'grey.100',
            color: isFromUser ? 'primary.contrastText' : 'text.primary',
            borderRadius: isFromUser
              ? (isFirstInGroup && isLastInGroup ? '18px' :
                 isFirstInGroup ? '18px 18px 4px 18px' :
                 isLastInGroup ? '18px 4px 18px 18px' : '4px 4px 18px 18px')
              : (isFirstInGroup && isLastInGroup ? '18px' :
                 isFirstInGroup ? '18px 18px 18px 4px' :
                 isLastInGroup ? '4px 18px 18px 18px' : '18px 18px 4px 4px'),
            position: 'relative',
          }}
        >
          {/* Изображение */}
          {message.image_url && (
            <Box sx={{ mb: message.text ? 1 : 0 }}>
              <img
                src={message.image_url}
                alt="Изображение"
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  borderRadius: '8px',
                  display: 'block',
                }}
              />
            </Box>
          )}

          {/* Текст сообщения */}
          {message.text && (
            <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>
              {message.text}
            </Typography>
          )}

          {/* Время */}
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 0.5,
              opacity: 0.7,
              fontSize: '0.65rem',
              textAlign: isFromUser ? 'left' : 'right',
            }}
          >
            {messengerService.formatMessageTime(message.timestamp)}
          </Typography>
        </Paper>
      </Box>
    </Box>
  )
}

export default MessageBubble