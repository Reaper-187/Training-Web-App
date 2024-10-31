import React, { useContext } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { PieCountContext } from '../../../WorkoutContext';
ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChart = () => {
  const { pieCount } = useContext(PieCountContext);

  const data = {
    labels: ['Chest', 'Legs', 'Shoulders', 'Back', 'Biceps', 'Triceps', 'Booty', 'Abs', 'Cardio'],
    datasets: [
      {
        data: [
          pieCount.Chest,
          pieCount.Legs,
          pieCount.Shoulders,
          pieCount.Back,
          pieCount.Biceps,
          pieCount.Triceps,
          pieCount.Booty,
          pieCount.Abs,
          pieCount.Cardio,
        ],
        backgroundColor: ['aqua', 'green', 'orange', 'yellow', 'blue', 'lightgreen', 'purple', 'red', 'pink'],
      },
    ],
  };

  const options = {};
  return (
    <div>
      {/* <button onClick={clearPieCountFromLocalStorage()}>Storage leeren</button> */}
      <Pie key={JSON.stringify(data)} data={data} options={options} />
    </div>
  );
};
