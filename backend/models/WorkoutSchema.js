const mongoose = require('mongoose')

const workoutSchema = new mongoose.Schema({

  type:{
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  exsize: {
    type: String,
    required: true,
  },
  sets: {
    type: Number,
    minSets: 1,
  },
  reps: {
    type: Number,
    minReps: 1
  },
  weight: {
    type: String,
    minWeight: 1
  },
  time: {
    type: String,
  },
  calories: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model('Workout', workoutSchema)