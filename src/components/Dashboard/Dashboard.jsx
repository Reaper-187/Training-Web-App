import React from 'react'
import './Dashboard.css'

import { CaloriesBurnedCard } from './Stats/CaloriesCalc/CaloriesBurnedCard'
import { WorkoutsCard } from './Stats/CaloriesCalc/WorkoutsCard'
import { CaloriesAverageBruned } from './Stats/CaloriesCalc/CaloriesAverageBruned'
import { BarChart } from './Stats/BarChart'
import { PieChart } from './Stats/PieChart'
import { AddWorkoutBtn } from './Stats/AddWorkoutPopUp/OpenCloseAddBtn/AddWorkoutBtn'


export const Dashboard = () => {

  return (
    <>
      <div className='dashboard-container'>
        
        <div className="stat-card calories-burned">
          <CaloriesBurnedCard />
        </div>

        <div className='stat-card workout-streak'>
          <WorkoutsCard />
        </div>

        <div className='stat-card calories-average-burned'>
          <CaloriesAverageBruned />
        </div>
      

      
        
        <div className='stat-card bar-chart'>
          <h4>Weekly Calories Burned</h4>
          <BarChart />
        </div>

        <div className='stat-card pie-chart'>
          <h4>Workout Categories</h4>
          <PieChart />
        </div>

        <div className='stat-card add-btn-comp'>
          <AddWorkoutBtn />
        </div>
        
      </div>
    </>
  )

}