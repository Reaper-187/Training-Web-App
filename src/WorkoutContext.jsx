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



export const PieCountContext = createContext();

export const PieCountProvider = ({ children }) => {
  const { selectWorkouts } = useContext(WorkoutContext); // Zugriff auf die Workouts



  const initialPieCount = JSON.parse(localStorage.getItem('pieCount')) || {
    Chest: 0,
    Legs: 0,
    Shoulders: 0,
    Back: 0,
    Biceps: 0,
    Triceps: 0,
    Booty: 0,
    Abs: 0,
    Cardio: 0,
  };

  const [pieCount, setPieCount] = useState(initialPieCount);

  const increasePieCount = (muscleGroup) => {


    const lengthCategory = {
      Chest: 0,
      Legs: 0,
      Shoulders: 0,
      Back: 0,
      Biceps: 0,
      Triceps: 0,
      Booty: 0,
      Abs: 0,
      Cardio: 0,
    };
  
  for (let i = 0; i < selectWorkouts.length; i++) {
    const muscleGroup = selectWorkouts[i];
  
    switch (muscleGroup) {
      case 'Chest':
        lengthCategory.Chest += 1;
        break;
      case 'Legs':
        lengthCategory.Legs += 1;
        break;
      case 'Shoulders':
        lengthCategory.Shoulders += 1;
        break;
      case 'Back':
        lengthCategory.Back += 1;
        break;
      case 'Biceps':
        lengthCategory.Biceps += 1;
        break;
      case 'Triceps':
        lengthCategory.Triceps += 1;
        break;
      case 'Booty':
        lengthCategory.Booty += 1;
        break;
      case 'Abs':
        lengthCategory.Abs += 1;
        break;
      case 'Cardio':
        lengthCategory.Cardio += 1;
        break;
      default:
        // Optional: Handle any unknown workout types
        console.log('Unknown workout type:', lengthCategory);
    }
  }

    setPieCount((prevCounts) => {
      const targetGroup = muscleGroup === '' ? 'Cardio' : muscleGroup;
      
      const newCounts = {
        ...prevCounts,
        [targetGroup]: prevCounts[targetGroup] + 1,
      };

      localStorage.setItem('pieCount', JSON.stringify(newCounts));
      
      console.log('Neuer pieCount:', newCounts);
      return newCounts;
    });
  };

  return (
    <PieCountContext.Provider value={{ pieCount, increasePieCount,selectWorkouts }}>
      {children}
    </PieCountContext.Provider>
  );
};
