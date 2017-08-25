var mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
	tag: { type: String, required: true, unique: true },
});

categorySchema.pre('save', function(next){
  next();
});

categorySchema.index({ tag: 'text'});

module.exports = mongoose.model('Category', categorySchema);
