// const mongoose = require('mongoose');
//   require('dotenv').config();
// const User = require('./models/LoginAndValidation/UserLoginSchema'); // Die User-Model-Datei deines Projekts
// const connectDB = require('./db');

// (async () => {
//   try {
//     // Verbinden zur MongoDB
//     connectDB();

//     // Test für `getUserByEmail`
//     const email = 'test@test.de'; // Verwende eine gültige E-Mail-Adresse aus deiner DB
//     const userByEmail = await User.findOne({ email });
//     if (userByEmail) {
//       console.log('User gefunden:', userByEmail);
//     } else {
//       console.log('Kein Benutzer mit der E-Mail gefunden.');
//     }

//     // Test für `getUserById`
//     const userId = '67535fc052135af075e8103d'; // Verwende eine gültige ID aus deiner DB
//     const userById = await User.findById(userId);
//     if (userById) {
//       console.log('User gefunden:', userById);
//     } else {
//       console.log('Kein Benutzer mit der ID gefunden.');
//     }

//     // Verbindung zur DB wieder trennen
//     await mongoose.disconnect();
//   } catch (error) {
//     console.error('Fehler beim Testen der Abfragen:', error);
//   }
// })();
