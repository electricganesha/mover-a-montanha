var servicesModule = angular.module('moveramontanha.services', []);

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
		getPostCountStatistics: function(startDate,endDate){
			return $http.get('/api/posts/count?startDate='+formatDate(startDate)+"&endDate="+formatDate(endDate)).then(function(postCountArray){
				return postCountArray.data;
			});
		},
		getPostCountAll: function(){
			return $http.get('/api/posts/countAll').then(function(postCountArray){
				return postCountArray.data;
			});
		},
		getVisitorCountStatistics: function(startDate,endDate){
			return $http.get('/api/stats/visitors?startDate='+formatDate(startDate)+"&endDate="+formatDate(endDate)).then(function(visitorCount){
				return visitorCount.data;
			});
		},
		getVisitorCountAll: function(){
			return $http.get('/api/stats/visitors/countAll').then(function(postCountArray){
				return postCountArray.data;
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
		getSubscriberCountAll: function(){
			return $http.get('/api/subscribers/countAll').then(function(postCountArray){
				return postCountArray.data;
			});
		},
		getSubscriberCountAllActive: function(){
			return $http.get('/api/subscribers/countAllActive').then(function(postCountArray){
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
		},
		getSubscribersTimeMetrics: function(){
			return $http.get('/api/subscribers/timemetrics').then(function(postCountArray){
				return postCountArray.data;
			});
		},
		logout: function()
		{
			return $http({
				method: 'post',
				url: '/logout'
			}).then(function(res){
				// return the new post
				console.log(res);
				return res.data;
			}).catch(function(err){
				console.error('Ocorreu um erro ao terminar a sessão!');
				console.error(err);
				return err;
			});
		},
		changePwd: function(pwd,user){
			var body = {};
			body.pwd = pwd;
			body.user = user;
			return $http({
				method: 'post',
				url: '/changePwd',
				data: body
			}).then(function(res){
				// return the new post
				console.log(res);
				return res.data;
			}).catch(function(err){
				console.error('Ocorreu um erro ao alterar a password!');
				console.error(err);
				return err;
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
