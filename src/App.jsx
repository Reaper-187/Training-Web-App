import React from 'react';
import './App.css';

import { Header } from './components/Header/Header';
import { WorkoutProvider, CaloriesProvider, PieCountProvider } from './WorkoutContext';
import { Outlet } from 'react-router-dom';

function App() {
  
  return (
  <>
  <CaloriesProvider>   {/* Hier beide Provider nebeneinander */}
    <PieCountProvider>
      <WorkoutProvider>
      <Header/>
        <main>
          <Outlet/>
        </main>
      </WorkoutProvider>
    </PieCountProvider>
  </CaloriesProvider>
  </>
  )
}

export default App;
