import React from 'react';
import './App.css';

import { Header } from './components/Header/Header';
import { WorkoutProvider, CaloriesProvider, BarChartProvider, ThemeProvider } from './WorkoutContext';

import { Outlet } from 'react-router-dom';

export const App = () => {
  
  return (
  <>
    <ThemeProvider>
      <CaloriesProvider>
        <BarChartProvider>
          <WorkoutProvider>
            <Header />
              <Outlet />
          </WorkoutProvider>
        </BarChartProvider>
      </CaloriesProvider>
    </ThemeProvider>
  </>
  )
}
