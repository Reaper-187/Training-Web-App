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
router.get('/auth/check', (req, res) => {
  if (req.session.passport && req.session.passport.user) {
    res.status(200).json({ loggedIn: true });
  } else {
    res.status(200).json({ loggedIn: false });
  }
});


router.post('/register', async (req, res) => {
  try {
    console.log("⏳ Registrierung gestartet für:", req.body.email);

    await validateUser(req.body);
    console.log("✅ User-Daten validiert.");

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log("🔐 Passwort gehasht.");

    // Token generieren
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 Stunden gültig

    console.log("🆕 Token generiert:", verificationToken);

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      isVerified: false, 
      verificationToken,
      tokenExpires
    });

    const savedUser = await newUser.save();
    console.log("💾 Benutzer gespeichert:", savedUser);

    const verifyLink = `${process.env.FRONTEND_URL_PROD}/verify?token=${verificationToken}`;
    console.log("🔗 Verifizierungslink erstellt:", verifyLink);

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

    console.log("📧 E-Mail erfolgreich gesendet an:", req.body.email);

    res.status(201).json({
      success: true,
      message: 'Registrierung erfolgreich! Bitte überprüfe deine E-Mails zur Verifizierung.',
      user: { id: savedUser.id, name: savedUser.name, email: savedUser.email },
    });

  } catch (err) {
    console.error("❌ Fehler bei der Registrierung:", err); // Detaillierter Fehler
    res.status(400).json({ success: false, message: err.message }); 
  }
});




router.get('/verify', async (req, res) => {
  const { token } = req.query;
  console.log("Erhaltenes Token aus Anfrage:", token); // Logge das erhaltene Token

  try {
    // Benutzer mit dem Token finden
    const user = await User.findOne({
      verificationToken: token,
      tokenExpires: { $gt: Date.now() } // Token darf nicht abgelaufen sein
    });

    console.log("Gefundener User vor der Änderung:", user);

    if (!user) {
      console.log("Fehler: Token ungültig oder abgelaufen.");
      return res.status(400).json({ success: false, message: 'Token ist ungültig oder abgelaufen.' });
    }

    // Benutzer verifizieren
    user.isVerified = true;
    user.verificationToken = undefined; // Token entfernen
    user.tokenExpires = undefined; // Ablaufdatum entfernen
    await user.save();

    console.log("User erfolgreich verifiziert:", user);

    return res.status(200).json({ success: true, message: 'E-Mail erfolgreich verifiziert! Du kannst dich jetzt einloggen.' });
  } catch (err) {
    console.error("Fehler bei der Verifizierung:", err);
    res.status(500).json({ success: false, message: 'Interner Serverfehler.' });
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