const express = require("express");
const app = express();
const connectDB = require('./db'); // verbidnung zu DB
const workoutRoutes = require('./routes/workoutRoutes');
const userRoute = require('./routes/userRoute');

const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*', // alle Domains werden damit Erlaubt
  },
});

io.on('connection', (socket) => {
  console.log('Ein Client ist verbunden:', socket.id);

  socket.on('disconnect', () => {
    console.log('Ein Client hat die Verbindung getrennt:', socket.id);
  });
});

// io.emit("newWorkout", workoutData); daimt die Daten in Echt-Zeit Aktualisiert werden wenn erstellt/gelöscht wird.


app.use(cors());

// DB-verbindung wird herstellen
connectDB();
app.use(express.json());

// route-Workouts
app.use('/api', workoutRoutes);

// route User
app.use('/api', userRoute);

app.get('/', (req, res) => {
  res.send('API läuft');
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
