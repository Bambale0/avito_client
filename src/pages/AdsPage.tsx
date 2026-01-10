import React from 'react'
import { Typography, Box, Paper, Grid } from '@mui/material'
import { Store } from '@mui/icons-material'

const AdsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <Store sx={{ mr: 2, verticalAlign: 'middle' }} />
        Управление объявлениями
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Управление объявлениями
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Здесь будет список объявлений, управление услугами продвижения и массовые операции.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdsPage
