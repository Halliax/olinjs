var mongoose = require('mongoose');

// Create user Schema
var userSchema = mongoose.Schema({
  username: String,
  password: String,
  facebookId: String
});

module.exports = mongoose.model("User", userSchema);
