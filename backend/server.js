if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require("express");
const app = express();
const connectDB = require('./db');
const workoutRoutes = require('./routes/workoutRoutes');
const userRoute = require('./routes/userRoute');
const caloriesRoute = require('./routes/caloriesRoute');
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

// io.on('connection', (socket) => {
//   console.log('Ein Client ist verbunden:', socket.id);
//   socket.on("updatePieSocket", updatedPieCount => {    
//     io.emit("updatOkWithSocket", updatedPieCount)

//   })

//   socket.on('disconnect', () => {
//     console.log('Ein Client hat die Verbindung getrennt:', socket.id);
//   });
// });



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

// Routen
app.use('/api', workoutRoutes); // Route für Workouts
app.use('/api', userRoute); // Route für User
app.use('/api', caloriesRoute); // Route für Calories

app.get('/', (req, res) => {
  res.send('API läuft');
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
