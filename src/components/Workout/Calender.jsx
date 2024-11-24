import React from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export const Calender = (props) => {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Helper text example"
        disableFuture
        slotProps={{
          textField: {
            helperText: 'MM-DD-YYYY',
          },
        }}
        value={props.selectedDate}
        onChange={(date) => props.handleDateChange(date)}
        
      />
    </LocalizationProvider>
  )
}
