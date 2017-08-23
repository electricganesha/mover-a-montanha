var Post = require('../models/post');
var Author = require('../models/author');

// Posts API
module.exports = function(apiRouter){

	// get all posts
	apiRouter.get('/posts', function(req, res){

		Post.find().sort('-created_at').populate('author').populate('categories')
	    .exec(function(err, posts){
	        if(err)
					{
						res.send(err);
						console.log(err);
					}
	        else
					{
						res.json(posts);
					}

	    });
	});

	// get total number of posts
	apiRouter.get('/posts/countAll', function(req, res){

    var query = {};

		Post.find().sort('created_at').count()
	    .exec(function(err, stats){
					console.log(stats);
	        if(err)
					{
						res.send(err);
						console.log(err);
					}
	        else
					{
						res.json(stats);
					}
	    });
	});

	// get number of posts in a given date
  // uso : /posts/count?startDate=August-13-2017&endDate=August-18-2017
	apiRouter.get('/posts/count', function(req, res){

    var query = {};

		console.log(req.query.startDate);
		console.log(req.query.endDate);

    if(req.query.startDate && req.query.endDate)
    {
      var startDateFormat = req.query.startDate.split('-');
      var endDateFormat = req.query.endDate.split('-');

      var start = new Date(startDateFormat[0]+" "+startDateFormat[1]+", "+startDateFormat[2]);
      var end = new Date(endDateFormat[0]+" "+endDateFormat[1]+", "+endDateFormat[2]);

      query.created_at = {'$lte': end, '$gte':start};
    }

		console.log(query);

		Post.find(query).sort('created_at')//.count()
	    .exec(function(err, stats){
					console.log(stats);
	        if(err)
					{
						res.send(err);
						console.log(err);
					}
	        else
					{
						res.json(stats);
					}
	    });
	});

	// get all posts time metrics statistics
	apiRouter.get('/posts/timemetrics', function(req, res){

		Post.find().sort('-created_at')
			.exec(function(err, posts){
					if(err)
					{
						res.send(err);
						console.log(err);
					}
					else
					{
						var averageHours = [];
						var countsHours = [];

						var averageDay = [];
						var countsDay = [];

						var averageFullDate = [];
						var countFullDate = [];

						for(var i=0; i<posts.length; i++)
						{
							var date = new Date(posts[i].created_at);
							var hour = date.getHours();
							var day = date.getDay();
							var fullDateNoTime = new Date(date.getFullYear(),date.getMonth(),date.getDate()).toString();

							if(averageHours.indexOf(hour) > -1)
							{
								countsHours[averageHours.indexOf(hour)] = countsHours[averageHours.indexOf(hour)]+1;
							}
							else {
								averageHours.push(hour);
								countsHours.push(1);
							}

							if(averageDay.indexOf(day) > -1)
							{
								countsDay[averageDay.indexOf(day)] = countsDay[averageDay.indexOf(day)]+1;
							}
							else {
								averageDay.push(day);
								countsDay.push(1);
							}

							if(averageFullDate.indexOf(fullDateNoTime) > -1)
							{
								countFullDate[averageFullDate.indexOf(fullDateNoTime)] = countFullDate[averageFullDate.indexOf(fullDateNoTime)]+1;
							}
							else {
								averageFullDate.push(fullDateNoTime);
								countFullDate.push(1);
							}
						}

						var maxNrHours = 0;
						var maxNrDay = 0;
						var maxNrFullDate = 0;

						var timeMetrics = {};
						timeMetrics.hour = [];
						timeMetrics.day = [];
						timeMetrics.fulldate = [];

						for(var i=0; i<countsHours.length; i++)
						{
							if(maxNrHours < countsHours[i])
								maxNrHours = countsHours[i];
						}

						for(var i=0; i<countsHours.length; i++)
						{
							if(countsHours[i] == maxNrHours)
								timeMetrics.hour.push(averageHours[i]);
						}

						for(var i=0; i<countsDay.length; i++)
						{
							if(maxNrDay < countsDay[i])
							{
								maxNrDay = countsDay[i];
							}
						}

						for(var i=0; i<countsDay.length; i++)
						{
							if(countsDay[i] == maxNrDay)
								timeMetrics.day.push(averageDay[i]);
						}

						for(var i=0; i<countFullDate.length; i++)
						{
							if(maxNrFullDate < countFullDate[i])
							{
								maxNrFullDate = countFullDate[i];
							}
						}

						for(var i=0; i<countFullDate.length; i++)
						{
							if(countFullDate[i] == maxNrFullDate)
								timeMetrics.fulldate.push(averageFullDate[i]);
						}

						res.json(timeMetrics);
					}

			});
	});

	// get number of posts in month by year
	apiRouter.get('/posts/count/:year', function(req, res){

		var dataToReturn = [];
		var calcIsDone = false;

		var daysInMonth = function(month,year) {
			var days = new Date(year, month, 0).getDate();
			return days;
		}

		var returnStuff = function() {
			res.json(dataToReturn);
		}

		Post.find().select('created_at')
			.exec(function(err, posts){
					if(err)
					{
						res.send(err);
						console.log(err);
					}
					else
					{
						for(var i=0; i<=11; i++)
						{
							var month = i;
							var year = req.params.year;
							var day = daysInMonth(month+1,year);
							var start = new Date(year, month, 1);
							var end = new Date(year, month,day );

							var counter = 0;

							for(var j=0; j<posts.length; j++)
							{
								if(posts[j].created_at > start && posts[j].created_at < end)
								{
									counter++;
								}
							}

							dataToReturn[i] = counter;

							if(dataToReturn.length == 12)
								returnStuff();
						}
					}
			});
	});

	// get number of posts in month by year
	// uso : /posts/filters?date=032016&author=:id&category=:id
	apiRouter.get('/posts/authorcount', function(req, res){

		var query = {};

		console.log(req.query);

		if(req.query)
		{
			if(req.query.author)
			{
				query.author = req.query.author;
			}

			if(req.query.category)
			{
				query.categories = req.query.category;
			}

			if(req.query.date)
			{
				var year = req.query.date;
				var start = new Date(year, 11, 31);
				var end = new Date(year, 0,31);

				query.created_at = {'$lte': start, '$gte':end};
			}
		}

		Post.find(query).select('author').populate('author','name')
			.exec(function(err, posts){
					if(err)
					{
						res.send(err);
						console.log(err);
					}
					else
					{
						var autores = [];
						var autoresNomes = [];

						var resultados = [];

						for(var i=0; i<posts.length; i++)
						{
							if(autores.indexOf(posts[i].author.name) == -1)
							{
								autores.push(posts[i].author.name);
								autoresNomes.push(posts[i].author.name);
							}
						}

						var countAutores = [];

						for(var i=0; i<autores.length; i++)
						{
							var autor = autores[i];
							var countAutor = 0;
							for(var j=0; j<posts.length; j++)
							{
								if(posts[j].author.name == autor)
								{
									countAutor++;
								}
							}
							countAutores.push({'name':autor,'count':countAutor});
						}

						res.json(countAutores);

				}
			});
	});

	// get number of posts in month by year
	// uso : /posts/filters?date=032016&author=:id&category=:id
	apiRouter.get('/posts/categorycount/', function(req, res){

		Post.find().select('categories').populate({path:'categories'})
			.exec(function(err, posts){
					if(err)
					{
						res.send(err);
						console.log(err);
					}
					else
					{
						var categorias = [];
						var categoriasNomes = [];

						var resultados = [];

						for(var i=0; i<posts.length; i++)
						{
							var postCategories = posts[i].categories;

							for(var j=0; j<postCategories.length; j++)
							{
								if(categorias.indexOf(postCategories[j]._id) == -1)
								{
									categorias.push(postCategories[j]._id);
									categoriasNomes.push(postCategories[j].tag);
								}
							}
						}


						var countCategorias = [];

						for(var i=0; i<categorias.length; i++)
						{
							var categoria = categorias[i];
							var categoriaNome = categoriasNomes[i];
							var countCategoria = 0;
							for(var j=0; j<posts.length; j++)
							{
								var post = posts[j];

								for(var k=0; k<post.categories.length; k++)
								{
									var category = post.categories[k];
									if(category._id == categoria)
									{
										countCategoria++;
									}
								}


							}
							countCategorias.push({'tag':categoriaNome,'count':countCategoria});
						}

						res.json(countCategorias);

				}
			});
	});

	// get all posts filtered
	// uso : /posts/filters?date=032016&author=:id&category=:id
	apiRouter.get('/posts/filters', function(req, res){

		var query = {};

		if(req.query.date != 'All')
		{

			var daysInMonth = function(month,year)
			{
				return new Date(year, month, 0).getDate();
			}

			month = req.query.date[0]+req.query.date[1];
			year = req.query.date[2]+req.query.date[3]+req.query.date[4]+req.query.date[5];

			//transformar a data num formato mais simpatico
			var parsedDate = month+"/"+daysInMonth(month,year)+"/"+year;

			var dateEnd = new Date(parsedDate);

			var dateBegin = new Date(dateEnd);
			dateBegin.setMonth(dateBegin.getMonth()-1);

			query.created_at = { '$lte': dateEnd, '$gte':dateBegin };
		}

		if(req.query.author != 'All')
		{
			query.author = req.query.author;
		}

		if(req.query.category != 'All')
		{
			query.categories = req.query.category;
		}

		Post.find(query).sort('-created_at').populate('author').populate('categories')
	    .exec(function(err, posts){
	        if(err)
					{
						res.send(err);
						console.log(err);
					}
	        else
					{
						res.json(posts);
					}

	    });
	});

	// get all posts from a certain Author
	apiRouter.get('/posts/author/:id', function(req, res){

		Post.find( { 'author' : req.params.id } ).populate('author').populate('categories')
	    .exec(function(err, posts){
	        if(err)
					{
						res.send(err);
						console.log(err);
					}
	        else
					{
						res.json(posts);
					}

	    });
	});

	// get all posts with a certain category
	apiRouter.get('/posts/category/:id', function(req, res){

		Post.find( { 'categories' : req.params.id } ).populate('author').populate('categories')
	    .exec(function(err, posts){
	        if(err)
					{
						res.send(err);
						console.log(err);
					}
	        else
					{
						res.json(posts);
					}

	    });
	});

	// add a post
	apiRouter.post('/posts', function(req, res){

		var post = new Post();
		post.title = req.body.title;
		post.author = req.body.author;
		post.body = req.body.body;
		post.isDraft = req.body.isDraft;
		post.recap = req.body.recap;
		post.categories = req.body.tags;

		post.save(function(err, post){
			if(err) res.send(err);

			res.json(post);
		})
	});

	// get a single post
	apiRouter.get('/posts/:id', function(req, res){
		Post.findById(req.params.id, function(err, post){
			if (err) res.send(err);
			res.json(post);
		}).populate('author').populate('categories');
	});

	// update a post
	apiRouter.put('/posts/:id', function(req, res){
		Post.findById(req.params.id, function(err, post){

			if(err) res.send(err);

			post.title = req.body.title;
			post.body = req.body.body;
			post.isDraft = req.body.isDraft;
			post.author = req.body.author;
			post.recap = req.body.recap;
			post.categories = req.body.tags;

			post.save(function(err){
				if(err) res.send(err);

				res.json({ message: 'Post updated!' });
			})
		});
	});

	// delete a post
	apiRouter.delete('/posts/:id', function(req, res){
		Post.remove({
			_id: req.params.id
		}, function(err, post){
			if(err) res.send(err);

			res.json({ message: 'Post deleted!' });
		})
	});
};
