import React from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material'
import { TrendingUp, TrendingDown } from '@mui/icons-material'
import { MetricData } from '../../api/types'

interface MetricCardProps {
  metric: MetricData
  icon?: React.ReactNode
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, icon }) => {
  const isPositive = metric.changePercent ? metric.changePercent >= 0 : false
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          {icon && <Box mr={1}>{icon}</Box>}
          <Typography variant="h6" color="text.secondary">
            {metric.label}
          </Typography>
        </Box>

        <Typography variant="h4" component="div" gutterBottom>
          {metric.value.toLocaleString()}
        </Typography>

        {metric.change !== undefined && metric.changePercent !== undefined && (
          <Box display="flex" alignItems="center">
            <TrendIcon
              sx={{
                mr: 0.5,
                color: isPositive ? 'success.main' : 'error.main',
                fontSize: '1rem',
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: isPositive ? 'success.main' : 'error.main',
                fontWeight: 'medium',
              }}
            >
              {isPositive ? '+' : ''}
              {metric.changePercent.toFixed(1)}% с прошлого периода
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default MetricCard