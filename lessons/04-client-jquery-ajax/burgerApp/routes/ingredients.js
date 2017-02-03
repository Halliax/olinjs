var path = require('path');
var express = require('express');
var Ingredient = require('../models/ingredientModel.js');

Ingredient.find({}, function(err, ingredients){
  console.log(ingredients);
});

var routes = {};

//get all ingredients, render list
routes.ingGET = function(req, res) {
  Ingredient.find({}).sort({price: 1}).exec(function(err,ingredients) {
    if(err) return console.error(err);
    res.render("home", {"ingredient": ingredients});
  });
};

//add a new ingredient, pass back some stuff
routes.ingPOST = function(req, res) {
  var ingredient = new Ingredient({
    name: req.body.name,
    price: req.body.price,
    inStock: req.body.inStock
  });
  ingredient.save(function(err) {
    if(err) {
      console.error("error saving ingredient:", err);
    }
  });
  res.send(ingredient);
};

routes.stockPOST = function(req, res) {
  var id = req.body.id;
  Ingredient.findById(id, function (err,doc) {
    if(err) {
      console.error("error finding document:", err);
    }
    ingredient = doc;
    var inStock = !ingredient.inStock;
    ingredient.update({$set: {'inStock': inStock}}, function(err) {
      if(err) {
        console.error("error updating inStock:", err);
      }
    });
    res.send(ingredient);
  });
};

// routes.editPOST = function(req, res) {
//   var id = req.body.id;
//   var name = req.body.name;
//   var price = req.body.price;
//   Ingredient.findById(id, function (err,doc) {
//     if(err) {
//       console.error("error finding document:", err);
//     }
//     ingredient = doc;
//     if name === ('') {
//       name = ingredient.name;
//     }
//     if price === (null) {
//       price = ingredient.price;
//     }
//     ingredient.update({$set: {'name': name,'price': price}}, {new:true}, function(err, newDoc) {
//       if(err) {
//         console.error("error updating name/price:", err);
//       }
//       res.send(newDoc);
//     });
//   });
// };

module.exports = routes;
