import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
} from '@mui/material'
import {
  History,
  ShoppingCart,
  Payment,
  Receipt,
  Build,
} from '@mui/icons-material'

interface RecentActivityProps {
  operations: any[]
}

const RecentActivity: React.FC<RecentActivityProps> = ({ operations }) => {
  const getOperationIcon = (operation: any) => {
    // Определяем тип операции по описанию или типу
    const description = operation.description?.toLowerCase() || ''
    const type = operation.type?.toLowerCase() || ''

    if (description.includes('оплата') || description.includes('платеж') || type.includes('payment')) {
      return <Payment sx={{ color: 'success.main' }} />
    }
    if (description.includes('услуга') || description.includes('вас') || type.includes('vas')) {
      return <Build sx={{ color: 'primary.main' }} />
    }
    if (description.includes('объявление') || description.includes('товар') || type.includes('item')) {
      return <ShoppingCart sx={{ color: 'info.main' }} />
    }

    return <Receipt sx={{ color: 'text.secondary' }} />
  }

  const getOperationColor = (operation: any) => {
    const amount = operation.amount || 0
    return amount > 0 ? 'success' : amount < 0 ? 'error' : 'default'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      })
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString('ru-RU', {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
      })
    }
  }

  const formatAmount = (amount: number) => {
    const sign = amount > 0 ? '+' : amount < 0 ? '-' : ''
    const absAmount = Math.abs(amount)
    return `${sign}${absAmount.toLocaleString()} ₽`
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <History sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">
            Последние операции
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {operations.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="body2" color="text.secondary">
              Нет операций за последние 7 дней
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%', p: 0 }}>
            {operations.slice(0, 10).map((operation, index) => (
              <React.Fragment key={operation.id || index}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'grey.100' }}>
                      {getOperationIcon(operation)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Typography variant="body2" sx={{ fontWeight: 'medium', pr: 1 }}>
                          {operation.description || 'Операция'}
                        </Typography>
                        <Chip
                          label={formatAmount(operation.amount || 0)}
                          size="small"
                          color={getOperationColor(operation)}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(operation.created_at || operation.timestamp)}
                        </Typography>
                        {operation.item_id && (
                          <Typography variant="caption" color="text.secondary">
                            Объявление #{operation.item_id}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                {index < operations.slice(0, 10).length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        )}

        {operations.length > 10 && (
          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="text.secondary">
              И ещё {operations.length - 10} операций...
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default RecentActivity