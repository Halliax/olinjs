var path = require('path');
var express = require('express');
var Ingredient = require('../models/ingredientModel.js');
var Burger = require('../models/burgerModel.js');

Ingredient.find({}, function(err, ingredients){
  console.log(ingredients);
});

Burger.find({}, function(err, burgers) {
  console.log(burgers);
});

var routes = {};
var orderCount = 0;

//get all ingredients, render list
routes.ingGET = function(req, res) {
  Ingredient.find({}).sort({price: 1}).exec(function(err,ingredients) {
    if(err) return console.error(err);
    res.render("ingredients", {"ingredient": ingredients});
  });
};

routes.orderGET = function(req, res) {
  Ingredient.find({}).sort({price: 1}).exec(function(err,ingredients) {
    if(err) return console.error(err);
    res.render("order", {"ingredient": ingredients});
  });
};

routes.burgerGET = function(req, res) {
  Burger.find({}).sort({orderNumber: 1}).exec(function(err,burgers) {
    if(err) return console.error(err);
    res.render("kitchen", {"burger": burgers});
  });
};

routes.burgerPOST = function(req, res) {
  var burger = new Burger({
    orderNumber: orderCount,
    ingredients: req.body['ingredients[]']
  });
  burger.save(function(err) {
    if(err) {
      console.error("error saving burger:", err);
    }
  });
  orderCount += 1;
  res.send(burger);
};

routes.burgerDELETE = function(req, res) {
  var id = req.body.id;
  Burger.findById(id, function (err,doc) {
    if(err) {
      console.error("error finding document:", err);
    }
    burger = doc;
    burger.remove(function (err, doc) {
      res.send(doc);
    });
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

routes.editPOST = function(req, res) {
  var id = req.body.id;
  Ingredient.findById(id, function (err,doc) {
    if(err) {
      console.error("error finding document:", err);
    }
    ingredient = doc;
    var name = req.body.name;
    var price = req.body.price;
    if (name === '') {
      name = ingredient.name;
    }
    if (price === '') {
      price = ingredient.price;
    }
    Ingredient.findOneAndUpdate({'_id': id},{$set: {'name': name,'price': price}}, {new:true}, function(err, newDoc) {
      if(err) {
        console.error("error updating name/price:", err);
      }
      console.log(newDoc);
      res.send(newDoc);
    });
  });
};

module.exports = routes;
