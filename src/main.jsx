import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { CheckAuthContext, CheckAuthProvider } from './CheckAuthContext';
import App from './App';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Workout } from './components/Workout/Workout';
import { ErrorPage } from './components/ErrorPage';
import { Login } from './components/Login/Login'

// const { setIsAuthenticated, isAuthenticated, checkAuth } = useContext (CheckAuthProvider)
// Zustand für Authentifizierung verwalten
const ProtectedLayout = () => {
  const { isAuthenticated } = useContext(CheckAuthContext);
  if (isAuthenticated === null) return <div>Loading...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};


  const LoginRoute = () => {
    const { isAuthenticated } = useContext(CheckAuthContext);
    if (isAuthenticated === null) return <div>Loading...</div>;
    return isAuthenticated ? <Navigate to="/dashboard" /> : <Login />;
  };

  // Router-Konfiguration
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          element: <ProtectedLayout />,
          children: [
            { path: "dashboard", element: <Dashboard /> },
            { path: "workout", element: <Workout /> },
          ],
        },
      ],
    },
    {
      path: "/login",
      element: <LoginRoute />,
      errorElement: <ErrorPage />,
    }
  ]);

  ReactDOM.createRoot(document.getElementById('root')).render(
    <CheckAuthProvider>
      <RouterProvider router={router} />
    </CheckAuthProvider>
  );
  


