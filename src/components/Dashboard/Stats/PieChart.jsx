import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { PieCountContext } from '../../../WorkoutContext';
import axios from 'axios'
ChartJS.register(ArcElement, Tooltip, Legend);
import socket from "../../../socket";


const APP_URL = import.meta.env.VITE_API_URL


export const PieChart = () => {


  useEffect(() => {
    // Verbindungsnachricht empfangen
    socket.on("connect",() => {
      console.log("Mit dem Server verbunden:", socket.id);
    });
    
    socket.on("updatedWithSocket",updatedPieCount => {
      setNewPieCount(updatedPieCount);
    });

    // Verbindung schließen
    return () => {
      socket.disconnect();
    };
  }, []);

  const initialPieCount = {
    Chest: 0,
    Legs: 0,
    Shoulders: 0,
    Back: 0,
    Biceps: 0,
    Triceps: 0,
    Booty: 0,
    Abs: 0,
    Cardio: 0,
  }
  
  const [newPieCount, setNewPieCount] = useState(initialPieCount)

  const currentDate = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    const getDataForPieChart = async () => {
      try {
        const response = await axios.get(APP_URL);
        const workoutsForCurrentDay = response.data.filter((filteredPieData) => filteredPieData.date.slice(0, 10) == currentDate)
        const updatedPieCount = { ...newPieCount };
          workoutsForCurrentDay.forEach((findTypeOfTrain) => {
              const key = findTypeOfTrain.name || "Cardio";
              updatedPieCount[key] += 1;
          });
          setNewPieCount(updatedPieCount);
          socket.emit('updatePieSocket', updatedPieCount)
      } catch (err) {
        console.error("GET-Piechart-Data not found", err);
      }
    };
  
    getDataForPieChart();
  }, []);


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
      <Pie key={JSON.stringify(data)} data={data} options={options} />
    </div>
  );
};
