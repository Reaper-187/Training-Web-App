import React, { useContext, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { BarChartContext } from '../../../WorkoutContext';
import axios from 'axios'


// Registrierung der Chart-Komponenten
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const APP_URL = import.meta.env.VITE_API_URL


export const BarChart = () => {
  
  const { dailyCalories, setDailyCalories } = useContext( BarChartContext );  
  
  const [formattedData, setFormattedData] = useState({
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  });

  const [apiDataLoaded, setApiDataLoaded] = useState(false);
  
  useEffect(() => {
    const GetCaloiresData = async () => {
      try {
        const response = await axios.get(APP_URL);
        const caloriesForCurrentDay = response.data.map((dayToName) => ({
          ...dayToName,
          date: new Date(dayToName.date).toLocaleString("en-US", { weekday: "short" }),
        }));
        // console.log("Gefilterte Daten:", caloriesForCurrentDay);
        setDailyCalories(caloriesForCurrentDay);
        setApiDataLoaded(true);
      } catch (err) {
        console.error("GET-Calories-Data not found", err);
      }
    };
  
    GetCaloiresData();
  }, []);
  

  // rendert Calorienverbrauch für jeweiligen Wochen Tag in der Barchart
  useEffect(() => {
    if (dailyCalories.length > 0) {
      setFormattedData((prevData) => {
        const updatedData = { ...prevData };
  
        dailyCalories.forEach((entry) => {
          // Akkumulieren statt ersetzen
          updatedData[entry.date] = (updatedData[entry.date] || 0) + entry.calories;
        });
  
        console.log('Aktualisierte formattedData:', updatedData);
        return updatedData;
      });
    }
  }, [dailyCalories]);
  
  // const [hasBarchartReset, setHasBarchartReset] = useState()
  const [hasBarchartReset, setHasBarchartReset] = useState(() => {
    //muss in Localstorage gespeichert werden weil => wenn Seite neu geladen wird, wird der State Auto. resetet
    const storedValue = localStorage.getItem("hasBarchartReset");
    return storedValue ? JSON.parse(storedValue) : false;
  });
  
  
  // BarchartReset
  const isNewWeek = new Date().getDay()

  useEffect(() => {
    if (apiDataLoaded && !hasBarchartReset && isNewWeek === 1) {
      console.log("Reset Barchart");
      // wenn neue Woche true => Bachart wird zurückgesetzt
      setFormattedData((prevData) =>
        Object.keys(prevData).reduce((newData, key) => {
          newData[key] = 0;
          return newData;
        }, {})
      );
      setHasBarchartReset(true);
      localStorage.setItem("hasBarchartReset", JSON.stringify(true));
    }
  }, [apiDataLoaded, isNewWeek, hasBarchartReset]);


  useEffect(() => {
    // setHasBarchartReset wird wieder bei neuer Woche Aktiv für BarchartReset
    if (isNewWeek === 0) {
      setHasBarchartReset(false);
      localStorage.setItem("hasBarchartReset", JSON.stringify(false));
    }
  }, [isNewWeek]);


  console.log('Das ist die Summe der FormattedData',formattedData)

  const data = {
    
  // labels: ['0',   '1',   '2',   '3',   '4',   '5',   '6'],
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
        formattedData.Sat
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
