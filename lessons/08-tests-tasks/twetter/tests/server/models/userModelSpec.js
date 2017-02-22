require('./../../../app'); // to connect to the database
var expect = require('chai').expect;
var User = require('./../../../models/userModel');

describe('User Model', function() {
  it('should create a new user', function(done) {
    var user = new User({
      username: 'Merf',
      password: 'merferf',
      _id: '589e2014a2a9d1217319b0e7'
    });
    user.save(function(err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  it('should remove a user by id', function(done) {
    User.findOneAndRemove({ '_id': '589e2014a2a9d1217319b0e7' }, function(err, user) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
});
