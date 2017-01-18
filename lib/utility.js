var request = require('request');
var db = require('../app/config.js');
var bcrypt = require('bcrypt-nodejs');
var User = require('../app/models/user.js');
// var Promise = require('bluebird'); // may not need this

exports.getUrlTitle = function(url, cb) {
  request(url, function(err, res, html) {
    if (err) {
      console.log('Error reading url heading: ', err);
      return cb(err);
    } else {
      var tag = /<title>(.*)<\/title>/;
      var match = html.match(tag);
      var title = match ? match[1] : url;
      return cb(err, title);
    }
  });
};

var rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;

exports.isValidUrl = function(url) {
  return url.match(rValidUrl);
};

/************************************************************/
// Add additional utility functions below
/************************************************************/
exports.authenticateSession = function (req, res, userName) {
  // console.log('Creating session');
  // return req.session.regenerate(function() {
  //   req.session.user = userName;
  //   res.redirect('/');
  // });
};

exports.authenticateUserPass = function (username, password, callback) {
  //check if username is present in the database
  new User ({username: username}).fetch()
  .then(function(model) {
    if (!model) {
      callback(null, false);
    } else {
      //if yes, compare stored password with input password from client
      var storedHash = model.get('password');
      bcrypt.compare(password, storedHash, function(err, res) {
        if (err) { callback(err, null); } else {
          //callback to specify whether there is a match
          callback(null, res);
        }
      });
    }
  });
};

// exports.authenticateUserPass('user', 'padss', function(err, match) {
//   if (err) { console.log(err); }
// });


// checkUser authenticates based on session cookies
exports.checkUser = function(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
};
