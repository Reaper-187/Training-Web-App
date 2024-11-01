import React, { useContext } from 'react'
import './Workout.css'
import { Calender } from './Calender'
import { WorkoutContext, PieCountContext,CaloriesContext  } from '../../WorkoutContext'



export const Workout = () => {
  
  const WorkoutList = () => {

    const { decreasePieCount } = useContext(PieCountContext)
    const { decreaseCalories } = useContext(CaloriesContext)
    const { selectWorkouts, setSelectWorkouts  } = useContext(WorkoutContext);

    function setDeletBtn(id) {
      const workoutToDelete = selectWorkouts.find((workout) => workout.id === id);
      
      if (workoutToDelete) {
        const caloriesToSubtract = workoutToDelete.calories;

        const newList = selectWorkouts.filter((workout) => workout.id !== id);
        setSelectWorkouts(newList);

        decreaseCalories(caloriesToSubtract);
      }
    }

  return (
    <>
      <div className='workoutContainer'>
        <div className='calenderContainer'>
          <Calender/>
        </div> 

        <div>
          <h2>Todays Workouts</h2>
          <div className="workoutView">
            <div className='workoutCardContainer'>
              {selectWorkouts.map((workout, index) => (
                <div className='workoutCard' key={index} id={workout.id}>
                  <div className='topElements'>
                    <span>{workout.type}</span>
                    <svg onClick={() => {setDeletBtn(workout.id);decreasePieCount(workout);}} className='removeCardBtn' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                  </div>
                  <h3>{workout.name}</h3> 
                  <h3>{workout.exsize}</h3> 
                  <p>Count: {workout.sets} sets x {workout.reps} reps</p> 
                  <p>Weight: {workout.weight} kg</p>
                  <p>Time: {workout.time} min</p> 
                  <p>Burned-Calories: {workout.calories}</p> 
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
    )
  }
  return <WorkoutList />;
}
