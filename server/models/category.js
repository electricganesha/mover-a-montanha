var mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
	tag: { type: String, required: '{PATH} is required!'},
});

categorySchema.pre('save', function(next){
  next();
});

module.exports = mongoose.model('Category', categorySchema);
