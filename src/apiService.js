import axios from 'axios';

// 3. Sicherheits- und Best Practices
// Input-Sicherheit:
// Stelle sicher, dass du die query-Parameter prüfst (z. B. mit einer Whitelist für erlaubte Aktivitäten), um Missbrauch wie Injection-Angriffe zu vermeiden.

// Fehlerhandling:
// Statt eines generischen Fehlers könnte eine klare Nachricht übermittelt werden, warum die Anfrage fehlgeschlagen ist (z. B. "Ungültige Aktivität").

// Performance:
// Wenn die API häufig aufgerufen wird, überlege, ob du Ergebnisse für häufige Anfragen cachen kannst (z. B. für 10 Minuten).


const API_CALORIES = import.meta.env.VITE_API_CALORIES;

export const fetchCalories = async (query) => {

  const url = API_CALORIES; // Deine Proxy-URL

  const body = {
    query: query, // Die Workouts, die der User auswählt
  };

  try {
    const response = await axios.post(url, body);
    return response.data;
  } catch (error) {
    console.error('API Fehler:', error);
    return null;
  }
}

