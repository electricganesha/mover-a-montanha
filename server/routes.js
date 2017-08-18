var express = require('express'),
	path = require('path'),
	User = require('./models/user'),
	rootPath = path.normalize(__dirname + '/../'),
	apiRouter = express.Router(),
	router = express.Router();
	fs = require('fs');
	geoip = require('geoip-lite');

var Stats = require('./models/stats');

module.exports = function(app, passport){
	app.use('/api', apiRouter);
	app.use('/', router);

	// API routes
	require('./api/users')(apiRouter);
	require('./api/posts')(apiRouter);
	require('./api/authors')(apiRouter);
	require('./api/categories')(apiRouter);
	require('./api/subscribers')(apiRouter);
	require('./api/services')(apiRouter);
	require('./api/stats')(apiRouter);

	// home route
	router.get('/', function(req, res) {
		// ADICIONAR ESTATISTICAS EXTERNAS
		var remoteAddress = req.connection.remoteAddress.split(":");
		if(remoteAddress[3] != null && remoteAddress[3] != '127.0.0.1')
		{
			var geo = geoip.lookup(remoteAddress);

			var stat = new Stats();
			stat.dateOfAccess = Date.now;
			stat.userAgent = req.headers['user-agent'];
			stat.userLocationCountry = geo.country;
			stat.userLocationCity = geo.city;

			console.log(stat);
			stat.save();
		}

		res.render('index');
	});

	// admin route
	router.get('/admin', function(req, res) {
		res.render('admin/login');
	});

	router.get('/admin/register', function(req, res) {
		res.render('admin/register');
	});

	router.get('/admin/dashboard', isAdmin, function(req, res){
		res.render('admin/dashboard', {user: req.user});
	});

	router.get('/admin/adminList',function(req, res)
	{
		res.json(returnAdministrators());
	});

	router.get('/admin/emailhour',function(req, res)
	{
		res.json(returnEmailHour());
	});

	router.post('/admin/emailhour',function(req, res)
	{
		var hour = req.body.hour;
		var json = {'hour': req.body.hour}

		var parsed = JSON.stringify(json);

		fs.writeFile("emailhour.json", parsed, function(err) {
    if(err) {
        return console.log(err);
    }
		res.json({ message: 'Hora actualizada', hour: req.body.hour });
		});
	});

	router.post('/register', function(req, res){

		// passport-local-mongoose: Convenience method to register a new user instance with a given password. Checks if username is unique
		User.register(new User({
			email: req.body.email
		}), req.body.password, function(err, user) {
	        if (err) {
	            console.error(err);
	            return;
	        }

	        // log the user in after it is created
	        passport.authenticate('local')(req, res, function(){
	        	res.redirect('/admin/dashboard');
	        });
	    });
	});

	router.post('/login', passport.authenticate('local', { successRedirect: '/admin/dashboard',
	failureRedirect: '/admin',
	failureFlash: 'Utilizador ou palavra-passe inválidos' })
);

	app.use(function(req, res, next){
		res.status(404);
		res.render('404');
		return;
	});

};

function isAdmin(req, res, next){

	var administrators = returnAdministrators();
	var isAuthorized = false;

	for(var i=0; i<administrators.length; i++)
	{
		if(req.user.email == administrators[i].email)
		{
			isAuthorized = true;
		}
	}

	if(req.isAuthenticated() && isAuthorized){
		console.log('PASSPORT - ADMIN AUTENTICADO');
		next();
	} else {
		console.log('TENTATIVA DE LOGIN SEM ADMIN');
		res.redirect('/');
	}
}

function returnAdministrators()
{
	var myJsonReturn = require("../admins.json");
	return myJsonReturn;
}

function returnEmailHour()
{
	var myJsonReturn = require("../emailhour.json");
	return myJsonReturn;
}
