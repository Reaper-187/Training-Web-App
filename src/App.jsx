import React from 'react';
import './App.css';

import { Header } from './components/Header/Header';
import { WorkoutProvider, CaloriesProvider } from './WorkoutContext';

import { Outlet } from 'react-router-dom';

export const App = () => {

  return (
    <>
      <CaloriesProvider>
        <WorkoutProvider>
          <Header />
          <Outlet />
        </WorkoutProvider>
      </CaloriesProvider>
    </>
  )
}