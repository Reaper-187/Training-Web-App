const express = require('express');
const router = express.Router();
const Workouts = require('../models/WorkoutSchema'); 


router.get('/', async (req, res) => {
  try {
    const workouts = await Workouts.find();
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/', async (req, res) => {
  const workout = new Workouts(req.body);
  try {
    const savedWorkout = await workout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Exportiere das Router-Objekt
module.exports = router;
