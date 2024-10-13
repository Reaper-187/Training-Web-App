import React, {useState, useContext} from 'react'
import  './Dashboard.css'
import {Stats} from './Stats/Stats'
import { CaloriesBurnedCard } from './Stats/CaloriesCalc/CaloriesBurnedCard'
import { WorkoutsCard } from './Stats/CaloriesCalc/WorkoutsCard'
import { CaloriesAverageBruned } from './Stats/CaloriesCalc/CaloriesAverageBruned'


export const Dashboard = () => {

  return (
    <div>
      <h1>Dashboard</h1>
      <div className='card-container'>
        <CaloriesBurnedCard/>

        <WorkoutsCard />

        <CaloriesAverageBruned/>
      </div>
      <Stats/>
    </div>
  
  )

}