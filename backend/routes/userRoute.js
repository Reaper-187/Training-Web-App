if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const User = require('../models/LoginAndValidation/UserLoginSchema'); 
const { validateUser } = require('../models/LoginAndValidation/YupValidation');
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const crypto = require('crypto');
const cors = require('cors');




const app = express();
const router = express.Router();


// Middleware
app.use(cors());
app.use(express.json()); // Für JSON-Parsing
app.use(express.urlencoded({ extended: true })); // Für URL-encoded Formulare
// const methodOverride = request('method-override')

//Import ENV SECRET KEY
const SECRET_KEY = process.env.VITE_SECRET_KEY || crypto.randomBytes(32).toString('hex');
console.log('Das Ist der SECRETKEY',SECRET_KEY); 

app.use(
  session({
    secret: SECRET_KEY, // Dein Secret Key
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true } // Aktiviere secure Cookies in Produktion
  })
);

  app.use(flash())
  app.use(passport.initialize())
  app.use(passport.session())

  const initializePassport = require('./passportConfig')
  // initializePassport(
  //   passport, 
  //   email => User.findOne(user => user.email === email),
  //   id => User.findById(user => user.id === id)
  // )

  initializePassport(
    passport,
    async email => await User.findOne({ email }),
    async id => await User.findById(id)
  );
 
// Das ist eine Middlewarefunction  Prüft ob User eingeloggt ist
  function checkAuthn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }
  
  function checkNotAuthn(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  }

 
//  mit der Library methode Override überschreibt sie die Funktion und ich kann delete verwenden
// im Logout kommt dann action"/logut?_method=DELETE"
  // app.delete('./logout', (req, res) => {
  //   req.logOut() //cleart die Session und loggt den User aus
  //   res.redirect('./login')
  // })

// ------------------- PRÜFEN ---------------

// Post Request zu erstellen eines Users


router.post('/register', async (req, res) => {
  try {
    await validateUser(req.body)
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    const savedUser = await newUser.save();
    res.status(201).json({
      message: 'Benutzer erfolgreich registriert!',
      user: { id: savedUser._id, name: savedUser.name, email: savedUser.email }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// es ist Flexibler wennn das Backend nur ok or nok als res erhält. react sagt was passiert

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(500).json({ success: false, message: 'Serverfehler' });
    if (!user) return res.status(401).json({ success: false, message: 'Ungültige Anmeldedaten' });

    req.logIn(user, err => {
      if (err) return res.status(500).json({ success: false, message: 'Anmeldung fehlgeschlagen' });
      res.status(200).json({
        success: true,
        message: 'Login erfolgreich',
        user: { email: user.email, password: user.password },
      });
    });
  })(req, res, next);
});




// router.post('/login', (req, res, next) => {
//   passport.authenticate('local', (err, user, info) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'ServerError' });
//     }
//     if (!user) {
//       return res.status(401).json({ success: false, message: 'Wrong Login-Data' });
//     }
//     req.logIn(user, (err) => {
//       if (err) {
//         return res.status(500).json({ success: false, message: 'Login Fail' });
//       }
//       return res.status(200).json({ 
//         success: true, 
//         message: 'Login successfully', 
//         // user: { id: user._id, name: user.name, email: user.email } 

//         user: { email: user.email, password: user.password } 
//       });
//     });
//   })(req, res, next);
// });


// Post Request zum Prüfen der Daten wenn User sich einloggen möchte

// router.post('/login', async (req, res) => {
//   try {
//     const user = new User(req.body); // Neues user mit den gesendeten Daten
//     const saveduser = await user.save(); // Speichern in der DB
//     res.status(201).json(saveduser);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

router.get('/User', async (req, res) => {
  try {
    const user = await User.find(); // Alle user abrufen
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message }); // Fehlerbehandlung
  }
});


// Dashboard & Login
app.get('/dashboard', checkAuthn, (req, res) => res.send('Willkommen im Dashboard'));
app.get('/login', checkNotAuthn, (req, res) => res.send('Bitte logge dich ein'));

// Logout (Method-Override benötigt)
// app.delete('/logout', (req, res) => {
//   req.logOut(err => {
//     if (err) return next(err);
//     res.redirect('/login');
//   });
// });

// Router einbinden
app.use('/auth', router);

// Exportiere das Router-Objekt
module.exports = router;