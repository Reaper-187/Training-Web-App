import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { CheckAuthContext, CheckAuthProvider } from './CheckAuthContext';
import { App } from './App';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Workout } from './components/Workout/Workout';
import { Blog } from './components/Blog';
import { ErrorPage } from './components/ErrorPage';
import { Login } from './components/Login/Login';
import { Loader } from './components/Loader/Loader';
import { VerifyPage } from './components/VerifyPage';

// Zustand für Authentifizierung verwalten
const ProtectedLayout = () => {
  const { isAuthenticated } = useContext(CheckAuthContext);
  if (isAuthenticated === null) return <Loader />;
  return isAuthenticated ? <App /> : <Navigate to="/login" />;
};

const LoginRoute = () => {
  const { isAuthenticated } = useContext(CheckAuthContext);
  if (isAuthenticated === null) return <Loader />;
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Login />;
};

// Router-Konfiguration
const router = createBrowserRouter(
  [
    {
      path: "/verify",
      element: <VerifyPage />,
      errorElement: <ErrorPage />
    },
    {
      path: "/login",
      element: <LoginRoute />,
      errorElement: <ErrorPage />
    },
    {
      path: "/",
      element: <LoginRoute />,
      errorElement: <ErrorPage />
    },
    {
      element: <ProtectedLayout />,  // Direkt zum geschützten Layout
      children: [
        { path: "dashboard", element: <Dashboard /> },
        { path: "workout", element: <Workout /> },
        { path: "blog", element: <Blog /> },
      ]
    },
  ],
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <CheckAuthProvider>
    <RouterProvider router={router} />
  </CheckAuthProvider>
);