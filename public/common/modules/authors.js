var authorsModule = angular.module('moveramontanha.authors', []);

authorsModule.service('Authors', function($http){

	return {
		all: function(){
			return $http.get('/api/authors').then(function(authorList){
				return authorList.data;
			});
		},
		one: function(id){
			return $http.get('/api/authors/'+id).then(function(author){
				return author.data;
			});
		},
		add: function(newAuthor){
			return $http({
				method: 'post',
				url: '/api/authors',
				data: newAuthor
			}).then(function(res){
				// return the new author
				return res.data;
			}).catch(function(err){
				console.error('Ocorreu um erro ao adicionar um novo Autor!');
				console.error(err);
				return err;
			});
		},
		remove: function(id){
			return $http({
				method: 'delete',
				url: '/api/authors/'+id,
			}).then(function(res){
				// return the new author
				return res.data;
			}).catch(function(err){
				console.error('Ocorreu um erro ao remover o autor ' +id);
				console.error(err);
				return err;
			});
		},
		update: function(id,editedAuthor){
			return $http({
				method: 'put',
				url: '/api/authors/'+id,
				data: editedAuthor
			}).then(function(res){
				// return the new author
				return res.data;
			}).catch(function(err){
				console.error('Ocorreu um erro ao actualizar o autor ' +id);
				console.error(err);
				return err;
			});
		},
		upload: function(fd)
		{
			return $http({
				method: 'post',
				url: '/api/authors/upload',
				data: fd,
				withCredentials: true,
        headers: {'Content-Type': undefined },
        transformRequest: angular.identity
			}).then(function(res){
				return res.data;
			}).catch(function(err){
				console.error('Ocorreu um erro ao carregar a imagem');
				console.error(err);
				return err;
			});
		}
	};
});
