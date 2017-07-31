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
				alert('ja ta');
			}
			);
		},
		imageUpload: function(fd)
		{
			console.log(fd);
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
		getPostCountStatistics: function(year){
			return $http.get('/api/posts/count/'+year).then(function(postCountArray){
				return postCountArray.data;
			});
		},
		getPostAuthorCountStatistics: function(){
			return $http.get('/api/posts/authorcount/').then(function(postCountArray){
				return postCountArray.data;
			});
		},
		getPostCategoryCountStatistics: function(){
			return $http.get('/api/posts/categorycount/').then(function(postCountArray){
				return postCountArray.data;
			});
		},
	};
});
