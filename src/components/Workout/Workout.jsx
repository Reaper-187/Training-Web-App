import React, { useContext } from 'react'

import './Workout.css'
import { Calender } from './Calender'
import { WorkoutContext } from '../../WorkoutContext'

export const Workout = () => {

  const WorkoutList = () => {
    
    const { selectWorkouts } = useContext(WorkoutContext);
    console.log('auch hier function ok');
 

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
              <div className='workoutCard' key={index}>
                <span>{workout.type}</span>
                <h3>{workout.name}</h3> 
                <h3>{workout.exsize}</h3> 
                <p>Count: {workout.sets} sets x {workout.reps} reps</p> 
                <p>Weight: {workout.weight} kg</p>
                <p>Time: {workout.time} min</p> 
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
