var express = require('express');
var db = require('../fakeDatabase');

var names = ["Apple","Apricot","Avocado","Banana","Bilberry","Blackberry","Black Currant","Blueberry","Boysenberry","Currant","Cherry","Cherimoya","Cloudberry","Coconut","Cranberry","Custard Apple","Damson","Date","Dragonfruit","Durian","Elderberry","Feijoa","Fig","Goji Berry",
"Gooseberry","Grape","Raisin","Grapefruit","Guava","Honeyberry","Huckleberry","Jabuticaba","Jackfruit","Jambul","Jujube","Juniper Berry","Kiwi","Kumquat","Lemon","Lime","Loquat","Longan","Lychee","Mango","Marionberry","Melon","Cantaloupe","Honeydew","Watermelon",
"Miracle Fruit","Mulberry","Nectarine","Nance","Olive","Orange","Blood Orange","Clementine","Mandarin","Tangerine","Papaya","Passionfruit","Peach","Pear","Persimmon","Physalis","Plantain","Plum","Prune","Pineapple","Pluot","Pomegranate","Pomelo","Mangosteen","Quince",
"Raspberry","Salmonberry","Rambutan","Red Currant","Salal Berry","Salak","Satsuma","Star Fruit","Solanum","Strawberry","Tamarillo","Tamarind","Ugli Fruit","Yuzu","Eggplant","Aubergine","Pumpkin","Tomato"];

var colors = ["Apricot","Aquamarine","Bittersweet","Black","Blue","Blue-Green","Blue-Violet","Brick-Red","Brown","Burnt-Orange","Cadet-Blue","Carnation-Pink","Cerulean","Cornflower-Blue","Cyan","Dandelion","Dark-Orchid","Emerald","Forest-Green","Fuschia","Goldenron","Gray","Green","Green-Yellow",
"Grey","Jungle-Green","Lavender","Lime-Green","Magenta","Mahogany","Maroon","Melon","Midnight-Blue","Mulberry","Navy-Blue","Olive-Green","Orange","Orange-Red","Orchid","Peach","Periwinkle","Pine-Green","Plum","Process-Blue","Purple","Raw-Sienna","Red","Red-Orange","Red-Violet",
"Rhodamine","Royal-Blue","Royal-Purple","Rubine-Red","Salmon","Sea-Green","Sepia","Sky-Blue","Spring-Green","Tan","Teal-Blue","Thistle","Turquoise","Violet","Violet-Red","White","Strawberry","Yellow","Yellow-Green","Yellow-Orange"];

//function that returns a new cat, given name and color parameters
function Cat(){
  var cat = {
    name: names[Math.floor(Math.random()*names.length)],
    color: [colors[Math.floor(Math.random()*colors.length)],colors[Math.floor(Math.random()*colors.length)]],
    age: Math.floor(Math.random() * 1001)
  };
  return cat;
}

// static home page
var home = function(req,res) {
  res.render("home");
}

// create new randomized cat
var newCat = function(req, res) {
  var cat = Cat();
  db.add(cat);
  res.render("newCat",{"cat":[cat]});
};

//get all cats
var cats = function(req, res) {
  allCats = db.getAll();
  // adapted from http://stackoverflow.com/questions/1069666/sorting-javascript-object-by-property-value
  allCats.sort(function(a, b) {
    return a.age - b.age;
  });
  res.render("cats", {"cat": allCats});
};

var bycolor = function(req,res) {
  var cats = db.getAll();
  var rightCats = [];
  var sortColor = req.params.color;
  cats.forEach(function(cat) {
    if (cat.color[0] === sortColor || cat.color[1] === sortColor) {
      rightCats.push(cat);
    }
  });
  res.render("cats", {"cat": rightCats});
};

var deleteOldCat = function(req,res){
  var cats = db.getAll();
  var oldestCat = cats[0];
  var index = 0;
  cats.forEach(function(cat, i) {
    if (cat.age > oldestCat.age) {
      oldestCat = cat;
      index = i;
    }
  });
  db.remove(index);
  res.render("deleteCat",{"deleted":[oldestCat]})
};


module.exports.home = home;
module.exports.newCat = newCat;
module.exports.cats = cats;
module.exports.bycolor = bycolor;
module.exports.deleteOldCat = deleteOldCat;
