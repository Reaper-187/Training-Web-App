import { createContext, useState, useEffect } from 'react';
// import socket from "./socket";
import axios from 'axios'



const APP_URL = import.meta.env.VITE_API_URL

export const WorkoutContext = createContext();


export const WorkoutProvider = ({ children }) => {
  const [selectWorkouts, setSelectWorkouts] = useState([]);


  const addWorkout = (workout) => {
    console.log("Workout wird hinzugefügt:", workout);
    axios.post(APP_URL, workout)
      .then(() => {
        console.log("Workout erfolgreich gespeichert.");
        setSelectWorkouts((prevWorkouts) => {
          console.log("Aktuelle Workouts vor Update:", prevWorkouts);
          return [...prevWorkouts, workout];
        });
      })
      .catch((err) => {
        console.error("Fehler beim Hinzufügen des Workouts:", err);
      });
  };


  return (
    <WorkoutContext.Provider value={{ selectWorkouts, setSelectWorkouts, addWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};


export const CaloriesContext = createContext()

export const CaloriesProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);

  const [totalCalories, setTotalCalories] = useState(0);

  // const resetCalories = new Date().getDay()

  // useEffect(() => {
  //     if (resetCalories === 1) {
  //       totalCalories = 0
  //     }
  //   }, [resetCalories]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get(APP_URL);
        const data = response.data;
        setWorkouts(data);
        // Summe der Kalorien berechnen
        const total = data.reduce((sum, workout) => sum + workout.calories, 0);        
        setTotalCalories(total);
      } catch (error) {
        console.error('Fehler beim Abrufen der Workouts:', error);
      }
    };
    fetchWorkouts();
  }, [workouts]);

  return (
    <CaloriesContext.Provider value={{workouts, totalCalories }}>
      {children}
    </CaloriesContext.Provider>
  );
};


export const BarChartContext = createContext();

export const BarChartProvider = ({ children }) => {

  const [dailyCalories, setDailyCalories] = useState({
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0
  });

  const getCurrentDay = () => {
    const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const creatWorkoutDay = new Date().getDay(); //Wochentag wird hier ermittelt von 0 bis 6
    return week[creatWorkoutDay]; //mit Week wird der Wochentag in Tagesnamen übersetzt
  }


  const increaseBarCaloriesForDay = (cal) => {
    setDailyCalories((prevCalories) => {
      const day = getCurrentDay();
      const updatedCalories = { ...prevCalories };
      updatedCalories[day] = (updatedCalories[day] || 0) + cal;
      console.log('Increase der BARCHART Funktioniert wie es soll', updatedCalories); // Debug-Ausgabe
      return updatedCalories;
    });
  };

  const decreaseBarCaloriesForDay = (cal) => {
    setDailyCalories((prevCalories) => {
      const day = getCurrentDay();
      if (prevCalories[day] >= cal) {
        const updatedCalories = { ...prevCalories };
        updatedCalories[day] -= cal;
        console.log('deIncrease der BARCHART Funktioniert wie es soll', updatedCalories); // Debug-Ausgabe
        return updatedCalories;
      } else {
        return prevCalories;
      }
    });
  };

  return (
    <BarChartContext.Provider value={{ dailyCalories, setDailyCalories, increaseBarCaloriesForDay, decreaseBarCaloriesForDay }}>
      {children}
    </BarChartContext.Provider>
  )
}


