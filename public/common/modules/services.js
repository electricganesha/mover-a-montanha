var servicesModule = angular.module('mean-blog.services', []);

servicesModule.service('Services', function($http){

	return {
		shortenURL: function(url){
      $http.post('https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyBDr0-FnAyzr_WnLK8Ij2qHfJGzi2b0XKo',{longUrl:url}).success(function(data,status,headers,config){
        return data.id;
        }).
        error(function(data,status,headers,config){
          console.log(data);
        });
		},
		readJSON: function(json)
		{
			return $http.get(json);
		},
		sendEmail: function(data)
		{
			$http.post('/api/contact-form', data).success(function(data, status, headers, config)
			{
				console.log("Email Enviado");
			}
			);
		},
		imageUpload: function(fd)
		{
			return $http({
				method: 'post',
				url: '/api/imageUpload',
				data: fd,
				withCredentials: true,
        headers: {'Content-Type': undefined },
        transformRequest: angular.identity
			}).then(function(res){
				// return the new author
				console.log("RESULTADO");
				console.log(res.data);
				return res.data;
			}).catch(function(err){
				console.error('Ocorreu um erro ao carregar a imagem');
				console.error(err);
				return err;
			});
		},
		getAdministratorList: function(){
			return $http.get('/admin/adminList').then(function(thisData){
				return thisData.data;
			});
		},
		getEmailHour: function(){
			return $http.get('/admin/emailhour').then(function(thisData){
				return thisData.data;
			});
		},
		postEmailHour: function(hour){
			var body = {};
			body.hour = hour;
			return $http({
				method: 'post',
				url: '/admin/emailhour/',
				data: body
			}).then(function(res){
				// return the new post
				return res.data;
			}).catch(function(err){
				console.error('Ocorreu um erro ao actualizar a hora do email!');
				console.error(err);
				return err;
			});
		},
<<<<<<< Updated upstream
		getPostCountStatistics: function(startDate,endDate){
			return $http.get('/api/posts/count?startDate='+formatDate(startDate)+"&endDate="+formatDate(endDate)).then(function(postCountArray){
=======

		getPostCountStatistics: function(year){
			return $http.get('/api/posts/count/'+year).then(function(postCountArray){
>>>>>>> Stashed changes
				return postCountArray.data;
			});
		},
		getVisitorCountStatistics: function(startDate,endDate){
			return $http.get('/api/stats/visitors?startDate='+formatDate(startDate)+"&endDate="+formatDate(endDate)).then(function(visitorCount){
				return visitorCount.data;
			});
		},
		getPostCategoryCountStatistics: function(){
      return $http.get('/api/posts/categorycount/').then(function(postCountArray){
        return postCountArray.data;
      });
    },
		getPostAuthorCountStatistics: function(){
			return $http.get('/api/posts/authorcount/').then(function(postCountArray){
				return postCountArray.data;
			});
		},
		registerUser: function(user){
			var body = {};
			body.email = user.email;
			body.level = user.level;
			body.password = user.password;
			body.author = user.author;
			return $http({
				method: 'post',
				url: '/register',
				data: body
			}).then(function(res){
				// return the new post
				console.log(res);
				return res.data;
			}).catch(function(err){
				console.error('Ocorreu um erro ao registar o utilizador!');
				console.error(err);
				return err;
			});
		},
		getSubscriberCountStatistics: function(startDate,endDate){
			return $http.get('/api/subscribers/count?startDate='+formatDate(startDate)+"&endDate="+formatDate(endDate)).then(function(postCountArray){
				return postCountArray.data;
			});
		},
		getPostsTimeMetrics: function(){
			return $http.get('/api/posts/timemetrics').then(function(postCountArray){
				return postCountArray.data;
			});
		},
		getVisitorsTimeMetrics: function(){
			return $http.get('/api/stats/visitors/timemetrics').then(function(postCountArray){
				return postCountArray.data;
			});
		}
	};
});

var formatDate = function(date)
{
		var monthNames = [
			"January", "February", "March",
			"April", "May", "June", "July",
			"August", "September", "October",
			"November", "December"
		];

		date = new Date(date);

		var day = date.getDate();
		var monthIndex = date.getMonth();
		var year = date.getFullYear();

		return monthNames[monthIndex] + '-' + day + '-' + year;
}
