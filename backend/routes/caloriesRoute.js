if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const router = express.Router();
const axios = require('axios')

// Proxy-Route für die Nutritionix-API
// Damit ungehe ich die Cors-Origin NW Rechtlinie
router.post('/calories', async (req, res) => {
  const API_CALORIES_KEY = process.env.VITE_API_KEY
  const API_CALORIES_ID = process.env.VITE_APP_ID
  try {
    const response = await axios.post(
      'https://trackapi.nutritionix.com/v2/natural/exercise',
      req.body,
      {
        headers: {
          'x-app-key': API_CALORIES_KEY,
          'x-app-id': API_CALORIES_ID,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Fehler bei der API-Anfrage:', error.response?.data || error.message);
    res.status(500).json({ message: 'Interner Serverfehler', error: error.response?.data });
  }
});


router.post('/calories/burned', (req, res) => {
  const { userId, calories } = req.body; // userId aus Session oder Auth-Daten
  if (!userId || calories == null) {
      return res.status(400).json({ success: false, message: 'Invalid data' });
  }
  // In der Datenbank speichern (z. B. MongoDB)
  User.findByIdAndUpdate(userId, { $set: { calories } })
      .then(() => res.json({ success: true }))
      .catch(err => res.status(500).json({ success: false, message: 'Database error', error: err }));
});

const saveCalories = async (newCalories) => {
  try {
      await axios.post('/calories/burned', { calories: newCalories });
      console.log('Calories saved to backend');
  } catch (error) {
      console.error('Error saving calories:', error);
  }
};

router.get('/calories/burned', (req, res) => {
  const { userId } = req.session; // userId aus Session
  if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
  }
  User.findById(userId)
      .then(user => res.json({ success: true, calories: user.calories || 0 }))
      .catch(err => res.status(500).json({ success: false, message: 'Database error', error: err }));
});


module.exports = router;
