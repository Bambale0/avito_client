import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  Avatar,
  Divider,
  Chip,
  TextField,
} from '@mui/material'
import {
  Login as LoginIcon,
  AccountCircle,
  Security,
  Launch,
  Email,
  Lock,
} from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated, isLoading } = useAuth()
  const [error, setError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  // Перенаправление авторизованных пользователей
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/')
    }
  }, [isAuthenticated, isLoading, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login(formData.email, formData.password)
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Ошибка авторизации')
      console.error('Login error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

  const features = [
    {
      icon: <AccountCircle />,
      title: 'Управление объявлениями',
      description: 'Просмотр и редактирование ваших объявлений на Avito',
    },
    {
      icon: <Security />,
      title: 'Безопасность',
      description: 'Защищенное подключение с шифрованием данных',
    },
    {
      icon: <Launch />,
      title: 'Интеграция',
      description: 'Полная интеграция с API Avito для автоматизации',
    },
  ]

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        {/* Логотип и заголовок */}
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: 'primary.main',
            mx: 'auto',
            mb: 2,
          }}
        >
          <LoginIcon sx={{ fontSize: 40 }} />
        </Avatar>

        <Typography variant="h4" gutterBottom>
          Avito API Client
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Личный кабинет для управления вашими объявлениями и интеграциями
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Форма авторизации */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            required
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />

          <TextField
            fullWidth
            label="Пароль"
            type="password"
            value={formData.password}
            onChange={handleInputChange('password')}
            required
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: <Lock sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting || !formData.email || !formData.password}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <LoginIcon />}
            sx={{
              py: 1.5,
              px: 4,
              fontSize: '1.1rem',
              minWidth: 250,
            }}
          >
            {isSubmitting ? 'Вход...' : 'Войти'}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Chip label="Возможности" size="small" />
        </Divider>

        {/* Функции приложения */}
        <Box sx={{ textAlign: 'left' }}>
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                p: 2,
                borderRadius: 1,
                bgcolor: 'grey.50',
              }}
            >
              <Box sx={{ color: 'primary.main', mr: 2 }}>
                {feature.icon}
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Информация о безопасности */}
        <Box sx={{ textAlign: 'left', bgcolor: 'info.main', color: 'white', p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            🔒 Безопасность данных
          </Typography>
          <Typography variant="body2">
            Ваши данные защищены. Пароли передаются в зашифрованном виде
            и не хранятся в открытом виде на сервере.
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default LoginPage