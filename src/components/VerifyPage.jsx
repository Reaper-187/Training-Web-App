import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from 'axios';


const API_VERIFY = import.meta.env.VITE_API_VERIFY;

export const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Verifiziere...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`${API_VERIFY}?token=${token}`);
        const data = await response.text();
        if (response.ok) {
          setMessage("E-Mail erfolgreich verifiziert! Du kannst dich jetzt einloggen.");
        } else{
          setMessage(data); // Fehlermeldung vom Backend anzeigen
        }  
      } catch (error) {
        setMessage(error.response?.data || "Fehler bei der Verifizierung. Bitte versuche es später erneut.");
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setMessage("Kein Verifizierungs-Token gefunden.");
    }
  }, [token]);

  return (
    <div>
      <h2>{message}</h2>
    </div>
  );
};
