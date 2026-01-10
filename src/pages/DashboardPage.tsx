import React from 'react'
import { Typography, Box, Paper, Grid } from '@mui/material'
import { Dashboard } from '@mui/icons-material'

const DashboardPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <Dashboard sx={{ mr: 2, verticalAlign: 'middle' }} />
        Дашборд Avito API
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Добро пожаловать в Avito API Client
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Здесь будут отображаться метрики, графики и статистика ваших объявлений.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardPage
