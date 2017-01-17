var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');


var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,

  initialize: function() {
    this.on('creating', this.hashPassword, this);
  },

  hashPassword: function(model, attrs, options) {
    // Get pass attribute from model
    // Hash pass
    // Set password to hash
    return new Promise(function(resolve, reject) {
      var salt = bcrypt.genSaltSync();
      var pass = bcrypt.hash(model.get('password'), salt, function(progess) {}, function(err, hash) {
        if (err) {
          reject(err);
        } else {
          model.set('password', hash);
          resolve(hash);
        }
      });
    });
  }
});



module.exports = User;
