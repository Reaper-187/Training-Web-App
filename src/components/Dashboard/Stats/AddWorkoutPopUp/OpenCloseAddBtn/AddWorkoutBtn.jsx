import React, {useState}  from 'react'
import './open-close.css'

import { AddWorkoutScreen } from '../AddWorkoutScreen';
import { OpenAdd } from './OpenCloseAddBtn';





export const AddWorkoutBtn = () => {
  
  const [openAddWorkout, setOpenAddWorkout] = useState(false)

  const openAddBtn = () => {
    setOpenAddWorkout(!openAddWorkout);
  };

  const closeAddBtn = () => {
    setOpenAddWorkout(false)
  }

  return (
      <>      
        <div className={openAddWorkout ? 'hiddenScreen.active' : 'hiddenScreen'}>
          <AddWorkoutScreen onClose={closeAddBtn}/>
        </div>

          <h1>Add New Workout</h1>
          <br />
            

        <span onClick={openAddBtn}>
          <OpenAdd/>
        </span>
      </>
  )
}
