import React from 'react';
import './App.css';

import { Header } from './components/Header/Header';
import { Login } from './components/Login/Login';
import { WorkoutProvider, CaloriesProvider, BarChartProvider } from './WorkoutContext';
import { Outlet } from 'react-router-dom';

function App() {
  
  return (
    <>
      <CaloriesProvider>   {/* Hier beide Provider nebeneinander */}
        <BarChartProvider>
          {/* <PieCountProvider> */}
            <WorkoutProvider>
              <Login>
                <Header />
                <main>
                  <Outlet />
                </main>
              </Login>
            </WorkoutProvider>
          {/* </PieCountProvider> */}
        </BarChartProvider>
      </CaloriesProvider>
    </>
  )
}

export default App;
