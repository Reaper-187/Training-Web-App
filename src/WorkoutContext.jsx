import { createContext, useState, useEffect, useContext } from 'react';
import { getISOWeek } from './components/utils/dateUtils';
import axios from 'axios';

const APP_URL = import.meta.env.VITE_API_URL;


export const CaloriesContext = createContext();
export const WorkoutContext = createContext();


export const CaloriesProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [caloriesBurnedPerDay, setCaloriesBurnedPerDay] = useState(0);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get(APP_URL);
      setWorkouts(response.data);
    } catch (error) {
      console.error("Fehler beim Abrufen der Workouts:", error);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);


  useEffect(() => { // Reset für die Calories per day
    const now = new Date();
    const millisecondsUntilMidnight =
      ((23 - now.getHours()) * 60 + (59 - now.getMinutes())) * 60 * 1000;

    const dailyResetTimeout = setTimeout(() => {
      setCaloriesBurnedPerDay(0);
      console.log("Tageskalorien zurückgesetzt!");
    }, millisecondsUntilMidnight);

    return () => clearTimeout(dailyResetTimeout);
  }, []);
  

  const today = new Date().toISOString().split("T")[0];
  const currentWeek = getISOWeek(today);

  const [lastCaloriesReset, setLastCaloriesReset] = useState(() => {
    return localStorage.getItem("lastCaloriesReset") || today;
  });

  const lastResetWeek = getISOWeek(lastCaloriesReset);

  useEffect(() => {
    if (currentWeek !== lastResetWeek) {
      setTotalCalories(0);
      localStorage.setItem("lastCaloriesReset", today);
      setLastCaloriesReset(today);
      console.log("Wochenkalorien zurückgesetzt!");
    }
  }, [currentWeek, lastResetWeek, today]);


  useEffect(() => {
    const total = workouts.reduce((sum, workout) => sum + workout.calories, 0);
    setTotalCalories(total);
    const today = new Date().toISOString().split("T")[0];
    const caloriesBurnedPerDay =
      workouts.filter((workout) => workout.date.split("T")[0] === today)
              .reduce((sum, workout) => sum + workout.calories, 0);
    setCaloriesBurnedPerDay(caloriesBurnedPerDay)
  })

  return (
    <CaloriesContext.Provider value={{ workouts, totalCalories, caloriesBurnedPerDay, fetchWorkouts,currentWeek }}>
      {children}
    </CaloriesContext.Provider>
  );
};


export const WorkoutProvider = ({ children }) => {
  const { fetchWorkouts } = useContext(CaloriesContext);

  const [selectWorkouts, setSelectWorkouts] = useState([]);

  const addWorkout = async (workout) => {
    try {
      await axios.post(APP_URL, workout);
      setSelectWorkouts((prevWorkouts) => {
        return [...prevWorkouts, workout];
      });
      fetchWorkouts();
    } catch (err) {
      console.error("Fehler beim Hinzufügen des Workouts:", err);
    }
  };

  return (
    <WorkoutContext.Provider value={{ selectWorkouts, setSelectWorkouts, addWorkout }}>
      {children}
    </WorkoutContext.Provider>
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
    <BarChartContext.Provider value={{ dailyCalories, setDailyCalories, increaseBarCaloriesForDay, decreaseBarCaloriesForDay, getCurrentDay }}>
      {children}
    </BarChartContext.Provider>
  )
}


