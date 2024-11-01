import { createContext, useState, useEffect, useContext } from 'react';


export const WorkoutContext = createContext();


export const WorkoutProvider = ({ children }) => {
  const [selectWorkouts, setSelectWorkouts] = useState(() => {
    const savedWorkouts = localStorage.getItem('workouts');
    try {
      return savedWorkouts ? JSON.parse(savedWorkouts) : [];
    } catch (error) {
      console.error('Error parsing Workouts from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(selectWorkouts));
  }, [selectWorkouts]);

  const [currentId, setCurrentId] = useState(() => {
    const savedId = localStorage.getItem('currentId');
    return savedId ? JSON.parse(savedId) : 0;
    // return null
  });
  
  useEffect(() => {
    localStorage.setItem('currentId', JSON.stringify(currentId));
  }, [currentId]);

  const addWorkout = (workout) => {
    const workoutWithId = { ...workout, id: currentId + 1 };
  
    setSelectWorkouts((prevWorkouts) => {
      if (!Array.isArray(prevWorkouts)) {
        return [workoutWithId];
      }
      return [...prevWorkouts, workoutWithId];

    });
  
    setCurrentId((prevId) => prevId + 1);
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


  const [lastAddedCalories, setLastAddedCalories] = useState(0)

  const increaseCalories = (newCalories) => {
    setCalories((prevCalories) => prevCalories + newCalories);
    setLastAddedCalories(newCalories)
  };

  const decreaseCalories = (lastAddedCalories) => {
    setCalories((prevTotal) => prevTotal - lastAddedCalories);
  }

  return(
    <CaloriesContext.Provider value={{calories, setCalories, increaseCalories, decreaseCalories, lastAddedCalories }}>
      {children}
    </CaloriesContext.Provider>
  );
};

export const PieCountContext = createContext();

export const PieCountProvider = ({ children }) => {
  const { selectWorkouts } = useContext(WorkoutContext);

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

  const decreasePieCount = (workout) => {
    const muscleGroup = workout.name || 'Cardio'
    if (pieCount[muscleGroup] > 0) {
      setPieCount((prevCounts) => {
        const newCounts = {
          ...prevCounts,
          [muscleGroup]: prevCounts[muscleGroup] > 0 
            ? prevCounts[muscleGroup] - 1 
            : prevCounts.Cardio - 1,
        };
        localStorage.setItem('pieCount', JSON.stringify(newCounts));
        return newCounts;       
      });
    }
  };
  
  // const clearPieCountFromLocalStorage = () => {
  //   localStorage.removeItem('pieCount');
  //   console.log('LocalStorage für pieCount wurde gereinigt');
  // };
  


  return (
    <PieCountContext.Provider value={{ pieCount, increasePieCount, selectWorkouts, decreasePieCount}}>
      {children}
    </PieCountContext.Provider>
  );
};
