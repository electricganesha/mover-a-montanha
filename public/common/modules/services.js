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
		}
	};
});
