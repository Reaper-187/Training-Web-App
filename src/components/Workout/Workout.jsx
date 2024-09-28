import React, { useContext } from 'react'

import './Workout.css'
import { Calender } from './Calender'
import { WorkoutContext } from '../../WorkoutContext'

export const Workout = () => {

  const WorkoutList = () => {
    const { safeSelected } = useContext(WorkoutContext);
 

  return (
    <>

      <div className='workoutContainer'>
        <div className='calenderContainer'>
          <Calender/>
        </div> 

        <div>
          <h2>Todays Workouts</h2>
          <div className="workoutView">

            <div>
              {safeSelected.map((workout, index) => (
                <div className='workoutCard' key={index}>
                  <span>{workout.type}</span>
                  <h4>{workout.name}</h4> 
                  <p>Count: {workout.sets} sets x {workout.reps} reps</p> 
                  <p>Weight: {workout.weight} Time: {workout.time}</p> 
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
