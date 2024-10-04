import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registrierung der Chart-Komponenten
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



export const BarChart = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
      label: 'calories per 100 kcal',
      data: [300,600,650,740,230,550,350],
      backgroundColor: 'lightblue',
      borderColor: 'black',
      borderWidth: 1,
      }
    ]
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Weekly CB',
      },
    },
  };
  

  return (
    <div>
      <Bar
      data = {data}
      options={options}
      />
    </div>
  )
}
