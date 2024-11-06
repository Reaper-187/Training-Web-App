import axios from 'axios'

// const API_KEY = import.meta.env.VITE_API_KEY
// const APP_ID = import.meta.env.VITE_APP_ID
const API_KEY = '8ce7ed8079fa7a6c0b24295d8cabf249';
const APP_ID = 'b23d828d';


export const fetchCalories = async (query) => {
  const url = `https://trackapi.nutritionix.com/v2/natural/exercise`;
  const headers = {
    'x-app-id': APP_ID,
    'x-app-key': API_KEY,
    'content-Type': 'application/json'
  };

  // query ist was der User auswählt in "string" (an Workouts)

  const body = {
    query: query,
  }


  try {
    const response = await axios.post(url, body, { headers });
    return response.data;
  } catch (error) {
    console.error('API Fehler:', error);
    return null;
  }
  
}