const cron = require("node-cron");
const connectDB = require('./db');
const User = require("./models/LoginAndValidation/UserLoginSchema");

connectDB();

// Wöchentlich Kalorien resetten (jeden Montag um 00:00 Uhr)
// cron.schedule("*/5 * * * *", async () => {
cron.schedule("0 0 * * 1", async () => {
  try {
    await User.updateMany({}, { $set: { weeklyCalories: 0 } });
    console.log("Wöchentliche Kalorien erfolgreich zurückgesetzt");
  } catch (err) {
    console.error("Fehler beim Zurücksetzen der wöchentlichen Kalorien:", err);
  }
});
