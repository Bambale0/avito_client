import React, { useState, useEffect } from 'react'
import {
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Button,
  Chip,
} from '@mui/material'
import {
  Assessment,
  Visibility,
  Phone,
  AccountBalance,
  Refresh,
} from '@mui/icons-material'

import { statsService } from '../services/statsService'
import MetricCard from '../components/Stats/MetricCard'
import StatsChart from '../components/Stats/StatsChart'
import DateRangePicker from '../components/Stats/DateRangePicker'
import { ChartDataPoint, MetricData, UserBalanceResponse } from '../api/types'

interface StatsData {
  profileStats: any
  itemsStats?: any
  callsStats?: any
  balance: UserBalanceResponse
}

const StatsPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statsData, setStatsData] = useState<StatsData | null>(null)
  const [userId, setUserId] = useState<number | null>(null)

  // Даты по умолчанию - последние 30 дней
  const [startDate, setStartDate] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() - 30)
    return date.toISOString().split('T')[0]
  })

  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0]
  })

  // Загрузка данных статистики
  const loadStats = async () => {
    if (!userId) {
      // Сначала получаем информацию о пользователе
      try {
        setLoading(true)
        const userInfo = await statsService.getUserInfo()
        setUserId(userInfo.id)
      } catch (err) {
        setError('Не удалось получить информацию о пользователе')
        setLoading(false)
        return
      }
    }

    if (!userId) return

    try {
      setLoading(true)
      setError(null)

      const data = await statsService.getStatsForPeriod(
        userId,
        startDate,
        endDate
        // TODO: добавить itemIds если нужно фильтровать по конкретным объявлениям
      )

      setStatsData(data)
    } catch (err) {
      setError('Не удалось загрузить статистику')
      console.error('Stats loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Загрузка данных при изменении дат или при первой загрузке
  useEffect(() => {
    loadStats()
  }, [userId, startDate, endDate])

  // Преобразование данных для графиков
  const getChartData = (data: any): ChartDataPoint[] => {
    if (!data || !data.result) return []

    return statsService.transformToChartData(data.result)
  }

  // Расчет метрик
  const getMetrics = (): MetricData[] => {
    if (!statsData) return []

    const viewsData = getChartData(statsData.profileStats)
    const contactsData = getChartData(statsData.callsStats)

    // Простой расчет метрик (можно расширить)
    const totalViews = viewsData.reduce((sum, point) => sum + point.value, 0)
    const totalContacts = contactsData.reduce((sum, point) => sum + point.value, 0)

    return [
      {
        label: 'Просмотры',
        value: totalViews,
        change: Math.floor(totalViews * 0.1), // TODO: рассчитать реальное изменение
        changePercent: 10,
      },
      {
        label: 'Контакты',
        value: totalContacts,
        change: Math.floor(totalContacts * 0.15),
        changePercent: 15,
      },
      {
        label: 'Баланс (руб.)',
        value: statsData.balance.real + statsData.balance.bonus,
        change: 0,
        changePercent: 0,
      },
    ]
  }

  if (loading && !statsData) {
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
          <Assessment sx={{ mr: 2, verticalAlign: 'middle' }} />
          Статистика и аналитика
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadStats}
          disabled={loading}
        >
          Обновить
        </Button>
      </Box>

      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && statsData && (
        <Box display="flex" alignItems="center" mb={2}>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          <Typography variant="body2">Обновление данных...</Typography>
        </Box>
      )}

      {statsData && (
        <>
          {/* Метрики */}
          <Grid container spacing={3} mb={4}>
            {getMetrics().map((metric, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <MetricCard
                  metric={metric}
                  icon={
                    metric.label === 'Просмотры' ? <Visibility color="primary" /> :
                    metric.label === 'Контакты' ? <Phone color="secondary" /> :
                    <AccountBalance color="success" />
                  }
                />
              </Grid>
            ))}
          </Grid>

          {/* Графики */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StatsChart
                data={getChartData(statsData.profileStats)}
                title="Просмотры по дням"
                color="#1976d2"
                type="line"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <StatsChart
                data={getChartData(statsData.callsStats)}
                title="Звонки по дням"
                color="#dc004e"
                type="bar"
              />
            </Grid>

            {statsData.itemsStats && (
              <Grid item xs={12}>
                <StatsChart
                  data={getChartData(statsData.itemsStats)}
                  title="Статистика объявлений"
                  color="#2e7d32"
                  type="line"
                />
              </Grid>
            )}
          </Grid>

          {/* Дополнительная информация */}
          <Grid container spacing={3} mt={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Сводка
                  </Typography>
                  <Box display="flex" gap={2} flexWrap="wrap">
                    <Chip
                      label={`Реальный баланс: ${statsData.balance.real} руб.`}
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={`Бонусный баланс: ${statsData.balance.bonus} руб.`}
                      color="secondary"
                      variant="outlined"
                    />
                    <Chip
                      label={`Период: ${new Date(startDate).toLocaleDateString('ru-RU')} - ${new Date(endDate).toLocaleDateString('ru-RU')}`}
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  )
}

export default StatsPage