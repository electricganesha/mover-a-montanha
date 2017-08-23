var MailConfig = require('../models/mailconfig');

// Subscriber API
module.exports = function(apiRouter){

	// get mail config
	apiRouter.get('/mailconfig', function(req, res){

		MailConfig.find()
	    .exec(function(err, mailconfig){
	        if(err)
					{
						res.send(err);
						console.log(err);
					}
	        else
					{
						res.json(mailconfig);
					}

	    });
	});

	// add mail config
	apiRouter.post('/mailconfig', function(req, res){

		var mailConfig = new MailConfig();
		mailConfig.mail = req.body.mail;
		mailConfig.host = req.body.host;
    mailConfig.port = req.body.port;
    mailConfig.password = req.body.password;
		mailConfig.service = req.body.service;
    mailConfig.emailHour = req.body.emailHour;
    mailConfig.subject = req.body.subject;
    mailConfig.header = req.body.header;

		mailConfig.save(function(err, config){
			if(err) res.send(err);

			res.json(config);
		})
	});

	// update mailconfig
	apiRouter.put('/mailconfig/:id', function(req, res){
		MailConfig.findById(req.params.id, function(err, mailConfig){

			if(err) res.send(err);

      mailConfig.mail = req.body[0].mail;
  		mailConfig.host = req.body[0].host;
      mailConfig.port = req.body[0].port;
      mailConfig.password = req.body[0].password;
			mailConfig.service = req.body[0].service;
      mailConfig.emailHour = req.body[0].emailHour;
      mailConfig.subject = req.body[0].subject;
      mailConfig.header = req.body[0].header;

			mailConfig.save(function(err,newMailConfig){
				if(err) res.send(err);
				res.json({ message: 'Mail Config updated!' });
			})
		});
	});

	// delete mailconfig
	apiRouter.delete('/mailconfig/:id', function(req, res){
		MailConfig.remove({
			_id: req.params.id
		}, function(err, mailconfig){
			if(err) res.send(err);

			res.json({ message: 'Mail Config deleted!' });
		})
	});
};
