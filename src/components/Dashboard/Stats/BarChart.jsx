import React, { useContext, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { CaloriesContext } from '../../../WorkoutContext';
import { getISOWeek } from '../../utils/dateUtils'
import annotationPlugin from "chartjs-plugin-annotation";


// Registrierung der Chart-Komponenten
ChartJS.register(CategoryScale, LinearScale, BarElement, annotationPlugin, Title, Tooltip, Legend);

export const BarChart = () => {

  const [apiDataLoaded, setApiDataLoaded] = useState(false);

  const { workouts, currentWeek } = useContext(CaloriesContext);

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

  const today = new Date().toISOString().split("T")[0];

  const [lastBarchartReset, setLastBarchartReset] = useState(() => {
    return localStorage.getItem("lastBarchartReset") || today;
  });


  const lastResetWeek = getISOWeek(lastBarchartReset);
  
  useEffect(() => {
    if (apiDataLoaded && currentWeek !== lastResetWeek) {
      setFormattedData((prevData) =>
        Object.keys(prevData).reduce((newData, key) => {
          newData[key] = 0;
          return newData;
        }, {})
      );
  
      setLastBarchartReset(today);
      localStorage.setItem("lastBarchartReset", today);
    }
  }, [apiDataLoaded, lastBarchartReset]);




  const initialTarget = 1000;

  const [currentTarget, setCurrentTarget] = useState(
    () => Number(localStorage.getItem("targetCalories")) || initialTarget
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editOrSave, setEditOrSave] = useState("Current");

  useEffect(() => {
    localStorage.setItem("targetCalories", currentTarget);
  }, [currentTarget]);

  const handleCaloriesTarget = () => {
    setIsEditing(true);
    setEditOrSave("Save");
  };

  const handleInputChange = (event) => {
    setCurrentTarget(event.target.value);
  };

  const handleBlur = () => {
    if (currentTarget === "") {
      setCurrentTarget(initialTarget);
    }
    setIsEditing(false);
    setEditOrSave("Current");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleBlur();
    } else if (event.key === "Escape") {
      setIsEditing(false);
      setEditOrSave("Current");
      setCurrentTarget(Number(localStorage.getItem("targetCalories")) || initialTarget);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      annotation: {
        annotations: {
          targetLine: {
            type: "line",
            yMin: currentTarget,
            yMax: currentTarget,
            borderColor: "green",
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              content: `Ziel: ${currentTarget} kcal`,
              enabled: true,
              position: "end",
              backgroundColor: "rgba(0, 128, 0, 0.8)",
            },
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Weekly CB" },
      },
    },
  };

  const data = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
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
        backgroundColor: (context) => {
          const value = context.raw;
          return value >= currentTarget ? "green" : '#297AE3';
        },
        borderColor: 'black',
        borderWidth: 1,
      }
    ]
  };

  return (
    <>
      <div>
        <button className='calories-target' onClick={handleCaloriesTarget}>
          {editOrSave} Target{" "}
          {isEditing ? (
            <input
              type="number"
              value={currentTarget}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
            currentTarget
          )}
        </button>
      </div>
      <div className='bar-chart-div'>
        <Bar
          className='chart bar-chart'
          data={data}
          options={options}
        />
      </div>
    </>
  )
}
