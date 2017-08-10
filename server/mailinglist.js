//CRON JOB PARA ENVIAR EMAIL COM NEWSLETTER

var CronJob = require('cron').CronJob;
var nodemailer = require('nodemailer');
var Post = require('./models/post');
var Subscribers = require('./models/subscriber');

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // secure:true for port 465, secure:false for port 587
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

        body = '<html><head><title></title></head><body><p style="text-align: center;"><img alt="" src="http://il5.picdn.net/shutterstock/videos/4796915/thumb/1.jpg"/></p><p><strong>Novos Artigos do blog Mover-A-Montanha</strong>,</p><p><strong><a href="http://www.moveramontanha.com">www.moveramontanha.com</a></strong></p>'+
        digest
        +'<p><strong>Este email foi enviado de forma autom&aacute;tica atrav&eacute;s do nosso servidor de email.</strong></p><p>&nbsp;</p><p>Se n&atilde;o deseja receber esta newsletter, por favor <a href="http://localhost:3004/api/unsubscribe/'+subscriber._id+'">remova a sua subscri&ccedil;&atilde;o aqui.</a></p>';

        if(posts.length > 0)
        {
          transporter.sendMail(
            {
              from: 'info@moveramontanha.com',
              to: subscriber.email,
              subject: 'Mover-A-Montanha : Novos Artigos - '+ dataFormatada,
              html: body
            }
          );
        }
      }
    }
  });
};
