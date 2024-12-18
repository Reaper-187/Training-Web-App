import React from 'react';
import './App.css';

import { Header } from './components/Header/Header';
import { WorkoutProvider, CaloriesProvider, BarChartProvider } from './WorkoutContext';

import { Outlet } from 'react-router-dom';

function App() {
  
  return (
  <>
    <CaloriesProvider>   {/* Hier beide Provider nebeneinander */}
      <BarChartProvider>
          <WorkoutProvider>
            <Header />
              <main>
                <Outlet />
              </main>
          </WorkoutProvider>
      </BarChartProvider>
    </CaloriesProvider>
  </>
  )
}

export default App;
