//CRON JOB PARA ENVIAR EMAIL COM NEWSLETTER
var CronJob = require('cron').CronJob;
var nodemailer = require('nodemailer');
var Post = require('./models/post');
var Subscribers = require('./models/subscriber');
var MailConfig = require('./models/mailconfig');

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  pool: true,
  maxConnections: 20,
  maxMessages: Infinity,
  service: '',
  host: '',
  port: 465,
  secure: true, // secure:true for port 465, secure:false for port 587
  auth: {
    user: '',
    pass: ''
  }
});

module.exports = function(){

  console.log("MAILSERVICE: A iniciar processo de emails");

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
      transporter = nodemailer.createTransport({
        service: mailConfig.service,
        host:  mailConfig.host,
        port: mailConfig.port,
        secure: true,
        auth: {
          user: mailConfig.mail,
          pass: mailConfig.password,
        }
      });
    }
  });

  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  Post.find({ created_at : { $lte: Date.now().toString() , $gte: yesterday.toString() }, programmed_to_post : { $lte: Date.now().toString() , $gte: yesterday.toString() } }).sort('-created_at').populate('author')
  .exec(function(err, posts){

    if(err)
    {
      console.log(err);
    }
    else
    {
      var body = '';
      var digest = '';

      console.log("MAILSERVICE: NOVOS ARTIGOS ENCONTRADOS - " +posts.length);

      for(var i=0; i<posts.length; i++)
      {
        if(posts[i].isDraft) //se o artigo estiver activo
        {
          var post = posts[i];

          var postDate = new Date(post.created_at);
          var postDateFormatted = postDate.getUTCDate() + "/" + postDate.getUTCMonth() + "/" + postDate.getUTCFullYear();

          digest += '<hr><br><br><div style="text-align:center"><a href="https://www.moveramontanha.pt/article/'+post._id+'"><h3 style="display:inline;">'+ post.title +'</h3></a><p><h5 style="display:inline">por '+post.author.name+'</h5><h6 style="display:inline"> a '+postDateFormatted+'</h6><p>&#8220;<i>'+post.recap+'</i>&#8221;</p><br>';
        }
      }

      var data = new Date();
      var dataFormatada = data.getUTCDate() + "/" + data.getUTCMonth() + "/" + data.getUTCFullYear();

      if(mailConfig.active)
      {
        console.log("MAILSERVICE:Enviando email para " + subscribers.length + " subscritores");

        for(var i=0; i<subscribers.length; i++)
        {
          var subscriber = subscribers[i];

          if(subscriber.active == true)
          {
            body = mailConfig.header+
            digest
            +'<div style="text-align:center; padding:70px; background-image:url(https://www.moveramontanha.pt/home/img/footerimg.jpg); color:white;"><p><strong>Este email foi enviado de forma autom&aacute;tica atrav&eacute;s do nosso servidor de email.</strong></p><p>&nbsp;</p><p>Se n&atilde;o deseja receber esta newsletter, por favor <a style="color:white" href="https://www.moveramontanha.pt/api/unsubscribe/'+subscriber._id+'">remova a sua subscri&ccedil;&atilde;o aqui.</a></p><div></body>';

            if(posts.length > 0)
            {
              if(mailConfig.active)
              {
                var mailSendInterval = setInterval(function() {
                  transporter.sendMail(
                    {
                      from: mailConfig.mail,
                      to: subscriber.email,
                      subject: mailConfig.subject +" "+ dataFormatada,
                      html: body
                    }
                  );
                   }, 1000);

              }
            }
          }
        }
      }
      else {
        console.log("MAILSERVICE:Desligado - Sem envio de email automático");
      }

    }
  });
};
