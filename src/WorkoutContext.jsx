import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios'


const APP_URL = import.meta.env.VITE_API_URL


export const WorkoutContext = createContext();


export const WorkoutProvider = ({ children }) => {
  const [selectWorkouts, setSelectWorkouts] = useState([]);


  const addWorkout = (workout) => {
    axios.post(APP_URL, workout)
    .then((response) => {
      console.log('Erfolgreich in der DB gespeichert', response)
      setSelectWorkouts(prevWorkouts => [...prevWorkouts, workout])
      })
    .catch((err)=>{console.error('Daten können nicht in der DB gespeichert werden',err)})    
  };

  return (
    <WorkoutContext.Provider value={{ selectWorkouts, setSelectWorkouts, addWorkout}}>
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
    setCalories((prevTotal) => prevTotal - lastAddedCalories)
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
      
      // console.log('Neuer pieCount:', newCounts);
  
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
  
  
  const increaseCaloriesForDay = (cal) => {
    setDailyCalories((prevCalories) => {
      const day = getCurrentDay();
      const updatedCalories = { ...prevCalories };
      updatedCalories[day] = (updatedCalories[day] || 0) + cal;
      return updatedCalories;
    });
  };
  

  console.log('increase hat stattgefunden',dailyCalories)

  const decreaseCaloriesForDay = (cal) => {
    setDailyCalories((prevCalories) => {
      const day = getCurrentDay();
      if (prevCalories[day] >= cal) {
        const updatedCalories = { ...prevCalories };
        updatedCalories[day] -= cal;
        return updatedCalories;
      } else {
        return prevCalories; 
      }
    });
  };

  return(
    <BarChartContext.Provider value = {{ dailyCalories, setDailyCalories, increaseCaloriesForDay, decreaseCaloriesForDay }}>
      {children}
    </BarChartContext.Provider>
  )
}