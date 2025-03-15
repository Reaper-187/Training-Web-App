const express = require('express');
const Workout = require('../models/WorkoutSchema');
const User = require('../models/LoginAndValidation/UserLoginSchema');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/workouts', async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.session.passport.user);
    const user = await User.findOne({ _id: userId }).select("weeklyCalories");
    const totalCaloriesThisWeek = Math.max(0, Math.round(user?.weeklyCalories || 0));
    const eachWorkout = await Workout.find({ userId });

    res.json({
      eachWorkout,
      totalCaloriesThisWeek,
    });

  } catch (err) {
    res.status(500).json({ message: "Fehler beim Abrufen der Workouts", error: err });
  }
});



// POST-Route, um ein neues Workout hinzuzufügen
router.post('/workouts', async (req, res) => {
  try {
    const { name, type, calories } = req.body;

    if (!name && type === 'Cardio') {
      req.body.name = 'Cardio';
    }

    const workout = new Workout({
      ...req.body,
      userId: req.session.passport.user,
      date: new Date(req.body.date)
    });

    const savedWorkout = await workout.save();
    const user = await User.findOne({ _id: req.session.passport.user }).select("weeklyCalories");
    const newCalories = Math.max(0, savedWorkout.calories);
    const previousCalories = user?.weeklyCalories || 0;
    const newWeeklyCalories = previousCalories + newCalories;

    await User.updateOne(
      { _id: req.session.passport.user },
      { $set: { weeklyCalories: Math.max(0, newWeeklyCalories) } } // Negative Werte auf 0 setzen
    );


    res.status(201).json({ savedWorkout, newWeeklyCalories });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/workouts/:id', getWorkouts, async (req, res) => {
  try {
    const userId = req.session.passport.user;
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, userId });

    if (!workout) {
      return res.status(404).json({ message: "Workout nicht gefunden" });
    }

    // weeklyCalories aktualisieren (subtra)
    await User.updateOne(
      { _id: userId },
      { $inc: { weeklyCalories: -workout.calories } }
    );

    res.json({ message: "Workout erfolgreich gelöscht", deletedWorkout: workout });
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
