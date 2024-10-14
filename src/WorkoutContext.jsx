import React, { createContext, useState, useEffect } from 'react';


export const WorkoutContext = createContext();


export const WorkoutProvider = ({ children }) => {
  const [selectWorkouts, setSelectWorkouts] = useState(() => {
    const savedWorkouts = localStorage.getItem('workouts');
    try {
      return savedWorkouts ? JSON.parse(savedWorkouts) : [];
      // return [];
    } catch (error) {
      console.error('Error parsing Workouts from localStorage', error);
      return 0;
    }
  });



  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(selectWorkouts));
  }, [selectWorkouts]);

  const [currentId, setCurrentId] = useState(() => {
    const savedId = localStorage.getItem('currentId');
    return savedId ? JSON.parse(savedId) : 0; // Setze Standardwert auf 1
    // return null
  });
  
  useEffect(() => {
    localStorage.setItem('currentId', JSON.stringify(currentId));
  }, [currentId]);

  const addWorkout = (workout) => {
    const newId = currentId + 1;

    const workoutWithId = { ...workout, id: newId };
  
    // Füge das Workout zur Liste hinzu
    setSelectWorkouts([...selectWorkouts, workoutWithId]);
    setCurrentId(newId);
  };

  return (
    <WorkoutContext.Provider value={{ selectWorkouts, setSelectWorkouts, addWorkout, currentId, setCurrentId}}>
      {children}
    </WorkoutContext.Provider>
  );
};



export const CaloriesContext  = createContext()

export const CaloriesProvider = ({ children }) => {
  const [calories, setCalories] = useState(() =>{
    const savedCalories = localStorage.getItem('calories');
    try {
      return savedCalories ? JSON.parse(savedCalories) : 0;
    } catch (error) {
      console.error('Error parsing calories from localStorage', error);
      return 0;
    }
  });  

  useEffect(() => {
    localStorage.setItem('calories', JSON.stringify(calories))
  },[calories]);

  const updateCalories = (newCalories) => {
    setCalories((prevCalories) => prevCalories + newCalories);
  };

  return(
    <CaloriesContext.Provider value={{calories, setCalories, updateCalories }}>
      {children}
    </CaloriesContext.Provider>
  );
};



export const PieCountContext  = createContext()

export const PieCountProvider = ({ children }) => {
  const [pieCount, setPieCount] = useState({
    Chest: 0,
    Legs: 0,
    Shoulders: 0,
    Back: 0,
    Biceps: 0,
    Triceps: 0,
    Booty: 0,
    Abs: 0,
    Cardio: 0,
  });

  const increasePieCount = (muscleGroup) => {
    setPieCount((prevCounts) => {
      const targetGroup = muscleGroup === '' ? 'Cardio' : muscleGroup;
  
      const newCounts = {
        ...prevCounts,
        [targetGroup]: prevCounts[targetGroup] + 0.5,
      };
  
      console.log('Neuer pieCount:', newCounts);  // Prüfen, ob "Cardio" korrekt erhöht wird
      return newCounts;
    });
  };

  return (
    <PieCountContext.Provider value={{ pieCount, increasePieCount }}>
      {children}
    </PieCountContext.Provider>
  );
};