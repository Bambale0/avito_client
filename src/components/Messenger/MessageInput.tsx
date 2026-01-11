import React, { useState, useRef } from 'react'
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  CircularProgress,
  Typography,
} from '@mui/material'
import {
  Send,
  AttachFile,
  Close,
} from '@mui/icons-material'

interface MessageInputProps {
  onSendMessage: (text: string, imageFile?: File) => Promise<void>
  loading?: boolean
  disabled?: boolean
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  loading = false,
  disabled = false,
}) => {
  const [message, setMessage] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = async () => {
    if (!message.trim() && !selectedImage) return

    try {
      await onSendMessage(message.trim(), selectedImage || undefined)
      setMessage('')
      clearImage()
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('Файл слишком большой. Максимальный размер: 10MB')
        return
      }

      if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите изображение')
        return
      }

      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
      {/* Предварительный просмотр изображения */}
      {imagePreview && (
        <Box sx={{ mb: 2, position: 'relative', display: 'inline-block' }}>
          <img
            src={imagePreview}
            alt="Preview"
            style={{
              maxWidth: '200px',
              maxHeight: '150px',
              borderRadius: '8px',
              objectFit: 'cover',
            }}
          />
          <IconButton
            size="small"
            onClick={clearImage}
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Поле ввода */}
      <TextField
        fullWidth
        multiline
        maxRows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Введите сообщение..."
        disabled={disabled || loading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageSelect}
              />
              <IconButton
                onClick={openFileDialog}
                disabled={disabled || loading}
                color="primary"
              >
                <AttachFile />
              </IconButton>
              <IconButton
                onClick={handleSend}
                disabled={disabled || loading || (!message.trim() && !selectedImage)}
                color="primary"
              >
                {loading ? (
                  <CircularProgress size={20} />
                ) : (
                  <Send />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
          },
        }}
      />

      {/* Индикатор загрузки */}
      {loading && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Отправка сообщения...
        </Typography>
      )}
    </Box>
  )
}

export default MessageInput