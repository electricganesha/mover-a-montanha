var postsModule = angular.module('moveramontanha.posts', []);

postsModule.service('Posts', function($http){

	return {
		all: function(){
			return $http.get('/api/posts').then(function(postList){
				return postList.data;
			});
		},
		category: function(id){
			return $http.get('/api/posts/category/'+id).then(function(postList){
				return postList.data;
			});
		},
		author: function(id){
			return $http.get('/api/posts/author/'+id).then(function(postList){
				return postList.data;
			});
		},
		one: function(id){
			return $http.get('/api/posts/'+id).then(function(post){
				return post.data;
			});
		},
		add: function(newPost){
			return $http({
				method: 'post',
				url: '/api/posts',
				data: newPost
			}).then(function(res){
				// return the new post
				return res.data;
			}).catch(function(err){
				console.error('Ocorreu um erro ao adicionar um novo artigo!');
				console.error(err);
				return err;
			});
		},
		remove: function(id){
			return $http({
				method: 'delete',
				url: '/api/posts/'+id,
			}).then(function(res){
				// return the new post
				return res.data;
			}).catch(function(err){
				console.error('Ocorreu um erro ao remover o artigo ' +id);
				console.error(err);
				return err;
			});
		},
		update: function(id,editedPost){
			return $http({
				method: 'put',
				url: '/api/posts/'+id,
				data: editedPost
			}).then(function(res){
				// return the new post
				return res.data;
			}).catch(function(err){
				console.error('Ocorreu um erro ao actualizar o artigo ' +id);
				console.error(err);
				return err;
			});
		},
		filter: function(date,author,category){
			return $http({
				method: 'get',
				url: '/api/posts/filters?date='+date+'&author='+author+'&category='+category,
			}).then(function(res){
				return res.data;
			}).catch(function(err){
				console.error('Ocorreu um erro com a filtragem indicada');
				console.error(err);
				return err;
			});
		},
		search: function(searchTerms){
			return $http({
				method: 'get',
				url: '/api/posts/search',
				headers: {
					'search':searchTerms
				}
			}).then(function(res){
				return res.data;
			}).catch(function(err){
				console.error('Ocorreu um erro com a filtragem indicada');
				console.error(err);
				return err;
			});
		}
	};
});
