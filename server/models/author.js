var mongoose = require('mongoose');

var authorSchema = new mongoose.Schema({
	name: { type: String, required: '{PATH} is required!'},
	bio: { type: String},
	photo: { type: String, required: '{PATH} is required!'},
	quote: { type: String}
});

authorSchema.pre('save', function(next){
  next();
});

authorSchema.index({ name: 'text', bio: 'text', quote: 'text'});

module.exports = mongoose.model('Author', authorSchema);
