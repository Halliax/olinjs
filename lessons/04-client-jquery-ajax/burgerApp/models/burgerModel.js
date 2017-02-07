var mongoose = require('mongoose');

// Create ingredient Schema
var burgerSchema = mongoose.Schema({
  orderNumber: Number,
  ingredients: [String]
});

module.exports = mongoose.model("Burger", burgerSchema);
