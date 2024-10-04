import React from 'react'
import './Stats.css'
import { BarChart } from './BarChart';
import { PieChart } from './PieChart';
import { AddWorkoutBtn } from './AddWorkoutPopUp/OpenCloseAddBtn/AddWorkoutBtn';


export const Stats = () => {





  return (
    <div className='stats-container'>
      <div className='stat-card'>
        <h4>Weekly Calories Burned</h4>
        <div><BarChart/></div>
      </div>


      <div className='stat-card'>
        <h4>Workout Categories</h4>
        <div><PieChart/></div>
      </div>

      <div className='stat-card'>
        <AddWorkoutBtn/>
      </div>

    </div>
  )
}
