if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
require('./cronJobs');
const express = require("express");
const app = express();
const connectDB = require('./db');
const workoutRoutes = require('./routes/workoutRoutes');
const userRoute = require('./routes/userRoute');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const httpServer = createServer(app);
const session = require('express-session');
const passport = require('passport');
const initializePassport = require('./routes/passportConfig');
const User = require('./models/LoginAndValidation/UserLoginSchema');
const flash = require('express-flash');
const MongoStore = require('connect-mongo');
const crypto = require('crypto');
const axios = require('axios');


app.set('trust proxy', 1); // Vertraue dem ersten Proxy

// CORS-Konfiguration
const FRONTEND_URL_PROD = process.env.FRONTEND_URL_PROD;
const FRONTEND_URL_DEV = process.env.FRONTEND_URL_DEV;

app.use(
  cors({
    origin: [FRONTEND_URL_PROD, FRONTEND_URL_DEV],
    credentials: true,
  })
);


const SECRET_RANDOM_KEY = crypto.randomBytes(32).toString('hex');

// Session-Konfiguration
app.use(session({
  secret: process.env.SECRET_KEY || SECRET_RANDOM_KEY,
  resave: false,
  saveUninitialized: false, // Muss false sein, sonst wird leere Session gespeichert
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    httpOnly: true,
    secure: true, // Falls HTTPS genutzt wird, auf true setzen.
    sameSite: 'none', // Falls Frontend auf anderer Domain, 'none' verwenden
    maxAge: 1000 * 60 * 60 * 24
  }
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializePassport(
  passport,
  async email => await User.findOne({ email }),
  async id => await User.findById(id)
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// Proxy-Route für die Nutritionix-API
app.post('/api/calories', async (req, res) => {
  const API_CALORIES_KEY = process.env.VITE_API_KEY;
  const API_CALORIES_ID = process.env.VITE_APP_ID;
  try {
    const response = await axios.post(
      'https://trackapi.nutritionix.com/v2/natural/exercise',
      req.body,
      {
        headers: {
          'x-app-key': API_CALORIES_KEY,
          'x-app-id': API_CALORIES_ID,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Fehler bei der API-Anfrage:', error.response?.data || error.message);
    res.status(500).json({ message: 'Interner Serverfehler', error: error.response?.data });
  }
});

// DB-Verbindung herstellen
connectDB();

// Routen
app.use('/api', workoutRoutes); // Route für Workouts
app.use('/api', userRoute); // Route für User

app.get('/', (req, res) => {
  res.send('API läuft');
});


const PORT = 5000;
httpServer.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});