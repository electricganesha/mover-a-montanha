var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var cors = require('cors');
var flash = require('connect-flash');
const CronJob = require('cron').CronJob;
const mailingListJob = require('./server/mailinglist');
const draftCron = require('./server/draftCron');
var MailConfig = require('./server/models/mailconfig');

require('./server/passport')(passport);   // this file is defined below

var app = express();

// ENVIRONMENT CONFIG
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
envConfig = require('./server/env')[env];

mongoose.connect(envConfig.db);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'home/img/icons/mountains.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cors());
app.use(flash());
app.use(methodOverride());
app.use(cookieParser());
app.use(require('express-session')({
  secret: 'moveramontanha28062017',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
require('./server/routes')(app, passport);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// Start server
app.listen(envConfig.port, function(){
  console.log('Server listening on port ' + envConfig.port)
});

//CRON JOBS
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
    //console.log(mailConfig);
    //CRON JOBS EMAIL
    var hour = mailConfig.emailHour.split(':');
    var crontime = hour[1]+" "+hour[0]+" * * 0-6"; //todos os dias as 14:00 (segunda a domingo)
    console.log(crontime);
    var jobs = [
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

module.exports = app;
