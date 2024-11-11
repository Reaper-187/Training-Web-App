import React, {useContext} from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { BarChartContext } from '../../../WorkoutContext';
// Registrierung der Chart-Komponenten
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



export const BarChart = () => {
  
  const { dailyCalories } = useContext( BarChartContext );

  
  
  const data = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
      label: 'Burned Calories Weekly',
      data: [
        dailyCalories.Sun, 
        dailyCalories.Mon, 
        dailyCalories.Tue, 
        dailyCalories.Wed, 
        dailyCalories.Thu, 
        dailyCalories.Fri, 
        dailyCalories.Sat
      ],
      
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
