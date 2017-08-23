//CRON JOB PARA ENVIAR EMAIL COM NEWSLETTER

var CronJob = require('cron').CronJob;
var nodemailer = require('nodemailer');
var Post = require('./models/post');
var Subscribers = require('./models/subscriber');
var MailConfig = require('./models/mailconfig');

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  //host: 'smtp.gmail.com',
  //port: 465,
  //secure: true, // secure:true for port 465, secure:false for port 587
  auth: {
    user: 'christianmarques@pushvfx.com',
    pass: 'Pushvfx_1409'
  }
});

module.exports = function(){

  var subscribers = '';

  Subscribers.find()
  .exec(function(err, result){
    if(err)
    {
      return err;
      console.log(err);
    }
    else
    {
      subscribers = result;
    }

  });

  var mailConfig = '';

  MailConfig.find()
  .exec(function(err, result){
    if(err)
    {
      return err;
      console.log(err);
    }
    else
    {
      mailConfig = result[0];
      transporter.options.service = mailConfig.service;
      transporter.options.host = mailConfig.host;
      transporter.options.port = mailConfig.port;
      transporter.options.auth.user = mailConfig.mail;
      transporter.options.auth.pass = mailConfig.password;
    }
  });

  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  Post.find({ created_at : { $lte: Date.now().toString() , $gte: yesterday.toString() } }).sort('-created_at')
  .exec(function(err, posts){

    if(err)
    {
      console.log(err);
    }
    else
    {

      var body = '';
      var digest = '';

      var trimContentTo140Char = function(content)
    	{
    		var trimmedContent = content.substr(0, 140);
    		trimmedContent = trimmedContent + "...";
    		return trimmedContent;
    	}

      for(var i=0; i<posts.length; i++)
      {
        var post = posts[i];

        digest += '<a href="http://localhost:3004/article/'+post._id+'"><h3>'+ post.title +'</h3><h4>por '+post.author+'</h4></a><p>'+trimContentTo140Char(post.body)+'</p><br>'
      }

      var data = new Date();
      var dataFormatada = data.getUTCDate() + "/" + data.getUTCMonth() + "/" + data.getUTCFullYear();

      for(var i=0; i<subscribers.length; i++)
      {
        var subscriber = subscribers[i];

        body = mailConfig.body+
        digest
        +'<p><strong>Este email foi enviado de forma autom&aacute;tica atrav&eacute;s do nosso servidor de email.</strong></p><p>&nbsp;</p><p>Se n&atilde;o deseja receber esta newsletter, por favor <a href="http://localhost:3004/api/unsubscribe/'+subscriber._id+'">remova a sua subscri&ccedil;&atilde;o aqui.</a></p>';

        if(posts.length > 0)
        {
          transporter.sendMail(
            {
              from: 'info@moveramontanha.com',
              to: subscriber.email,
              subject: mailConfig.subject +" "+ dataFormatada,
              html: body
            }
          );
        }
      }
    }
  });
};
