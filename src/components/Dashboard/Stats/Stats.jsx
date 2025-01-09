import React from 'react'
import './Stats.css'
import { PieChart } from './PieChart';
import { BarChart } from './BarChart';
import { AddWorkoutBtn } from './AddWorkoutPopUp/OpenCloseAddBtn/AddWorkoutBtn';


export const Stats = () => {
  return (
    <div className='stats-container'>
      <div className='stat-card bar-chart'>
        <h4>Weekly Calories Burned</h4>
        <div><BarChart/></div>
      </div>


      <div className='stat-card pie-chart'> 
        <h4>Workout Categories</h4>
        <div><PieChart/></div>
      </div>

      <div className='stat-card add-btn-comp'>
        <AddWorkoutBtn/>
      </div>

    </div>
  )
}
