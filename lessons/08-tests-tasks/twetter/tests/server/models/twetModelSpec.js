require('./../../../app'); // to connect to the database
var expect = require('chai').expect;
var Twet = require('./../../../models/twetModel');

describe('Twet Model', function() {
  it('should create a new twet entry', function(done) {
    var twet = new Twet({
      bodyText: "school for ants!",
      user: "merf",
      userId: '589e2014a2a9d1217319b0e7'
    });
    twet.save(function(err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  it('should remove a twet by id', function(done) {
    Twet.findOne({}, {sort: {_id: 1}}, function(err, twet) {
      if (err) {
        return done(err);
      }
      Twet.remove({ '_id': twet._id }, function(err) {
        if (err) {
          return done(err);
        }
        done();
      });
    });
  });

});
