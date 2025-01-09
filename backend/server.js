if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

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
const axios = require('axios')

const SECRET_KEY = crypto.randomBytes(32).toString('hex');

// const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";
// Session-Konfiguration
app.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store:  MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Nur auf true setzen, wenn HTTPS verwendet wird
      httpOnly: true, // Schutz vor JavaScript-Angriffen
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);



app.use(express.urlencoded({ extended: true }));

initializePassport(
  passport,
  async email => await User.findOne({ email }),
  async id => await User.findById(id)
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    credentials: true,
  }
});



io.on('connection', (socket) => {
  console.log('Ein Client ist verbunden:', socket.id);
  socket.on("updatePieSocket", updatedPieCount => {    
    io.emit("updatOkWithSocket", updatedPieCount)

  })

  socket.on('disconnect', () => {
    console.log('Ein Client hat die Verbindung getrennt:', socket.id);
  });
});



// cros-origin-Anfragen erlauben weil Frontend auf != Backend {Port} läuft
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
);


// DB-Verbindung herstellen
connectDB();

app.use(express.json());


// Proxy-Route für die Nutritionix-API
// Damit ungehe ich die Cors-Origin NW Rechtlinie
app.post('/api/calories', async (req, res) => {

  const API_CALORIES_KEY = process.env.VITE_API_KEY
  console.log(API_CALORIES_KEY)

  const API_CALORIES_ID = process.env.VITE_APP_ID
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



app.get('/api/caloriesNinjas', async (req, res) => {
  const API_NINJAS_KEY = process.env.API_CALORIES_NINJAS_KEY;
  const { activity } = req.query; // `activity`-Parameter aus der URL
  console.log('Empfangener activity-Parameter:', activity);

  if (!activity) {
    return res.status(400).json({ message: 'activity-Parameter fehlt.' });
  }

  try {
    const url = `https://api.api-ninjas.com/v1/caloriesburned?activity=${encodeURIComponent(activity)}`;

    const response = await axios.get(url, {
      headers: {
        'x-api-key': API_NINJAS_KEY,
      },
    });

    console.log('API-Antwort:', response.data);
    res.json(response.data); // Antwort weiterleiten
  } catch (error) {
    console.error('Fehler bei der API-Anfrage:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Interner Serverfehler',
      error: error.response?.data || error.message,
    });
  }
});




// Routen
app.use('/api', workoutRoutes); // Route für Workouts
app.use('/api', userRoute); // Route für User

app.get('/', (req, res) => {
  res.send('API läuft');
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
