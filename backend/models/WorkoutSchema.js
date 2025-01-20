const mongoose = require('mongoose')

const workoutSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Verknüpfung mit dem User wenn Workout erstellt wird
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
    min: 1,
  },
  reps: {
    type: Number,
    min: 1
  },
  weight: {
    type: String,
    min: 1
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


//das Schema wird zu einem Modell umgewandelt und gleichzeitig auch Exportiert
module.exports = mongoose.model('Workout', workoutSchema)