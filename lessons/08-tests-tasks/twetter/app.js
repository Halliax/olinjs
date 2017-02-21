var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var session = require("express-session");
var index = require('./routes/index');
var auth = require('./auth');
var User = require('./models/userModel.js');

var app = express();

var PORT = process.env.PORT || 3000;
var mongoURI = process.env.MONGOURI || 'mongodb://localhost/twetter';

var mongoose = require('mongoose');
mongoose.connect(mongoURI);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Database Connection Successful");
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new FacebookStrategy({
    clientID: auth.FACEBOOK_APP_ID,
    clientSecret: auth.FACEBOOK_APP_SECRET,
    callbackURL: auth.FACEBOOK_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({facebookId: profile.id}, function(err, result) {
      if(err) {
        return console.error(err);
      }
      var user;
      if (result === null) {
        user = new User({
          username: profile.displayName,
          facebookId: profile.id
        });
        user.save(function(err) {
          if(err) {
            return console.error("error saving user:", err);
          }
        });
      }
      else {
        user = result;
      }
      return done(err, user);
    });
  }
));

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        user = new User({
          username: username,
          password: password
        });
        user.save(function(err) {
          if(err) {
            return console.error("error saving user:", err);
          }
        });
        return done(null, user);
      }
      if (user.password !== password) { return done(null, false); }
      return done(null, user);
    });
  }
));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'BIGQZYFRhyWcdZl5q6cpdUpI',
  resave: false,
  saveUninitialized: false ,
  cookie: {}
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


app.get('/', index.dashGET);
app.get('/login', index.loginGET);
app.get('/logout', index.logoutGET);
app.get('/auth/facebook', index.fbAuthGET);
app.get('/auth/facebook/callback', index.fbAuthCallback);
app.get('/user', ensureAuthenticated, index.userGET);
app.post('/post', index.twetPOST);
app.post('/login', index.loginPOST);

app.listen(PORT, function() {
  console.log("Running on port: ", PORT);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
    res.sendStatus(401);
}

module.exports = app;
