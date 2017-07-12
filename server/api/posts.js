var Post = require('../models/post');
var Author = require('../models/author');

// Posts API
module.exports = function(apiRouter){

	// get all posts
	apiRouter.get('/posts', function(req, res){

		Post.find().populate('author')
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
		}).populate('author');
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
