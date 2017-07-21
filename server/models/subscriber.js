var mongoose = require('mongoose');

var subscriberSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
});

subscriberSchema.pre('save', function(next){
  next();
});

module.exports = mongoose.model('Subscriber', subscriberSchema);
