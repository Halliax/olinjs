var path = require('path');
var express = require('express');
var Twet = require('../models/twetModel.js');
var User = require('../models/userModel.js');
var passport = require('passport');

Twet.find({}, function(err, twets){
  console.log(twets);
});

User.find({}, function(err, users) {
  console.log(users);
});

var routes = {};

//get login form
routes.loginGET = function(req, res) {
  res.render("login");
};

//log out, redirect
routes.logoutGET = function(req, res) {
  req.session.destroy( function() {
    res.redirect('/login');
  });
};

//log in with a new or existing user
routes.loginPOST =
passport.authenticate('local', { successRedirect: '/',
                                 failureRedirect: '/login' });


//log in with facebook
routes.fbAuthGET = passport.authenticate('facebook');

routes.fbAuthCallback =
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' });


//get all twets and users, render list (ample use of
//https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions)
routes.dashGET = function(req, res) {
  if (req.user) {
    User.findOne({username: req.user.username}, function (err, user) {
      if (user) {
        console.log(user);
        res.locals.currentUser = user;
        Twet.find().sort({_id: -1}).exec(function(err,twets) {
          if(err) return console.error(err);
          User.find().sort({_id: -1}).exec(function (err,users) {
            if(err) return console.error(err);
            res.render("dashboard", {"twet": twets, "user": users});
          });
        });
      }
      else { res.redirect('/login'); }
    });
  }
  else { res.redirect('/login'); }
};


//post a twet, pass back some stuff
routes.twetPOST = function(req, res) {
  var twet = new Twet({
    bodyText: req.body.bodyText,
    user: req.body.user,
    userId: req.body.userId
  });
  twet.save(function(err) {
    if(err) {
      console.error("error saving twet:", err);
    }
  });
  res.send(twet);
};

//utility function to return current session user
routes.userGET = function(req, res) {
  res.send(req.user);
};


module.exports = routes;
