import React, { useState, useEffect } from 'react'
import {
  Typography,
  Box,
  Grid,
  Alert,
  Button,
  CircularProgress,
} from '@mui/material'
import {
  Dashboard,
  Refresh,
  Message,
  Store,
  Assessment,
  Settings,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

import { statsService } from '../services/statsService'
import { messengerService } from '../services/messengerService'
import UserProfileCard from '../components/Dashboard/UserProfileCard'
import BalanceCard from '../components/Dashboard/BalanceCard'
import QuickStats from '../components/Dashboard/QuickStats'
import RecentActivity from '../components/Dashboard/RecentActivity'
import { UserInfoResponse, UserBalanceResponse, ProfileStatsResponse } from '../api/types'

interface DashboardData {
  user: UserInfoResponse
  balance: UserBalanceResponse
  profileStats: ProfileStatsResponse
  operations: any[]
  unreadChats: number
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<number | null>(null)

  // Загрузка данных dashboard
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Сначала получаем информацию о пользователе
      if (!userId) {
        const userInfo = await statsService.getUserInfo()
        setUserId(userInfo.id)
      }

      if (!userId) return

      // Загружаем все данные параллельно
      const [dashboardSummary, unreadCount] = await Promise.all([
        statsService.getDashboardSummary(userId),
        messengerService.getChats(1, 0, true).then(chats => chats.chats.length).catch(() => 0),
      ])

      setData({
        ...dashboardSummary,
        unreadChats: unreadCount,
      })
    } catch (err) {
      setError('Не удалось загрузить данные dashboard')
      console.error('Dashboard loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Загрузка данных при монтировании
  useEffect(() => {
    loadDashboardData()
  }, [userId])

  // Быстрые действия
  const quickActions = [
    {
      title: 'Мессенджер',
      description: 'Просмотр чатов и ответы на сообщения',
      icon: <Message />,
      path: '/messenger',
      badge: data?.unreadChats || 0,
      color: 'primary',
    },
    {
      title: 'Объявления',
      description: 'Управление объявлениями и услугами',
      icon: <Store />,
      path: '/ads',
      color: 'success',
    },
    {
      title: 'Статистика',
      description: 'Анализ просмотров и конверсии',
      icon: <Assessment />,
      path: '/stats',
      color: 'info',
    },
    {
      title: 'Настройки',
      description: 'Конфигурация аккаунта и API',
      icon: <Settings />,
      path: '/settings',
      color: 'warning',
    },
  ]

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          <Dashboard sx={{ mr: 2, verticalAlign: 'middle' }} />
          Дашборд Avito API
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadDashboardData}
          disabled={loading}
        >
          Обновить
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {data && (
        <>
          {/* Приветствие */}
          <Typography variant="h6" color="text.secondary" mb={3}>
            Добро пожаловать, {data.user.name}! Вот обзор вашей активности за последнюю неделю.
          </Typography>

          {/* Основные карточки */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={4}>
              <UserProfileCard user={data.user} />
            </Grid>
            <Grid item xs={12} md={4}>
              <BalanceCard balance={data.balance} />
            </Grid>
            <Grid item xs={12} md={4}>
              <RecentActivity operations={data.operations} />
            </Grid>
          </Grid>

          {/* Быстрые метрики */}
          <Box mb={4}>
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
              Ключевые метрики
            </Typography>
            <QuickStats stats={data.profileStats} />
          </Box>

          {/* Быстрые действия */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
              Быстрые действия
            </Typography>
            <Grid container spacing={3}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box
                    sx={{
                      p: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        boxShadow: 2,
                        borderColor: `${action.color}.main`,
                        bgcolor: `${action.color}.light`,
                        opacity: 0.9,
                      },
                    }}
                    onClick={() => navigate(action.path)}
                  >
                    <Box display="flex" alignItems="center" mb={1}>
                      <Box
                        sx={{
                          color: `${action.color}.main`,
                          mr: 1,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {action.icon}
                      </Box>
                      {action.badge && action.badge > 0 && (
                        <Box
                          sx={{
                            bgcolor: 'error.main',
                            color: 'white',
                            borderRadius: '50%',
                            width: 20,
                            height: 20,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                          }}
                        >
                          {action.badge}
                        </Box>
                      )}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {action.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {action.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
    </Box>
  )
}

export default DashboardPage