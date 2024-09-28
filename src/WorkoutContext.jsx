import React, { createContext, useState } from 'react';

// Erstelle den Kontext
export const WorkoutContext = createContext();

// WorkoutProvider-Komponente
export const WorkoutProvider = ({ children }) => {
  const [safeSelected, setSafeSelected] = useState([]);

  const addWorkout = (workout) => {
    setWorkouts([...workouts, workout]);
  };
  
  return (
    <WorkoutContext.Provider value={{ safeSelected, setSafeSelected }}>
      {children} {/* Achte darauf, dass children hier nur ein Element oder eine Funktion sind */}
    </WorkoutContext.Provider>
  );
};
