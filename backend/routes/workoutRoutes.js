const express = require('express');
const Workout = require('../models/WorkoutSchema');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/workouts', async (req, res) => {
  try {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sonntag, 1 = Montag, ..., 6 = Samstag
    
    // Berechnung des Start- und Enddatums für die Woche (Montag bis Sonntag)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    startOfWeek.setHours(0, 0, 0, 0); // Sicherstellen, dass der Startpunkt um Mitternacht ist
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999); // Sicherstellen, dass das Ende um 23:59:59 ist
    

    const userId = new mongoose.Types.ObjectId(req.session.passport.user);

    // MongoDB Aggregation, um tägliche und wöchentliche Kalorien zu berechnen
    const workouts = await Workout.aggregate([
      {
        $match: { // $_match: Filtern die Workouts des Benutzers und der aktuellen Woche.
          userId: userId,
          date: { $gte: startOfWeek, $lte: endOfWeek } // Filtere Workouts der aktuellen Woche
        }
      },
      {
        $group: { // $_group: Berechnen die Gesamtzahl der Kalorien in der Woche und die täglichen Kalorien pro Datum.
          _id: null,
          totalCaloriesThisWeek: { $sum: "$calories" }, // Wöchentliche Gesamtkalorien
          eachWorkout: {
            $push: {
              _id: "$_id",
              date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
              type: "$type",
              name: "$name",
              exsize: "$exsize",
              sets: "$sets",
              reps: "$reps",
              weight: "$weight",
              time: "$time",
              calories: "$calories"
            }
          }
        }
      }
    ]);

    const eachWorkout = workouts.length > 0 ? workouts[0].eachWorkout : [];
    const totalCaloriesThisWeek = workouts.length > 0 ? workouts[0].totalCaloriesThisWeek : 0;

    // Rückgabe der Workouts und wöchentlichen Kalorien
    res.json({
      eachWorkout,        // Tägliche Kalorien
      totalCaloriesThisWeek // Wöchentliche Kalorien
    });

  } catch (err) {
    console.error('Error in /workouts route:', err); // Fehlerlog für den Fall, dass etwas schief geht

    res.status(500).json({ message: err.message });
  }
});

// POST-Route, um ein neues Workout hinzuzufügen
router.post('/workouts', async (req, res) => {
  try {
    const { name, type } = req.body;

    // Backend Validierung für Cardio Workouts im Frontend
    if (!name && type === 'Cardio') {
      req.body.name = 'Cardio';
    }

    // Workout mit der userId aus der Session des angemeldeten Benutzers erstellen
    const workout = new Workout({
      ...req.body,
      userId: req.session.passport.user, // userId aus der Session (anstatt aus req.body)
    });

    console.log('Das ist das Workout:', workout);

    // Workout in der DB speichern
    const savedWorkout = await workout.save();

    // Erfolgreiche Antwort zurückgeben
    res.status(201).json(savedWorkout);
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

// Exportiere das Router-Objekt
module.exports = router;
