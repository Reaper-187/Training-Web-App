import { createContext, useState, useEffect } from "react";
import axios from "axios";

const authCheck = import.meta.env.VITE_API_AUTHCHECK;

export const CheckAuthContext = createContext(null);

export const CheckAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  
  const checkAuth = async () => {
    try {
      const response = await axios.post(authCheck);
            
      setIsAuthenticated(response.data.loggedIn);
      console.log('Das ist ist der IsAuthenticated Status2',isAuthenticated);

    } catch (error) {
       setIsAuthenticated(false);
      console.error("Fehler beim Überprüfen der Session:", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <CheckAuthContext.Provider value={{ isAuthenticated, checkAuth }}>
      {children}
    </CheckAuthContext.Provider>
  );
};
