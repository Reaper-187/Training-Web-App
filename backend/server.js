const express = require("express");
const app = express();
const connectDB = require('./db'); // Importiere die connectDB-Funktion
// const Workout = require("./models/WorkoutSchema")
const workoutRoutes = require('./routes/workoutRoutes'); // Importiere die Routen
const cors = require('cors');


app.use(cors());

// Datenbankverbindung herstellen
connectDB();
app.use(express.json());

// route-Workouts
app.use('/api', workoutRoutes);


app.get('/', (req, res) => {
  res.send('API läuft');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});