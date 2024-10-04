import React from 'react'
import './App.css'

import { Header } from './components/Header/Header'
import { WorkoutProvider } from './WorkoutContext'
import { Outlet } from 'react-router-dom';


function App() {
  
  return (
  <>
    <Header/>
    <main>
      <WorkoutProvider>
        <Outlet/>
      </WorkoutProvider>
    </main>
  </>
  )
}

export default App

