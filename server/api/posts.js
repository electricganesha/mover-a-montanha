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

	// get number of posts in month by year
	apiRouter.get('/posts/count/:year', function(req, res){

		var dataToReturn = [];
		var calcIsDone = false;

		var daysInMonth = function(month,year) {
			var days = new Date(year, month, 0).getDate();
			return days;
		}

		var returnStuff = function() {
			console.log(dataToReturn);
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

							console.log(i);
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
	apiRouter.get('/posts/authorcount/', function(req, res){

		Post.find().select('author').populate('author','name')
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

			console.log(parsedDate);

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

		console.log(query);

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
