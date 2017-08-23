var mongoose = require('mongoose');

var mailConfigSchema = new mongoose.Schema({
	mail: { type: String},
	host: { type: String},
	port: { type: String},
	service: { type: String},
	password: {type: String},
	emailHour: { type: String },
	subject: { type: String },
	header: { type: String},
});

mailConfigSchema.pre('save', function(next){
  next();
});

module.exports = mongoose.model('MailConfig', mailConfigSchema);
