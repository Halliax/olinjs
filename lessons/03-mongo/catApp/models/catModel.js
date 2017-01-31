var mongoose = require('mongoose');

// Create cat Schema
var catSchema = mongoose.Schema({
  name: String,
  colors: [String],
  age: Number
});

module.exports = mongoose.model("Cat", catSchema);
