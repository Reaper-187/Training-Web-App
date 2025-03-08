const cron = require("node-cron");
const connectDB = require('./db');
const Workout = require("./models/WorkoutSchema");

connectDB();

// Wöchentlich Kalorien resetten (jeden Montag um 00:00 Uhr)
cron.schedule("0 0 * * 1", async () => {
  try {
    await Workout.updateMany({}, { $set: { calories: 0 } }); // Setzt alle Kalorien zurück
    console.log("✅ Wöchentliche Kalorien aller Workouts wurden zurückgesetzt!");
  } catch (error) {
    console.error("❌ Fehler beim wöchentlichen Reset:", error);
  }
});
