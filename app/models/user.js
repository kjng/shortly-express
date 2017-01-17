var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');


var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,

  initialize: function() {
    this.on('creating', function(model, attrs, options) {
      // Get pass attribute from model
      // Hash pass
      // Set password to hash
      var salt = bcrypt.genSaltSync();
      var pass = bcrypt.hash(model.get('password'), salt, function(err, results) {
        if (err) {
          throw err;
        } else {
          model.set('password', results);
        }
      });
    });
  }
});



module.exports = User;