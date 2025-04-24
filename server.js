const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const ejs = require('ejs');

const app = express();
const port = 3000;

//session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//start passport
app.use(passport.initialize());
app.use(passport.session());

//views use ejs
app.set('view engine', 'ejs');

//id and secret
const GOOGLE_CLIENT_ID = 'id';
const GOOGLE_CLIENT_SECRET = 'secret';

//define googlw strategy
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);  // Log the profile object to see if photos are included
    return done(null, profile);
  }
));


//serialize store info
passport.serializeUser(function(user, done) {
  done(null, user);
});

//deserialize ambil info
passport.deserializeUser(function(user, done) {
  done(null, user);
});

//home
app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

//trigger google auth
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

//trigger callback redirect
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {

    res.redirect('/profile');
  }
);

//profile
app.get('/profile', (req, res) => {
  if (!req.user) {
    return res.redirect('/');  
  }

  //minta user json
  const userProfile = req.user._json;
  //render nama email pic
  res.render('profile', {
    name: userProfile.name,
    email: userProfile.email,
    picture: userProfile.picture
  });
});



//logout
app.get('/logout', (req, res) => {
  req.logout((err) => {
    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
