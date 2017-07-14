var Category = require('../models/category');

// Category API
module.exports = function(apiRouter){

	// get all categories
	apiRouter.get('/categories', function(req, res){

		Category.find()
	    .exec(function(err, categories){
	        if(err)
					{
						res.send(err);
						console.log(err);
					}
	        else
					{
						res.json(categories);
					}

	    });
	});

	// add a category
	apiRouter.post('/categories', function(req, res){

		var category = new Category();
		category.tag = req.body.tag;

		category.save(function(err, category){
			if(err) res.send(err);

			res.json(category);
		})
	});

	// get a single category
	apiRouter.get('/categories/:id', function(req, res){
		Category.findById(req.params.id, function(err, category){
			if (err) res.send(err);
			res.json(category);
		});
	});

	// update a post
	apiRouter.put('/category/:id', function(req, res){
		Category.findById(req.params.id, function(err, category){

			if(err) res.send(err);

			category.tag = req.body.tag;

			category.save(function(err){
				if(err) res.send(err);

				res.json({ message: 'Category updated!' });
			})
		});
	});

	// delete a post
	apiRouter.delete('/category/:id', function(req, res){
		Category.remove({
			_id: req.params.id
		}, function(err, category){
			if(err) res.send(err);

			res.json({ message: 'Category deleted!' });
		})
	});
};
