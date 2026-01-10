import React from 'react'
import { Typography, Box, Paper, Grid } from '@mui/material'
import { Settings } from '@mui/icons-material'

const SettingsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <Settings sx={{ mr: 2, verticalAlign: 'middle' }} />
        Настройки
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Настройки приложения
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Здесь будут настройки API ключей, webhook'ов, уведомлений и другие параметры.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SettingsPage
