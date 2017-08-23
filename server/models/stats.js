var mongoose = require('mongoose');

var statsSchema = new mongoose.Schema({
	dateOfAccess: { type: Date, required: true, default: Date.now },
	userIp : { type: String },
  userAgent: { type:String },
  userLocationCountry : { type: String },
  userLocationCity : { type: String }
});

statsSchema.pre('save', function(next){
  next();
});

module.exports = mongoose.model('Stats', statsSchema);
