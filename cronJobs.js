const CronJob = require('cron').CronJob;
const mailingListJob = require('./server/mailinglist');
const draftCron = require('./server/draftCron');
var MailConfig = require('./server/models/mailconfig');

//CRON JOBS
var mailConfig = '';
var jobs = [];

var exports = module.exports = {};

  exports.mailerCronJob = function()
  {
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
        //CRON JOBS EMAIL
        var hour = mailConfig.emailHour.split(':');
        var crontime = hour[1]+" "+hour[0]+" * * 0-6"; //todos os dias as XX:XX (segunda a domingo)
        console.log("EMAILS AUTOMATICOS PROGRAMADOS PARA: " +crontime);
        jobs = [
          new CronJob({
            cronTime: crontime,
            onTick: function() {
              console.log("A ENVIAR EMAILS AUTOMATICOS");
              mailingListJob();
            },
            start: false, //don't start immediately
            timeZone: 'Europe/Lisbon'
          })
        ];

        jobs.forEach(function(job) {
          job.start(); //start the jobs
        });
      }
    });
  };
  exports.autoPubCronJob = function()
  {
    //CRON JOBS - PUBLICACOES
    var crontimePub = "00 */5 * * * *"; //a cada 5 minutos
    var jobsPub = [
      new CronJob({
        cronTime: crontimePub,
        onTick: function() {
          draftCron();
        },
        start: false, //don't start immediately
        timeZone: 'Europe/Lisbon'
      })
    ];

    jobsPub.forEach(function(job) {
      job.start(); //start the jobs
    });
  };
