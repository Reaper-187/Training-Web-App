import React, { createContext, useState } from 'react';

// Erstelle den Kontext
export const WorkoutContext = createContext();

// WorkoutProvider-Komponente
export const WorkoutProvider = ({ children }) => {
  const [selectWorkouts, setSelectWorkouts] = useState([]);

  const addWorkout = (workout) => {
    setSelectWorkouts([...selectWorkouts, workout]);
  };
  
  return (
    <WorkoutContext.Provider value={{ selectWorkouts, addWorkout }}>
      {children} {/* Achte darauf, dass children hier nur ein Element oder eine Funktion sind */}
    </WorkoutContext.Provider>
  );
};
