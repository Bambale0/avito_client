import React from 'react'
import { Typography, Box, Paper, Grid } from '@mui/material'
import { Assessment } from '@mui/icons-material'

const StatsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <Assessment sx={{ mr: 2, verticalAlign: 'middle' }} />
        Статистика и аналитика
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Статистика и аналитика
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Здесь будут графики просмотров, контактов, конверсии и другие метрики.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default StatsPage
