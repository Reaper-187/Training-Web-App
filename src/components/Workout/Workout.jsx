import React, { useContext, useEffect, useState } from 'react'
import './Workout.css'
import { Calender } from './Calender'
import { WorkoutContext, PieCountContext, CaloriesContext, BarChartContext  } from '../../WorkoutContext'
import axios from 'axios'



const APP_URL = import.meta.env.VITE_API_URL



export const Workout = () => {
   
  const WorkoutList = () => {

    const { decreasePieCount } = useContext(PieCountContext)
    const { decreaseCalories } = useContext(CaloriesContext)
    const { decreaseCaloriesForDay } = useContext(BarChartContext)
    const { selectWorkouts, setSelectWorkouts  } = useContext(WorkoutContext);

    function setDeletBtn(_id) {      
      const workoutToDelete = selectWorkouts.find((workout) => workout._id === _id);

      if (workoutToDelete) {
        const caloriesToSubtract = workoutToDelete.calories;
        axios.delete(APP_URL + '/' + workoutToDelete._id)
        .then(() => {
          const newList = selectWorkouts.filter((workout) => workout._id !== _id);
          setSelectWorkouts(newList);
          decreaseCalories(caloriesToSubtract);
          decreaseCaloriesForDay(caloriesToSubtract)
        })
        .catch((err) => {
          console.error('Lösung konnte nicht durchgeführt werden',err);
        })
      }
    }

    useEffect(() => {
      const fetchGetData = async () => {
        try {
          const response = await axios.get(APP_URL)
          setSelectWorkouts(response.data)
          // console.log(response.data);        
        } catch (err) {
          console.error('GET-Data not found',err);   
        }
      }
      fetchGetData()
  }, []);

  const [selectedDate, setSelectedDate] = useState();
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
    
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };


  useEffect(() => {
    let currentDay = selectedDate;
    if (!selectedDate) {
      const today = new Date();
        today.setHours(0, 0, 0, 0);
        currentDay = today
    }else{
      const formattedSelectedDate = currentDay.toISOString().split('T')[0]; //Object-date wird zu einem toISOString die Zeit wird entfernt
  
      console.log("Formatted Selected Date:", formattedSelectedDate);
  
      const filteredWorkouts = selectWorkouts.filter((workout) => {
        const workoutDate = new Date(workout.date);
        workoutDate.setHours(0, 0, 0, 0); // Uhrzeit auf Mitternacht gesetzt
        const formattedWorkoutDate = workoutDate.toISOString().split('T')[0];
  
        return formattedWorkoutDate === formattedSelectedDate;
      });

      console.log("Filtered Workouts:", filteredWorkouts);
  
      // Setze die gefilterten Workouts
      setFilteredWorkouts(filteredWorkouts);
    }
  }, [selectedDate, selectWorkouts]);

  return (
    <>
      <div className='workoutContainer'>
        <div className='calenderContainer'>
          <Calender handleDateChange={handleDateChange} selectedDate={selectedDate}/>
        </div> 

        <div>
          <h2>Todays Workouts</h2>
          <div className="workoutView">
            <div className='workoutCardContainer'>
              {filteredWorkouts.length === 0 ? (
                <p>Keine Workouts für dieses Datum gefunden</p>
              ) : (
              filteredWorkouts.map((workout, index) => (
                <div className='workoutCard' key={index} _id={workout._id} date={workout.date}>
                  <div className='topElements'>
                    <span>{workout.type}</span>
                    <svg onClick={() => {setDeletBtn(workout._id);decreasePieCount(workout);}} className='removeCardBtn' xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                  </div>
                  <h3>{workout.name}</h3> 
                  <h3>{workout.exsize}</h3> 
                  <p>Count: {workout.sets} sets x {workout.reps} reps</p> 
                  <p>Weight: {workout.weight} kg</p>
                  <p>Time: {workout.time} min</p> 
                  <p>Burned-Calories: {workout.calories}</p> 
                </div>
              ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
    )
  }
  return <WorkoutList />;
}
