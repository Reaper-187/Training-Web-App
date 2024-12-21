const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/LoginAndValidation/UserLoginSchema');
const { validateUser } = require('../models/LoginAndValidation/YupValidation');
const passport = require('passport');


// methode Override überschreibt die Funktion dann kommt action"/logut?_method=DELETE"
  router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error with logout' });
      }
      res.clearCookie('connect.sid'); // Cookie entfernen
      res.status(200).json({ success: true, message: 'Logout successfully' });
    });
  });

  
  // Prüft ob User eingeloggt ist   
  router.post('/auth/check', (req, res) => {
    // console.log('Session-Daten in /auth/check:', req.session);
    if (req.session.passport && req.session.passport.user) {
      // console.log('Session-Daten in /auth/check:', req.session);
      res.status(200).json({ loggedIn: true });
      console.log('lggedIn ist True', ({loggedIn: true}));
      
    } else {
      res.status(200).json({ loggedIn: false });
      console.log('loggedIn bleibt Fasle',({loggedIn: false}));
    }
  });

  router.post('/register',  async (req, res) => {
    try {
      await validateUser(req.body);
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();
      res.status(201).json({
        success: true,
        message: 'Benutzer erfolgreich registriert!',
        user: { id: savedUser.id, name: savedUser.name, email: savedUser.email },
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message }); // Fehlerfall mit success: false
    }
  });


  router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Serverfehler' });
      }
      if (!user) {
        return res.status(401).json({ success: false, message: 'Ungültige Anmeldedaten' });
      }

      req.logIn(user, err => {
        if (err) {
          console.log('Fehler beim Login:', err);
          return res.status(500).json({ success: false, message: 'Anmeldung fehlgeschlagen' });
        }
        // console.log('Session nach Login:', req.session);
        req.session.loggedIn = true;
        res.status(200).json({
          success: true,
          message: 'Login erfolgreich',
          user: { email: user.email }
        });
      });
    })(req, res, next);
  });
  
  router.get('/dashboard', isAuthenticated, (req, res) => {
    res.send('Willkommen im Dashboard');
  });
  
  function isAuthenticated(req, res, next) {
    if (req.session.passport && req.session.passport.user) {
      next(); // Session existiert: Erlaubt
    } else {
      res.status(401).json({ error: 'Nicht autorisiert' }); // Keine Session: Zugriff verweigern
    }
  }


module.exports = router;