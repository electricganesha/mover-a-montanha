//CRON JOB PARA VERIFICAR SE PASSOU DATA DE PUBLICACAO AUTOMATICA E TORNAR VISIVEL

var CronJob = require('cron').CronJob;
var Post = require('./models/post');

module.exports = function(){

  var posts = '';
  var query = '';

  var tomorrow = new Date();
  tomorrow.setMinutes(tomorrow.getMinutes() + 5);

  Post.find({ programmed_to_post : { $lte: tomorrow.toString() , $gte:Date.now().toString()  } }).sort('-programmed_to_post')
  .exec(function(err, posts){

    if(err)
    {
      console.log(err);
    }
    else
    {
      for(var i=0 ; i<posts.length; i++)
      {
        if(posts[i].isAuto = true)
        {
          posts[i].isDraft = true;
          posts[i].isAuto = false;

          console.log('PUBLICADO ARTIGO '+posts[i].title+" programado para publicação em "+posts[i].programmed_to_post);

          posts[i].save(function(err){
            if(err) res.send(err);
          })
        }
      }
    }
  });
};
