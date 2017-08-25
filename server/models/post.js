var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	title: { type: String},
	body: { type: String},
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author'},
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
	programmed_to_post: { type: Date, default: Date.now },
	isDraft: { type: Boolean, default: true},
	isAuto: { type: Boolean, default: true}, //se o post deve ser publicado automaticamente segundo a agenda ou nao
	recap: { type:String},
	categories: [{ type:mongoose.Schema.ObjectId, ref:'Category'}]
});

postSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  next();
});

postSchema.index({ "title": 'text', "body": 'text', "author.name": 'text', "recap": 'text', "categories.tag": 'text' });

module.exports = mongoose.model('Post', postSchema);
