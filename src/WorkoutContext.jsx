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

  // CaloFetchPerDay
  useEffect(() => {
    if (workouts.length === 0) return;

    const today = new Date().toISOString().split("T")[0];

    const total = workouts.reduce((sum, workout) => sum + workout.calories, 0);
    setTotalCalories(total);
    //TagesCalo werden berechent
    const caloriesBurnedPerDay =
      workouts.filter((workout) => workout.date.split("T")[0] === today)
              .reduce((sum, workout) => sum + (workout.calories || 0), 0);
    setCaloriesBurnedPerDay(caloriesBurnedPerDay)
  }, [workouts])



  useEffect(() => {
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

  })

  return (
    <CaloriesContext.Provider value={{ workouts, totalCalories, caloriesBurnedPerDay, fetchWorkouts, currentWeek }}>
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


