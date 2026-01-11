import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
} from '@mui/material'
import {
  AccountBalance,
  MonetizationOn,
  CreditCard,
} from '@mui/icons-material'
import { UserBalanceResponse } from '../../api/types'

interface BalanceCardProps {
  balance: UserBalanceResponse
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  const totalBalance = balance.real + balance.bonus

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <AccountBalance sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">
            Баланс кошелька
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Общий баланс */}
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" color="primary" fontWeight="bold">
            {totalBalance.toLocaleString()} ₽
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Общий баланс
          </Typography>
        </Box>

        {/* Детализация */}
        <Box display="flex" flexDirection="column" gap={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center">
              <MonetizationOn sx={{ mr: 1, color: 'success.main' }} />
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Реальный баланс
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Для оплаты услуг
                </Typography>
              </Box>
            </Box>
            <Chip
              label={`${balance.real.toLocaleString()} ₽`}
              color="success"
              variant="outlined"
            />
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center">
              <CreditCard sx={{ mr: 1, color: 'info.main' }} />
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Бонусный баланс
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Бонусы и скидки
                </Typography>
              </Box>
            </Box>
            <Chip
              label={`${balance.bonus.toLocaleString()} ₽`}
              color="info"
              variant="outlined"
            />
          </Box>
        </Box>

        {/* Предупреждение при низком балансе */}
        {balance.real < 100 && (
          <Box mt={2} p={1.5} bgcolor="warning.light" borderRadius={1}>
            <Typography variant="body2" color="warning.dark">
              ⚠️ Рекомендуется пополнить баланс для бесперебойной работы услуг
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default BalanceCard