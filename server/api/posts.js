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
						console.log(posts);
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
						console.log(posts);
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
						console.log(posts);
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

			console.log("UPDATE " + req.body);
			console.log(req.body);

			post.title = req.body.title;
			post.body = req.body.body;
			post.isDraft = req.body.isDraft;

			post.save(function(err){
				if(err) res.send(err);

				res.json({ message: 'Post updated!' });
			})
		});
	});

	// delete a post
	apiRouter.delete('/posts/:id', function(req, res){
		console.log("ID PARA APAGAR : " + req.params.id);
		Post.remove({
			_id: req.params.id
		}, function(err, post){
			if(err) res.send(err);

			res.json({ message: 'Post deleted!' });
		})
	});
};
