import React, { useEffect, useContext, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { WorkoutContext } from '../../../WorkoutContext';
import axios from 'axios'
ChartJS.register(ArcElement, Tooltip, Legend);

const APP_URL = import.meta.env.VITE_API_URL

export const PieChart = () => {

  const { selectWorkouts } = useContext(WorkoutContext);


  const [newPieCount, setNewPieCount] = useState({
    Chest: 0,
    Legs: 0,
    Shoulders: 0,
    Back: 0,
    Biceps: 0,
    Triceps: 0,
    Booty: 0,
    Abs: 0,
    Cardio: 0,
  });


  useEffect(() => {

    const getDataForPieChart = async () => {
      try {
        const response = await axios.get(APP_URL);

        const currentDate = new Date().toISOString().split('T')[0];

        // Filtere Workouts für den aktuellen Tag
        const workoutsForCurrentDay = response.data.eachWorkout.filter(
          (filteredPieData) => filteredPieData.date.split('T')[0] === currentDate
        );
        
        // Zähle die Workouts nach Typ
        const updatedPieCount = workoutsForCurrentDay.reduce((acc, findTypeOfTrain) => {
          const key = findTypeOfTrain.name || "Cardio";
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});
        
        console.log(updatedPieCount);
        
        
        setNewPieCount(updatedPieCount);
      } catch (err) {
        console.error("Fehler beim Abrufen der Pie-Chart-Daten:", err);
      }
    };
    getDataForPieChart();
  }, [selectWorkouts]); // Abhängig von `selectWorkouts`    

  const data = {
    labels: ['Chest', 'Legs', 'Shoulders', 'Back', 'Biceps', 'Triceps', 'Booty', 'Abs', 'Cardio'],
    datasets: [
      {
        data: [
          newPieCount.Chest,
          newPieCount.Legs,
          newPieCount.Shoulders,
          newPieCount.Back,
          newPieCount.Biceps,
          newPieCount.Triceps,
          newPieCount.Booty,
          newPieCount.Abs,
          newPieCount.Cardio,
        ],

        backgroundColor: ['aqua', 'green', 'orange', 'yellow', 'blue', 'lightgreen', 'purple', 'red', 'pink'],
      },
    ],
  };

  const options = {
    responsive: true, // Chart responsive machen
    // maintainAspectRatio: false,
  };
  return (
    <span>
      <Pie className='chart pie-chart' key={JSON.stringify(data)} data={data} options={options} />
    </span>
  );
};
