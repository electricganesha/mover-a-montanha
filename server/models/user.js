var mongoose = require('mongoose'),
passportLocalMongoose = require('passport-local-mongoose');

var User = new mongoose.Schema({
  email: {
    type: String,
    required: '{PATH} is required!'
  },
  level: {type: Number},
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'Author'}
});

// Passport-Local-Mongoose will add a username,
// hash and salt field to store the username,
// the hashed password and the salt value

// configure to use email for username field
User.plugin(passportLocalMongoose, { usernameField: 'email' });

User.virtual('password').set(function(password) {
  this._password = password;
  this.salt = this.makeSalt();
  this.hashed_password = this.encryptPassword(password);
}).get(function() {
  return this._password;
});

module.exports = mongoose.model('User', User);
