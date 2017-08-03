var usersModule = angular.module('mean-blog.users', []);

usersModule.service('Users', function($http){
	return {
		all: function(){
			return $http.get('/api/users').then(function(userList){
				return userList.data;
			});
		},
		one: function(id){
			return $http.get('/api/users/'+id).then(function(user){
				return user.data;
			});
		},
		remove: function(id){
			return $http({
				method: 'delete',
				url: '/api/users/'+id,
			}).then(function(res){
				// return the new user
				return res.data;
			}).catch(function(err){
				console.error('Ocorreu um erro ao remover o Utilizador ' +id);
				console.error(err);
				return err;
			});
		}
	};
});
