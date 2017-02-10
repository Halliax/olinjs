var path = require('path');
var express = require('express');
var Twet = require('../models/twetModel.js');
var User = require('../models/userModel.js');

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

//log in with a new or existing user
routes.loginPOST = function(req, res) {
  User.findOne({username: req.body.username}, function(err, result) {
    if(err) {
      return console.error(err);
    }
    var user;
    if (result === null) {
      user = new User({
        username: req.body.username
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
    req.session.user = user;
    res.redirect('/main');
  });
};

//get all twets and users, render list (ample use of
//https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions)
routes.twetGET = function(req, res) {
  if (req.session && req.session.user) {
    console.log("user session true");
    User.findOne({username: req.session.user.username}, function (err, user) {
      if (user) {
        console.log(user);
        res.locals.currentUser = user;
      }
    });
  }
  Twet.find().sort({_id: -1}).exec(function(err,twets) {
    if(err) return console.error(err);
    User.find().sort({_id: -1}).exec(function (err,users) {
      if(err) return console.error(err);
      res.render("twets", {"twet": twets, "user": users});
    });
  });
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


module.exports = routes;
