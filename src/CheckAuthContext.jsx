import { createContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;
const authCheck = import.meta.env.VITE_API_AUTHCHECK;

export const CheckAuthContext = createContext();

export const CheckAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const checkAuth = async () => {
    try {
      const response = await axios.get(authCheck);
      setIsAuthenticated(response.data.loggedIn);
    } catch (error) {
      setIsAuthenticated(false);
      console.error("Fehler beim Überprüfen der Session:", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const toggleAuthentication = (value) => {
    setIsAuthenticated(value);
  };


  return (
    <CheckAuthContext.Provider value={{ toggleAuthentication, isAuthenticated, checkAuth }}>
      {children}
    </CheckAuthContext.Provider>
  );
};
