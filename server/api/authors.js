// AUTHOR API

var Author = require('../models/author');
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg') //Appending .jpg
  }
})

var upload = multer({ storage: storage });

// Posts API
module.exports = function(apiRouter){

// get all authors
apiRouter.get('/authors', function(req, res){
  Author.find()
    .exec(function(err, authors){
        if(err)
            res.send(err);
        else
            res.json(authors);
    });
  /*Author.find({}, function(err, authors){
    if (err) res.send(err);
    res.json(authors);
  }).populate('author');*/
});

// add an author
apiRouter.post('/authors', function(req, res){

  var author = new Author();
  author.name = req.body.name;
  author.bio = req.body.bio;
  author.photo = req.body.photo;
  author.quote = req.body.quote;

  author.save(function(err, author){
    if(err) res.send(err);
    res.json(author);
  })
});

// get a single author
apiRouter.get('/authors/:id', function(req, res){
  Author.findById(req.params.id, function(err, author){
    if (err) res.send(err);

    res.json(author);
  });
});

// update an author
apiRouter.put('/authors/:id', function(req, res){
  Author.findById(req.params.id, function(err, author){

    if(err) res.send(err);

    author.name = req.body.name;
    author.bio = req.body.bio;

    author.save(function(err){
      if(err) res.send(err);

      res.json({ message: 'Author updated!' });
    })
  });
});

// delete an author
apiRouter.delete('/authors/:id', function(req, res){
  Author.remove({
    _id: req.params.id
  }, function(err, post){
    if(err) res.send(err);

    res.json({ message: 'Author deleted!' });
  })
});

// add an author
apiRouter.post('/authors/upload',upload.single('uploadImageFile'), function(req, res){
    res.json({ path: req.file.path });
});

};
