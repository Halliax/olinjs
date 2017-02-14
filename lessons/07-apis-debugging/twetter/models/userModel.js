var mongoose = require('mongoose');

// Create user Schema
var userSchema = mongoose.Schema({
  username: String
});

module.exports = mongoose.model("User", userSchema);
