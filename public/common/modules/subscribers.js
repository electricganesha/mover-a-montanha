var subscribersModule = angular.module('moveramontanha.subscribers', []);

subscribersModule.service('Subscribers', function($http){

	return {
		all: function(){
			return $http.get('/api/subscribers').then(function(subscriberList){
				return subscriberList.data;
			});
		},
		one: function(id){
			return $http.get('/api/subscribers/'+id).then(function(subscriber){
				return subscriber.data;
			});
		},
		add: function(newSubscriber){
			return $http({
				method: 'post',
				url: '/api/subscribers',
				data: newSubscriber
			}).then(function(res){
				// return the new subscriber
				return res.data;
			}).catch(function(err){
				console.error('Ocorreu um erro ao adicionar um novo Subscritor!');
				console.error(err);
				return err;
			});
		},
		remove: function(id){
			return $http({
				method: 'delete',
				url: '/api/subscribers/'+id,
			}).then(function(res){
				// return the new subscriber
				return res.data;
			}).catch(function(err){
				console.error('Ocorreu um erro ao remover a categoria ' +id);
				console.error(err);
				return err;
			});
		},
		update: function(id,editedSubscriber){
			return $http({
				method: 'put',
				url: '/api/subscribers/'+id,
				data: editedSubscriber
			}).then(function(res){
				// return the new author
				return res.data;
			}).catch(function(err){
				console.error('Ocorreu um erro ao actualizar o subscritor ' +id);
				console.error(err);
				return err;
			});
		},
		email: function(newSubscriber){
			return $http({
				method: 'post',
				url: '/api/newSubscriberEmail',
				data: newSubscriber
			}).then(function(res){
				// return the new subscriber
				return res.data;
			}).catch(function(err){
				console.error('Ocorreu um erro ao enviar o email!');
				console.error(err);
				return err;
			});
		}
	};
});
