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
    console.log('Resp-AuthCheck')
    res.status(200).json({ loggedIn: true });
  } else {
    res.status(200).json({ loggedIn: false });
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
    const verifyLink = `${process.env.FRONTEND_URL_PROD}/verify?token=${verificationToken}`;

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

    res.status(200).json({ success: true, message: 'E-Mail erfolgreich verifiziert! Du kannst dich jetzt einloggen.' });
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

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  // E-Mail Validierung
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Ungültige E-Mail-Adresse." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "E-Mail nicht gefunden." });
    }

    // Überprüfen, ob der Code noch nicht abgelaufen ist
    if (user.resetCodeExpires > Date.now()) {
      return res.status(400).json({ message: "Ein Reset-Code wurde bereits gesendet. Bitte warte, bis der Code abläuft." });
    }

    const resetCode = Math.floor(1000 + Math.random() * 9000); // 4-stelliger Code

    // Reset-Code und Ablaufdatum speichern
    user.resetCode = resetCode;
    user.resetCodeExpires = Date.now() + 600000; // Code 10 Minuten gültig

    await user.save();
    // Code per E-Mail senden
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
      subject: 'Passwort-Reset-Code',
      text: `Dein 4-stelliger Code zum Zurücksetzen des Passworts lautet: ${resetCode}. Dieser Code ist 10 Minuten gültig.`,
    });

    res.json({ message: "Code zum Zurücksetzen gesendet." });
  } catch (error) {
    console.error("Fehler beim Senden des Codes:", error);
    res.status(500).json({ message: "Serverfehler" });
  }
});


router.post("/verify-reset-code", async (req, res) => {
  const { email, resetCode } = req.body;
  try {
    const resetCodeInt = parseInt(resetCode);
    const user = await User.findOne({
      email,
      resetCode: resetCodeInt,
      resetCodeExpires: { $gt: Date.now() },
    });

    if (user && user.resetCode === resetCodeInt && user.resetCodeExpires > Date.now()) {
      res.json({ message: "Code verifiziert. Du kannst nun dein Passwort ändern." });
    } else {
      res.status(400).json({ message: "Ungültiger oder abgelaufener Code." });
    }

  } catch (error) {
    console.error("Fehler bei der Code-Verifikation:", error);
    res.status(500).json({ message: "Serverfehler" });
  }
});




router.post("/reset-password", async (req, res) => {
  const { email, resetCode, newPassword } = req.body;

  try {
    const user = await User.findOne({
      email,
      resetCode,
      resetCodeExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Code is invalid or expired.");
      return res.status(400).json({ message: "Ungültiger oder abgelaufener Code." });
    }

    // Überprüfen, ob das neue Passwort mit dem alten übereinstimmt
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: "Das neue Passwort darf nicht mit dem alten übereinstimmen." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;

    await user.save();

    res.json({ message: "Passwort erfolgreich geändert." });
  } catch (error) {
    console.error("Fehler beim Zurücksetzen des Passworts:", error);
    res.status(500).json({ message: "Serverfehler" });
  }
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