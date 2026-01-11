import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { Card, CardContent, Typography, Box } from '@mui/material'
import { ChartDataPoint } from '../../api/types'

interface StatsChartProps {
  data: ChartDataPoint[]
  title: string
  color?: string
  type?: 'line' | 'bar'
}

const StatsChart: React.FC<StatsChartProps> = ({
  data,
  title,
  color = '#1976d2',
  type = 'line',
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
    })
  }

  const formatTooltipValue = (value: number) => {
    return value.toLocaleString()
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #ccc',
            borderRadius: 1,
            p: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {formatDate(label)}
          </Typography>
          <Typography variant="body2" sx={{ color }}>
            {title}: {formatTooltipValue(payload[0].value)}
          </Typography>
        </Box>
      )
    }
    return null
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Нет данных для отображения
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            {type === 'line' ? (
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  fontSize={12}
                />
                <YAxis
                  tickFormatter={formatTooltipValue}
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  dot={{ fill: color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            ) : (
              <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  fontSize={12}
                />
                <YAxis
                  tickFormatter={formatTooltipValue}
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill={color} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}

export default StatsChart