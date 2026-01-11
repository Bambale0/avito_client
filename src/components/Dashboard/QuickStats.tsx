import React from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material'
import {
  Visibility,
  Phone,
  Favorite,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material'
import { ProfileStatsResponse } from '../../api/types'

interface QuickStatsProps {
  stats: ProfileStatsResponse
}

const QuickStats: React.FC<QuickStatsProps> = ({ stats }) => {
  // Расчет общих метрик из статистики
  const calculateTotalMetrics = () => {
    if (!stats.result) return { views: 0, contacts: 0, favorites: 0 }

    let totalViews = 0
    let totalContacts = 0
    let totalFavorites = 0

    Object.values(stats.result).forEach((dayData: any) => {
      if (typeof dayData === 'object') {
        totalViews += dayData.views || 0
        totalContacts += dayData.contacts || 0
        totalFavorites += dayData.favorites || 0
      }
    })

    return { views: totalViews, contacts: totalContacts, favorites: totalFavorites }
  }

  const metrics = calculateTotalMetrics()

  // Расчет конверсии
  const conversionRate = metrics.views > 0 ? (metrics.contacts / metrics.views) * 100 : 0

  const statCards = [
    {
      title: 'Просмотры',
      value: metrics.views,
      icon: <Visibility sx={{ color: 'primary.main' }} />,
      color: 'primary.main',
      subtitle: 'За последние 7 дней',
    },
    {
      title: 'Контакты',
      value: metrics.contacts,
      icon: <Phone sx={{ color: 'success.main' }} />,
      color: 'success.main',
      subtitle: 'Звонки и сообщения',
    },
    {
      title: 'Избранное',
      value: metrics.favorites,
      icon: <Favorite sx={{ color: 'error.main' }} />,
      color: 'error.main',
      subtitle: 'Добавили в избранное',
    },
    {
      title: 'Конверсия',
      value: `${conversionRate.toFixed(1)}%`,
      icon: conversionRate >= 5 ? (
        <TrendingUp sx={{ color: 'success.main' }} />
      ) : (
        <TrendingDown sx={{ color: 'warning.main' }} />
      ),
      color: conversionRate >= 5 ? 'success.main' : 'warning.main',
      subtitle: 'Контакты/Просмотры',
      showProgress: true,
      progressValue: Math.min(conversionRate * 10, 100), // Масштабируем для progress bar
    },
  ]

  return (
    <Grid container spacing={3}>
      {statCards.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Box>
                  {stat.icon}
                </Box>
                <Typography variant="h4" sx={{ color: stat.color, fontWeight: 'bold' }}>
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </Typography>
              </Box>

              <Typography variant="h6" gutterBottom>
                {stat.title}
              </Typography>

              <Typography variant="body2" color="text.secondary" mb={stat.showProgress ? 1 : 0}>
                {stat.subtitle}
              </Typography>

              {stat.showProgress && (
                <Box mt={1}>
                  <LinearProgress
                    variant="determinate"
                    value={stat.progressValue}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: stat.color,
                        borderRadius: 3,
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {stat.progressValue.toFixed(1)}% от целевого показателя
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default QuickStats