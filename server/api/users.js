// USER API

var User = require('../models/user');

// Posts API
module.exports = function(apiRouter){

// get all users
apiRouter.get('/users', function(req, res){
  User.find()
    .exec(function(err, users){
        if(err)
            res.send(err);
        else
            res.json(users);
    });
});

// get a single user
apiRouter.get('/users/:id', function(req, res){
  User.findById(req.params.id, function(err, user){
    if (err) res.send(err);
    res.json(user);
  });
});


// delete a user
apiRouter.delete('/users/:id', function(req, res){
  User.remove({
    _id: req.params.id
  }, function(err, post){
    if(err) res.send(err);

    res.json({ message: 'User deleted!' });
  })
});

};
