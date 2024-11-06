const express = require('express');
const router = express.Router();
const Workout = require('../models/WorkoutSchema'); 


router.post('/workouts', async (req, res) => {
  try {
    const workout = new Workout(req.body); // Neues Workout mit den gesendeten Daten
    const savedWorkout = await workout.save(); // Speichern in der DB
    res.status(201).json(savedWorkout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

async function getWorkouts(req, res, next) {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: "Cannot find the workout" });
    }
    res.workout = workout;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}


router.get('/workouts', async (req, res) => {
  try {
    const workouts = await Workout.find(); // Alle Workouts abrufen
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: err.message }); // Fehlerbehandlung
  }
});


router.put('/workouts/:id', getWorkouts, async (req, res) => {
  try {
    Object.assign(res.workout, req.body);
    const updatedWorkout = await res.workout.save();
    res.json(updatedWorkout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.delete('/workouts/:id', getWorkouts, async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.status(204).send(); 
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// Exportiere das Router-Objekt
module.exports = router;
