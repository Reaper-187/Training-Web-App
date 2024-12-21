import axios from 'axios';



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
