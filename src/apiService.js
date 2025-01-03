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
    console.log('Daten der Calories API', response.data);
    return response.data;
  } catch (error) {
    console.error('API Fehler:', error);
    return null;
  }
}



// Ninjas-Api kann nur GET-Req verarbeiten

const API_NINJAS = import.meta.env.VITE_API_NINJAS;

export const fetchCaloriesFromNinjas = async (activity) => {
  const url = `${API_NINJAS}?activity=${encodeURIComponent(activity)}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('API-Antwort:', response.data);
    return response.data;
  } catch (error) {
    console.error('API-Fehler:', error.response?.data || error.message);
    return null;
  }
};


const activity = "body building"; // Ersetze mit der gewünschten Aktivität
fetchCaloriesFromNinjas(activity).then(data => {
  console.log('Erhaltene Daten:', data);
});


// calories_per_hour
