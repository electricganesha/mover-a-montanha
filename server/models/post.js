var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	title: { type: String},
	body: { type: String},
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author'},
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
	isDraft: { type: Boolean, default: true},
	recap: { type:String},
	categories: [{ type:mongoose.Schema.ObjectId, ref:'Category'}]
});

postSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  next();
});

module.exports = mongoose.model('Post', postSchema);
