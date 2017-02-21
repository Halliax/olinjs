var mongoose = require('mongoose');

// Create twet Schema
var twetSchema = mongoose.Schema({
  bodyText: String,
  user: String,
  userId: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model("Twet", twetSchema);
