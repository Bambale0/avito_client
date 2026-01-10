import React from 'react'
import { Typography, Box, Paper, Grid } from '@mui/material'
import { Message } from '@mui/icons-material'

const MessengerPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <Message sx={{ mr: 2, verticalAlign: 'middle' }} />
        Мессенджер Avito
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Чат с покупателями
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Здесь будет список чатов, возможность отвечать на сообщения и управлять перепиской.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default MessengerPage
