var MailConfig = require('../models/mailconfig');
var cron = require('../../cronJobs');

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

let hour = req.body[0].emailHour;
        if(hour != "" && hour.length == 5 && hour.indexOf(':') !== -1) {
         hour = "11:00";
        }


		var mailConfig = new MailConfig();
		mailConfig.mail = req.body.mail;
		mailConfig.host = req.body.host;
    mailConfig.port = req.body.port;
    mailConfig.password = req.body.password;
		mailConfig.service = req.body.service;
    mailConfig.emailHour = hour;
    mailConfig.subject = req.body.subject;
    mailConfig.header = req.body.header;
		mailConfig.active = req.body.active;

		mailConfig.save(function(err, config){
			if(err) res.send(err);

			res.json(config);
		})
	});

	// update mailconfig
	apiRouter.put('/mailconfig/:id', function(req, res){
		MailConfig.findById(req.params.id, function(err, mailConfig){

			if(err) res.send(err);

	let hour = req.body[0].emailHour;
	if(hour != "" && hour.length == 5 && hour.indexOf(':') !== -1) {
	 hour = "11:00";
	}

      mailConfig.mail = req.body[0].mail;
  		mailConfig.host = req.body[0].host;
      mailConfig.port = req.body[0].port;
      mailConfig.password = req.body[0].password;
			mailConfig.service = req.body[0].service;
      mailConfig.emailHour = hour;
      mailConfig.subject = req.body[0].subject;
      mailConfig.header = req.body[0].header;
			mailConfig.active = req.body[0].active;

			mailConfig.save(function(err,newMailConfig){
				if(err) res.send(err);
				cron.mailerCronJob();
				res.json({ message: 'Configura&ccedil;&atilde;o Guardada com Sucesso!' });
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
