const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const UserModel = require("../models/User.js");

// maps the passport fields to the names of fields in database
const customField = {
  usernameField: "email",
  passwordField: "password"
};

const verifyUser = (email, password, done) => {
  UserModel.findOne({email: email})
    .then(async userChosen => {
      if (!userChosen) {
        //If not found, set flash message
        return done(null, false, {message: "Email not found"});
      }
      //  If user is found validate password entered in form if it matches.
      const isCorrect = await userChosen.isValidPassword(password);
      if (!isCorrect) {
        return done(null, false, {message: "Incorrect Password"});
      } else {
        // Send the user information to the next middleware

        return done(null, userChosen, {message: "Logged in Successfully"});
      }
    })
    .catch(err => {
      done(err);
    });
};

const strategy = new LocalStrategy(customField, verifyUser);

// const strategy = new LocalStrategy(
//   customField,
//   async (email, password, done) => {
//     try {
//       // Lookup email in database and return user data
//       const userChosen = await UserModel.findOne({email: email});
//       if (!userChosen) {
//         //If not found, set flash message
//         return done(null, false, {message: "Email not found"});
//       }
//       // If user is found validate password entered in form if it matches.
//       const isCorrect = await userChosen.isValidPassword(password);
//       if (!isCorrect) {
//         return done(null, false, {message: "Incorrect Password"});
//       } else {
//         // Send the user information to the next middleware
//         return done(null, userChosen);
//       }
//     } catch (error) {
//       return done(error);
//     }
//   }
// );
// set strategy as local
passport.use(strategy);
// by default, passport uses sessions to maintain login status ...
// you have to determine what to save in session via serializeUser
// and deserializeUser. In our case, we will save the email in the
// session data
passport.serializeUser((user, done) => done(null, user.email));
passport.deserializeUser((email, done) => {
  return UserModel.findOne({email: email})
    .then(user => {
      done(null, user);
    })
    .catch(err => done(err));
  // UserModel.findOne({email: email}).then((err, user) => done(err, user));
});
