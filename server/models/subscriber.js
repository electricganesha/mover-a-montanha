var mongoose = require('mongoose');

var subscriberSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	dateOfSubscription : { type: Date, required: true, default: Date.now },
	active: { type: Boolean, required:true, default:true}
});

subscriberSchema.pre('save', function(next){
  next();
});

module.exports = mongoose.model('Subscriber', subscriberSchema);
