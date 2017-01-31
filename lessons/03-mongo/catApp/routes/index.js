var express = require('express');
var Cat = require('../models/catModel.js');

Cat.find({}, function(err, cats){
  console.log(cats);
});

var names = ["Apple","Apricot","Avocado","Banana","Bilberry","Blackberry","Black Currant","Blueberry","Boysenberry","Currant","Cherry","Cherimoya","Cloudberry","Coconut","Cranberry","Custard Apple","Damson","Date","Dragonfruit","Durian","Elderberry","Feijoa","Fig","Goji Berry",
"Gooseberry","Grape","Raisin","Grapefruit","Guava","Honeyberry","Huckleberry","Jabuticaba","Jackfruit","Jambul","Jujube","Juniper Berry","Kiwi","Kumquat","Lemon","Lime","Loquat","Longan","Lychee","Mango","Marionberry","Melon","Cantaloupe","Honeydew","Watermelon",
"Miracle Fruit","Mulberry","Nectarine","Nance","Olive","Orange","Blood Orange","Clementine","Mandarin","Tangerine","Papaya","Passionfruit","Peach","Pear","Persimmon","Physalis","Plantain","Plum","Prune","Pineapple","Pluot","Pomegranate","Pomelo","Mangosteen","Quince",
"Raspberry","Salmonberry","Rambutan","Red Currant","Salal Berry","Salak","Satsuma","Star Fruit","Solanum","Strawberry","Tamarillo","Tamarind","Ugli Fruit","Yuzu","Eggplant","Aubergine","Pumpkin","Tomato"];

var colors = ["Apricot","Aquamarine","Bittersweet","Black","Blue","Blue-Green","Blue-Violet","Brick-Red","Brown","Burnt-Orange","Cadet-Blue","Carnation-Pink","Cerulean","Cornflower-Blue","Cyan","Dandelion","Dark-Orchid","Emerald","Forest-Green","Fuschia","Goldenron","Gray","Green","Green-Yellow",
"Grey","Jungle-Green","Lavender","Lime-Green","Magenta","Mahogany","Maroon","Melon","Midnight-Blue","Mulberry","Navy-Blue","Olive-Green","Orange","Orange-Red","Orchid","Peach","Periwinkle","Pine-Green","Plum","Process-Blue","Purple","Raw-Sienna","Red","Red-Orange","Red-Violet",
"Rhodamine","Royal-Blue","Royal-Purple","Rubine-Red","Salmon","Sea-Green","Sepia","Sky-Blue","Spring-Green","Tan","Teal-Blue","Thistle","Turquoise","Violet","Violet-Red","White","Strawberry","Yellow","Yellow-Green","Yellow-Orange"];

//function that returns a new cat, given name and color parameters
function makeCat(){
  var cat = new Cat({
    name: names[Math.floor(Math.random()*names.length)],
    colors: [colors[Math.floor(Math.random()*colors.length)],colors[Math.floor(Math.random()*colors.length)]],
    age: Math.floor(Math.random() * 1001)
  });
  return cat;
};

// static home page, format: /home
var home = function(req,res) {
  res.render("home");
};

// create new randomized cat, format: /cats/new
var newCat = function(req, res) {
  var cat = makeCat();
  cat.save(function(err) {
    if(err) {
      console.log("error saving cat:", err);
    }
  });
  res.render("newCat",{"cat":[cat]});
};

//get all cats, render list, format: /cats
var cats = function(req, res) {
  Cat.find({}).sort({age: 1}).exec(function(err,cats) {
    if(err) return console.error(err);
    res.render("cats", {"cat": cats});
  });
};

//get all cats that have a given color, format: /cats/bycolor/color
var bycolor = function(req,res) {
  Cat.find({colors: req.params.color}).sort({age: 1}).exec(function(err,cats) {
    if(err) return console.error(err);
    res.render("cats", {"cat": cats});
  });
};

//get all cats within (not inclusive) a given age bound, format: /cats/byage/lower-upper
var byage = function(req,res) {
  Cat.find({age: {$gt: req.params.lower,$lt: req.params.upper}}).sort({age: 1}).exec(function(err,cats) {
    if(err) return console.error(err);
    res.render("cats", {"cat": cats});
  });
};

// delete the oldest cat, format: /cats/delete/old
var deleteOldCat = function(req,res){
  Cat.findOne({}).sort({age:-1}).exec(function(err,cat) {
    if(err) return console.error(err);
    oldestCat = cat;
    cat.remove();
    res.render("deleteCat",{"deleted":[oldestCat]})
  });
};


module.exports.home = home;
module.exports.newCat = newCat;
module.exports.cats = cats;
module.exports.bycolor = bycolor;
module.exports.byage = byage;
module.exports.deleteOldCat = deleteOldCat;
