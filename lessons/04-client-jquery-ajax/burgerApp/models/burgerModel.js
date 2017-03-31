var mongoose = require('mongoose');

// Create ingredient Schema
// Create burger schema
// Try to make sure you update your comments after making changes!
var burgerSchema = mongoose.Schema({
  orderNumber: Number,
  ingredients: [String]
});

module.exports = mongoose.model("Burger", burgerSchema);
