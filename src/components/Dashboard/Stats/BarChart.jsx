import React, { useContext, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { CaloriesContext } from '../../../WorkoutContext';



// Registrierung der Chart-Komponenten
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const BarChart = () => {

  const [apiDataLoaded, setApiDataLoaded] = useState(false);
  
  const { workouts } = useContext(CaloriesContext);

  const [formattedData, setFormattedData] = useState({
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  });
  
  // Workouts zu Kalorien-Daten aggregieren
  useEffect(() => {
    const caloriesByDay = workouts.reduce((acc, workout) => {
      const day = new Date(workout.date).toLocaleString("en-US", { weekday: "short" });
      acc[day] = (acc[day] || 0) + workout.calories;
      setApiDataLoaded(true);
      return acc;
    }, {});

    setFormattedData((prevData) => ({
      ...prevData,
      ...caloriesByDay,
    }));
  }, [workouts]);


  // BarchartReset
  const isNewWeek = new Date().getDay()

  const [hasBarchartReset, setHasBarchartReset] = useState(() => {
    //muss in Localstorage gespeichert werden weil => wenn Seite neu geladen wird, wird der State Auto. resetet
    const storedValue = localStorage.getItem("hasBarchartReset");
    return storedValue ? JSON.parse(storedValue) : false;
  });

  useEffect(() => {
    if (apiDataLoaded && !hasBarchartReset && isNewWeek === 1) {
      setFormattedData((prevData) =>
        Object.keys(prevData).reduce((newData, key) => {
          newData[key] = 0;
          return newData;
        }, {})
      );
      setHasBarchartReset(true);
      localStorage.setItem("hasBarchartReset", JSON.stringify(true));
    }
    
    if (isNewWeek === 0) {
      setHasBarchartReset(false);
      localStorage.setItem("hasBarchartReset", JSON.stringify(false));
    }
  }, [apiDataLoaded, isNewWeek, hasBarchartReset]);





  const data = {

  // labels: ['0',   '1',   '2',   '3',   '4',   '5',   '6'],
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',],
    datasets: [
      {
        label: 'Burned Calories',
        data: [
          formattedData.Sun,
          formattedData.Mon,
          formattedData.Tue,
          formattedData.Wed,
          formattedData.Thu,
          formattedData.Fri,
          formattedData.Sat,
        ],
        backgroundColor: '#297AE3',
        borderColor: 'black',
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
        className='chart bar-chart'
        data={data}
        options={options}
      />
    </div>
  )
}
