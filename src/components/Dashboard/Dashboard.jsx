import React from 'react'
import { Stats } from './Stats/Stats'
import { CaloriesBurnedCard } from './Stats/CaloriesCalc/CaloriesBurnedCard'
import { WorkoutsCard } from './Stats/CaloriesCalc/WorkoutsCard'
import { CaloriesAverageBruned } from './Stats/CaloriesCalc/CaloriesAverageBruned'



export const Dashboard = () => {

  return (
    <div>
      <div className='card-container'>
        <CaloriesBurnedCard />

        <WorkoutsCard />

        <CaloriesAverageBruned />
      </div>
      <Stats />
    </div>

  )

}