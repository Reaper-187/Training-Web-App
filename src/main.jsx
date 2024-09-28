import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Haupt-App-Komponente
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { WorkoutProvider } from './WorkoutContext'; // Füge diesen Import hinzu



import {Dashboard} from './components/Dashboard/Dashboard';

import {Workout} from './components/Workout/Workout';

import {ErrorPage} from './components/ErrorPage';


// Router-Konfiguration
const router = createBrowserRouter([
  {
    path: "/",
    element: 
    <WorkoutProvider>
      <App/>,
    </WorkoutProvider>,    
    errorElement: <ErrorPage />, // Seite für Fehlerfälle
    children: [
      {
        path: "Dashboard",
        element:  <Dashboard/>,
        errorElement: <ErrorPage/>,
      },
      {
        path: "Workout",
        element: <Workout />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
