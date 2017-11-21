var express = require('express'),
path = require('path'),
User = require('./models/user'),
rootPath = path.normalize(__dirname + '/../'),
apiRouter = express.Router(),
router = express.Router();
fs = require('fs');
geoip = require('geoip-lite');
http = require('http');
Feed = require('feed');
var Post = require('./models/post');

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
	require('./api/mailconfig')(apiRouter);

	//rss feed generator
	let feed = new Feed({
		title: 'Mover-A-Montanha',
		description: 'Blogue Mover-a-Montanha',
		id: 'https://www.moveramontanha.pt',
		link: 'https://www.moveramontanha.pt',
		image: 'https://www.moveramontanha.pt/home/img/mam_share.jpg',
		favicon: 'https://www.moveramontanha.pt/home/img/icons/mountains.png',
		copyright: 'Todos os direitos reservados, Mover-A-Montanha',
		updated: new Date(), // optional, default = today
		generator: 'Feed Generator', // optional, default = 'Feed for Node.js'
		feedLinks: {
			rss: 'https://www.moveramontanha.pt/rssFeed',
			json: 'https://www.moveramontanha.pt/jsonFeed',
			atom: 'https://www.moveramontanha.pt/atomFeed',
		},
		author: {
			name: 'Mover-A-Montanha',
			email: 'moveramontanha@gmail.com',
			link: 'https://www.moveramontanha.pt'
		}
	});

	Post.find().sort('-created_at').populate('author').populate('categories')
	.exec(function(err, posts){
		if(err)
		{
			res.send(err);
			console.log(err);
		}
		else
		{
			for(var i=0; i<posts.length; i++)
			{

				if(posts[i].isDraft == true && posts[i].author != undefined)
				{
					feed.addItem({
						title: posts[i].title,
						id: 'https://www.moveramontanha.pt/article/'+posts[i]._id,
						link:'https://www.moveramontanha.pt/article/'+posts[i]._id,
						description: posts[i].recap,
						content: posts[i].body,
						author: [{
							name: posts[i].author.name,
							link: 'https://www.moveramontanha.pt/author/'+posts[i].author._id
						}],
						date: new Date(posts[i].created_at),
						image: 'https://www.moveramontanha.pt/'+posts[i].author.photo.replace("../", "")
					});
				}

				if(i==posts.length-1)
				{
					feed.addCategory('Artigos');
				}
			}
		}
	});

	// home route
	router.get('/', function(req, res) {
		// ADICIONAR ESTATISTICAS EXTERNAS
		var remoteAddress = req.connection.remoteAddress.split(":");
		console.log(remoteAddress);
		if(remoteAddress[3] != null && remoteAddress[3] != '127.0.0.1')
		{
			return http.get('http://ipinfo.io/'+remoteAddress[3]+'/geo', function(response) {
				// Continuously update stream with data
				var body = '';
				response.on('data', function(d) {
					body += d;
				});
				response.on('end', function() {

					body = JSON.parse(body);

					var stat = new Stats();
					stat.dateOfAccess = new Date();
					stat.userIp = remoteAddress[3];
					stat.userAgent = req.headers['user-agent'];
					stat.userLocationCountry = body.country;
					stat.userLocationCity = body.city;
					stat.save(function(err, stat){
						if(err) res.send(err);
						res.render('index');
					});
				});
			});
		}
		else {
			res.render('index');
		}
	});

	// admin route
	router.get('/admin', function(req, res) {
		res.render('admin/login');
	});

	// pwdrecover route
	router.get('/admin/pwdrecover', function(req, res) {
		res.render('admin/pwdRecoverMail');
	});

	router.get('/admin/pwdrecoversentmsg', function(req, res) {
		res.render('admin/pwdRecoverSentMsg');
	});

	router.get('/admin/pwdRecoverChangePwd/:token', function(req, res) {
		res.render('admin/pwdRecoverPwdChange');
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

	// contact form service
	app.get('/rssFeed', function(req, res){
		res.setHeader('content-type', 'application/xml');
		res.send(feed.rss2());
	});

	app.get('/atomFeed', function(req, res){
		res.setHeader('content-type', 'application/atom');
		res.send(feed.atom1());
	});

	app.get('/jsonFeed', function(req, res){
		res.setHeader('content-type', 'application/json');
		res.send(feed.json1());
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
			email: req.body.email,
			level: req.body.level,
			author: req.body.author,
		}), req.body.password, function(err, user) {
			if (err) {
				console.error(err);
				return;
			}
			//res.status(200);
			res.json({ message: 'Utilizador Registado'});
			// log the user in after it is created
			/* passport.authenticate('local')(req, res, function(){
			res.redirect('/admin/dashboard');
		}); */
	});
});

router.post('/login', passport.authenticate('local', { successRedirect: '/admin/dashboard',
failureRedirect: '/admin',
failureFlash: 'Utilizador ou palavra-passe inválidos' })
);

router.post('/logout', function(req, res){
	req.session.destroy();
	req.logout();
	res.status(200).json({message: 'Sessão terminada com sucesso'});
});

router.post('/changePwd', function(req, res){
	User.findById(req.body.user).then(function(sanitizedUser){
		if (sanitizedUser){
			sanitizedUser.setPassword(req.body.pwd, function(){
				sanitizedUser.save();
				res.status(200).json({message: 'Password alterada com sucesso'});
			});
		} else {
			res.status(500).json({message: 'Este utilizador nao existe.'});
		}
	},function(err){
		console.error(err);
	})

});

app.get('*', function(req, res, next) {
	// call all routes and return the index.html file here
	res.render('index');
});

app.use(function(req, res, next){
	res.status(404);
	res.render('404');
	return;
});

};

function isAdmin(req, res, next){


	if(req.isAuthenticated()){
		console.log('PASSPORT - ADMIN AUTENTICADO');
		next();
	} else {
		console.log('TENTATIVA DE LOGIN SEM ADMIN');
		res.redirect('/');
	}
}

function returnEmailHour()
{
	var myJsonReturn = require("../emailhour.json");
	return myJsonReturn;
}
