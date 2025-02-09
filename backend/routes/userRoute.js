const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/LoginAndValidation/UserLoginSchema');
const { validateUser } = require('../models/LoginAndValidation/YupValidation');
const passport = require('passport');
const nodemailer = require('nodemailer')
const crypto = require('crypto');

const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS

// methode Override überschreibt die Funktion dann kommt action"/logut?_method=DELETE"
router.get('/logout', (req, res) => {
  // Damit werden alle Daten die in der Sitzung gespeichert sind gelöscht
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
  if (req.session.passport && req.session.passport.user) {
    res.status(200).json({ loggedIn: true });
    // console.log('lggedIn ist True', ({loggedIn: true}));
  } else {
    res.status(200).json({ loggedIn: false });
    // console.log('loggedIn bleibt Fasle',({loggedIn: false}));
  }
});


router.post('/register', async (req, res) => {
  try {
    await validateUser(req.body);

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Token generieren
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 Stunden gültig

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      isVerified: false, // wird temporär gespeichert bis Email Verfy ist !!!
      verificationToken,
      tokenExpires
    });

    const savedUser = await newUser.save();

    const verifyLink = `http://localhost:3000/verify?token=${verificationToken}`;

    // E-Mail versenden
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: 'abdulcheik3@gmail.com',
      to: req.body.email,
      subject: 'E-Mail-Verifizierung',
      text: `Bitte klicke auf den folgenden Link, um deine E-Mail-Adresse zu verifizieren: ${verifyLink}`,
      html: `<p>Bitte klicke auf den folgenden Link, um deine E-Mail-Adresse zu verifizieren:</p>
             <a href="${verifyLink}">${verifyLink}</a>`
    });

    // Antwort erst nach erfolgreichem E-Mail-Versand senden
    res.status(201).json({
      success: true,
      message: 'Registrierung erfolgreich! Bitte überprüfe deine E-Mails zur Verifizierung.',
      user: { id: savedUser.id, name: savedUser.name, email: savedUser.email },
    });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message }); // Fehlerfall mit success: false
  }
});



router.get('/verify', async (req, res) => {
  const { token } = req.query;

  try {
    // Benutzer mit dem Token finden
    const user = await User.findOne({
      verificationToken: token,
      tokenExpires: { $gt: Date.now() } // Token darf nicht abgelaufen sein
    });

    if (!user) {
      return res.status(400).send('Token ist ungültig oder abgelaufen.');
    }

    // Benutzer verifizieren
    user.isVerified = true;
    user.verificationToken = undefined; // Token entfernen
    user.tokenExpires = undefined; // Ablaufdatum entfernen
    await user.save();

    res.status(200).send('E-Mail erfolgreich verifiziert! Du kannst dich jetzt einloggen.');
  } catch (err) {
    console.error('Fehler bei der Verifizierung:', err);
    res.status(500).send('Interner Serverfehler.');
  }
});



router.post('/login', (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Serverfehler' });
    }
    if (!user) {
      return res.status(401).json({ success: false, message: 'Ungültige Anmeldedaten' });
    }

    // Überprüfung, ob der Benutzer verifiziert ist
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Bitte bestätige zuerst deine E-Mail-Adresse, um dich einzuloggen.',
      });
    }

    req.logIn(user, err => {
      if (err) {
        console.log('Fehler beim Login:', err);
        return res.status(500).json({ success: false, message: 'Anmeldung fehlgeschlagen' });
      }

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