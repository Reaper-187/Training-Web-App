const cron = require("node-cron");
const connectDB = require('./db');
const User = require("./models/User"); // Dein User-Modell

connectDB()



// Täglich um 00:00 Uhr (Mitternacht) alle täglichen Kalorien zurücksetzen
cron.schedule("0 0 * * *", async () => {
  try {
    await User.updateMany({}, { $set: { dailyCalories: 0 } });
    console.log("✅ Tägliche Kalorien aller Nutzer wurden zurückgesetzt!");
  } catch (error) {
    console.error("❌ Fehler beim täglichen Reset:", error);
  }
});



// Wöchentlich am Montag um 00:00 Uhr alle wöchentlichen Kalorien zurücksetzen
cron.schedule("0 0 * * 1", async () => {
  try {
    await User.updateMany({}, { $set: { weeklyCalories: 0 } });
    console.log("✅ Wöchentliche Kalorien aller Nutzer wurden zurückgesetzt!");
  } catch (error) {
    console.error("❌ Fehler beim wöchentlichen Reset:", error);
  }
});
