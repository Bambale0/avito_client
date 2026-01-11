import React from 'react'
import { TextField, Box, Typography } from '@mui/material'

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  const today = new Date().toISOString().split('T')[0]

  return (
    <Box display="flex" alignItems="center" gap={2} mb={3}>
      <Typography variant="body1" sx={{ minWidth: 'fit-content' }}>
        Период:
      </Typography>
      <TextField
        type="date"
        label="Дата начала"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          max: today,
        }}
        size="small"
      />
      <Typography variant="body1">-</Typography>
      <TextField
        type="date"
        label="Дата окончания"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          max: today,
        }}
        size="small"
      />
    </Box>
  )
}

export default DateRangePicker