var mongoose = require('mongoose');

var tokenSchema = new mongoose.Schema({
  token: {type: String},
  email: {type: String},
  createDate: {type: Date, default: Date.now}
});

tokenSchema.pre('save', function(next){
  next();
});

tokenSchema.methods.hasExpired= function(){
    var now = new Date();
    return (now - createDate) > 1800000; //token is older than half an hour (1800000 miliseconds)
};

mongoose.model('Token',tokenSchema)
module.exports = mongoose.model('Token');
