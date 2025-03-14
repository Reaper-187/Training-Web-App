import { createContext, useState, useEffect, useContext } from 'react';
// import { getISOWeek } from './components/utils/dateUtils';
import axios from 'axios';

const APP_URL = import.meta.env.VITE_API_URL;


export const CaloriesContext = createContext();
export const WorkoutContext = createContext();


export const CaloriesProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [eachWorkout, setEachWorkout] = useState({});
  const [totalCaloriesThisWeek, setTotalCaloriesThisWeek] = useState(0);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get(APP_URL);

      setWorkouts(response.data.eachWorkout);

      const today = new Date().toISOString().split('T')[0];
      const caloriesForToday = response.data.eachWorkout
        .filter(workout => workout.date.split('T')[0] === today) // Stellt sicher, dass der Vergleich im gleichen Format stattfindet
        .reduce((acc, workout) => acc + workout.calories, 0);
      
      setEachWorkout(caloriesForToday);
      setTotalCaloriesThisWeek(response.data.totalCaloriesThisWeek);
      console.log('response.data.totalCaloriesThisWeek',response.data.totalCaloriesThisWeek);
    } catch (error) {
      console.error("Fehler beim Abrufen der Workouts:", error);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  return (
    <CaloriesContext.Provider value={{
      workouts,
      eachWorkout,
      totalCaloriesThisWeek,
      fetchWorkouts,
    }}>
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
        return [...prevWorkouts, workout];  // Workout zu den vorhandenen Workouts hinzufügen
      });
      fetchWorkouts();  // Hole die aktualisierten Workouts (optional)
    } catch (err) {
      console.error('Fehler beim Hinzufügen des Workouts:', err);
    }
  };

  return (
    <WorkoutContext.Provider value={{ selectWorkouts, setSelectWorkouts, addWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};


