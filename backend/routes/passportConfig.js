const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')


// passportConfig.js

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    try {
      const user = await getUserByEmail(email);  // Warten auf das Ergebnis der DB-Abfrage
      if (!user) {
        return done(null, false, { message: 'No user with that email' });
      }

      const match = await bcrypt.compare(password, user.password);  // Warten auf den Passwortvergleich
      if (match) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect' });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
  
  passport.serializeUser((user, done) => done(null, user.id));  // serialisiert den Benutzer
  passport.deserializeUser(async (id, done) => {  // Hier sicherstellen, dass du auf das Ergebnis wartest
    const user = await getUserById(id);  // Warten auf die Rückgabe des Benutzers aus der DB
    return done(null, user);
  });
}

module.exports = initialize;



// function initialize(passport, getUserByEmail, getUserById) {
//   const authenticateUser = async (email,password,done) => {
//     const user = await getUserByEmail(email)
//     if (!user) {
//       return done(null, false, { message: 'No user with that email' });
//     }    
//   try {
//     if (await bcrypt.compare(password, user.password)) {
//       return done(null, user)
//     } else {
//       return done(null, false, {message: 'Password incorrect'})
//     }
//   } catch (e) {
//     return done(e)
//   }
// }
//   passport.use(new LocalStrategy({usernameField: 'email'},
//   authenticateUser))
//   passport.serializeUser((user, done) =>done(null, user.id))
//   passport.deserializeUser((id, done) => {
//     return done (null, getUserById(id))
//   })
// }

// module.exports = initialize