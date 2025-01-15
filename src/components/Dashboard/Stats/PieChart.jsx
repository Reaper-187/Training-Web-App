import React, { useEffect, useContext, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { WorkoutContext } from '../../../WorkoutContext';
// import socket from "../../../socket";
import axios from 'axios'
ChartJS.register(ArcElement, Tooltip, Legend);
import  './Stats.css'

const APP_URL = import.meta.env.VITE_API_URL



export const PieChart = () => {
  
  const { selectWorkouts } = useContext(WorkoutContext);
  const currentDate = new Date().toISOString().slice(0, 10);
  
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
    
          console.log('Alle Workouts aus der API:', response.data);
    
          const workoutsForCurrentDay = response.data.filter(
            (filteredPieData) => filteredPieData.date.slice(0, 10) === currentDate
          );
    
          console.log('Gefilterte Workouts für heute:', workoutsForCurrentDay);
    
          const updatedPieCount = { ...newPieCount };
          workoutsForCurrentDay.forEach((findTypeOfTrain) => {
            console.log('Workout-Typ:', findTypeOfTrain.name);
    
            const key = findTypeOfTrain.name || "Cardio";
            updatedPieCount[key] += 1;
    
            console.log('Zwischenstand von updatedPieCount:', updatedPieCount);
          });
    
          setNewPieCount(updatedPieCount);
        } catch (err) {
          console.error("Fehler beim Abrufen der Pie-Chart-Daten:", err);
        }
      };
    
      getDataForPieChart();
    }, [selectWorkouts]); // Abhängig von `selectWorkouts`
    


  useEffect(() => {
    console.log('Neuer Pie-Count:', newPieCount);
  }, [newPieCount]);
  
  

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


  const options = {};
  return (
    <div>
      {/* <button onClick={clearPieCountFromLocalStorage()}>Storage leeren</button> */}
      <Pie className='chart pie-chart' key={JSON.stringify(data)} data={data} options={options}/>
    </div>
  );
};
