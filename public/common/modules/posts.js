var postsModule = angular.module('mean-blog.posts', []);

postsModule.service('Posts', function($http){

	return {
		all: function(){
			return $http.get('/api/posts').then(function(postList){
				console.log(postList);
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
				console.log(post);
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
		}
	};
});
