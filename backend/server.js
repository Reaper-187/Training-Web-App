const express = require("express");
const app = express();
const connectDB = require('./db'); // Importiere die connectDB-Funktion
const workoutRoutes = require('./routes/workoutRoutes');
const Workouts = require("./models/WorkoutSchema")


// Datenbankverbindung herstellen
connectDB();
app.use(express.json());

// route-Workouts
app.use('/api/workouts', workoutRoutes);


run()
async function run() {
  const workout = new Workouts({type: 'Cardio', exsize: 'running', time: 4,})
  await workout.save()
  console.log(workout);
  
}



app.get('/', (req, res) => {
  res.send('API läuft');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});