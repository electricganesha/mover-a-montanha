var categoriesModule = angular.module('moveramontanha.categories', []);

categoriesModule.service('Categories', function($http){

	return {
		all: function(){
			return $http.get('/api/categories').then(function(categoryList){
				return categoryList.data;
			});
		},
		one: function(id){
			return $http.get('/api/categories/'+id).then(function(category){
				return category.data;
			});
		},
		add: function(newCategory){
			return $http({
				method: 'post',
				url: '/api/categories',
				data: newCategory
			}).then(function(res){
				// return the new author
				return res.data;
			}).catch(function(err){
				console.error('Ocorreu um erro ao adicionar uma nova Categoria!');
				console.error(err);
				return err;
			});
		},
		remove: function(id){
			return $http({
				method: 'delete',
				url: '/api/categories/'+id,
			}).then(function(res){
				// return the new category
				return res.data;
			}).catch(function(err){
				console.error('Ocorreu um erro ao remover a categoria ' +id);
				console.error(err);
				return err;
			});
		},
		update: function(id,editedCategory){
			return $http({
				method: 'put',
				url: '/api/categories/'+id,
				data: editedCategory
			}).then(function(res){
				// return the new author
				return res.data;
			}).catch(function(err){
				console.error('Ocorreu um erro ao actualizar a categoria ' +id);
				console.error(err);
				return err;
			});
		},
    returnJSON: function()
    {
      return $http.get('/api/categories').then(function(categoryList){

        var json = [];

  			for(var i=0; i<categoryList.data.length; i++)
  			{
  				json[i] = { text: categoryList.data[i].tag }
  			}
  	    return json;
			});
    }
	};
});
