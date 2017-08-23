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
			stat.userIp = req.body.userIp;
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

		Stats.find(query).sort('dateOfAccess')//.count()
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

	// get total number of visitors
	apiRouter.get('/stats/visitors/countAll', function(req, res){

    var query = {};

		Stats.find().sort('dateOfAccess').count()
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
	apiRouter.get('/stats/visitors/timemetrics', function(req, res){

		Stats.find().sort('dateOfAccess')
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
							var date = new Date(posts[i].dateOfAccess);
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
						timeMetrics.hour = {};
						timeMetrics.day = {};
						timeMetrics.fulldate = {};

						for(var i=0; i<countsHours.length; i++)
						{
							if(maxNrHours < countsHours[i])
								maxNrHours = countsHours[i];
						}

						for(var i=0; i<countsHours.length; i++)
						{
							if(countsHours[i] == maxNrHours)
								timeMetrics.hour[i] = averageHours[i];
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
								timeMetrics.day[i] = averageDay[i];
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
								timeMetrics.fulldate[i] = averageFullDate[i];
						}

						res.json(timeMetrics);
					}

			});
	});
};
