var Stats = require('../models/stats');

// Stats API
module.exports = function(apiRouter){

	// get all stats
	apiRouter.get('/stats', function(req, res){

		Stats.find()
	    .exec(function(err, stats){
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

	// add a stat
	apiRouter.post('/stats', function(req, res){

			var stat = new Stats();
			stat.dateOfAccess = req.body.dateOfAccess;
			stat.userAgent = req.body.userAgent;
			stat.userLocationCountry = req.body.userLocationCountry;
			stat.userLocationCity = req.body.userLocationCity;

      stat.save(function(err, stat){
  			if(err) res.send(err);

  			res.json(stat);
  		});

	});

  // get number of visitors in a given date
  // uso : /stats/visitors?startDate=August-13-2017&endDate=August-18-2017
	apiRouter.get('/stats/visitors', function(req, res){

    var query = {};

    if(req.query.startDate && req.query.endDate)
    {
      var startDateFormat = req.query.startDate.split('-');
      var endDateFormat = req.query.endDate.split('-');

      var start = new Date(startDateFormat[0]+" "+startDateFormat[1]+", "+startDateFormat[2]);
      var end = new Date(endDateFormat[0]+" "+endDateFormat[1]+", "+endDateFormat[2]);

      query.dateOfAccess = {'$lte': end, '$gte':start};
    }

		Stats.find(query).count()
	    .exec(function(err, stats){
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
};
