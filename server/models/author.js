var mongoose = require('mongoose');

var authorSchema = new mongoose.Schema({
	name: { type: String, required: '{PATH} is required!'},
	bio: { type: String, required: '{PATH} is required!'},
	photo: { type: String, required: '{PATH} is required!'}
});

authorSchema.pre('save', function(next){
  next();
});

module.exports = mongoose.model('Author', authorSchema);
