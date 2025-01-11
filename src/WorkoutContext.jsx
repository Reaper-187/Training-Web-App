import { createContext, useState, useEffect } from 'react';
import socket from "./socket";
import axios from 'axios'



const APP_URL = import.meta.env.VITE_API_URL

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
    <CaloriesContext.Provider value={{calories, increaseCalories, decreaseCalories, lastAddedCalories }}>
      {children}
    </CaloriesContext.Provider>
  );
};

export const WorkoutContext = createContext();


export const WorkoutProvider = ({ children }) => {
  const [selectWorkouts, setSelectWorkouts] = useState([]);


  const addWorkout = (workout) => {
    axios.post(APP_URL, workout)
    .then(() => {
      // console.log('Erfolgreich in der DB gespeichert', response)
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



export const PieCountContext = createContext();

export const PieCountProvider = ({ children }) => {

  const initialPieCount = {
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

  const [newPieCount, setNewPieCount] = useState(initialPieCount);
  
  const [workoutAddedTrigger, setWorkoutAddedTrigger] = useState(false); // Neuer Trigger

  function triggerSocketChart() {
    socket.emit("updatePieSocket", newPieCount);
  }

  function notifyWorkoutAdded() {
    setWorkoutAddedTrigger((prev) => !prev); // Zustand umschalten
  }

  // Durch die verwendung von socket.io wird die änderung
  // zwischen server und Clientside in echtzeit Synchronisiert
  // Entlasung des NW da nicht permanente Anfragen an den server gesendet werden
  useEffect(() => {
    // Verbindungsnachricht empfangen
    socket.on("connect", () => {
      console.log("Mit dem Server verbunden:", socket.id);
    });

    socket.on("updatOkWithSocket", (updatedPieCount) => {
      setNewPieCount(updatedPieCount);
    });

    // Verbindung schließen
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <PieCountContext.Provider value={{workoutAddedTrigger, triggerSocketChart, notifyWorkoutAdded , newPieCount, setNewPieCount }}>
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
  
  
  const increaseBarCaloriesForDay = (cal) => {
    setDailyCalories((prevCalories) => {
      const day = getCurrentDay();
      const updatedCalories = { ...prevCalories };
      updatedCalories[day] = (updatedCalories[day] || 0) + cal;
      console.log('Increase der BARCHART Funktioniert wie es soll',updatedCalories); // Debug-Ausgabe
      return updatedCalories;
    });
  };

  const decreaseBarCaloriesForDay = (cal) => {
    setDailyCalories((prevCalories) => {
      const day = getCurrentDay();
      if (prevCalories[day] >= cal) {
        const updatedCalories = { ...prevCalories };
        updatedCalories[day] -= cal;
        console.log('deIncrease der BARCHART Funktioniert wie es soll',updatedCalories); // Debug-Ausgabe
        return updatedCalories;
      } else {
        return prevCalories; 
      }
    });
  };

  return(
    <BarChartContext.Provider value = {{ dailyCalories, setDailyCalories, increaseBarCaloriesForDay, decreaseBarCaloriesForDay }}>
      {children}
    </BarChartContext.Provider>
  )
}


