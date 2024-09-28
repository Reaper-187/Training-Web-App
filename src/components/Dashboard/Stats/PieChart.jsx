import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);




export const PieChart = () => {

  const data = {
    labels: ['Chest', 'Legs', 'Shoulders', 'Back', 'Biceps', 'Trieceps'],
    datasets: [
      {
        data:[2, 4, 6, 8, 10],
        backgroundColor: ['aqua', 'green','orangered','yellow','blue']
      }
    ]
  }

  const options = {

  }

  return (
    <div>
      <Pie
      data = {data}
      options={options}
      ></Pie>  
    </div>
  )
}

