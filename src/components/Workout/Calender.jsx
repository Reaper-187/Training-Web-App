import React from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import './Workout.css'


export const Calender = (props) => {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Helper text example"
        disableFuture
      
        sx={{
          backgroundColor: 'var(--primary-bg-color)',

          '& .MuiOutlinedInput-root': { // Das umrandete Input-Feld
            color: 'var(--text-color)',
            '& fieldset': { borderColor: 'var(--text-color)' }, // Standard Border
            '&:hover fieldset': { borderColor: 'var(--hover-border-color)' }, // Hover
            '&.Mui-focused fieldset': { borderColor: 'var(--focus-border-color)' } // Wenn es fokussiert ist
          }
        }}
        slotProps={{
          textField: {
            helperText: 'MM-DD-YYYY',
            className: "date-picker"
          },
        }}
        value={props.selectedDate}
        onChange={(date) => props.handleDateChange(date)}
        
      />
    </LocalizationProvider>
  )
}
