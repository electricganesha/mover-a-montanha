var mailConfigModule = angular.module('moveramontanha.mailconfig', []);

mailConfigModule.service('MailConfig', function($http){

	return {
		all: function(){
			return $http.get('/api/mailconfig').then(function(mailconfiglist){
				return mailconfiglist.data;
			});
		},
		add: function(newMailConfig){
			return $http({
				method: 'post',
				url: '/api/mailconfig',
				data: newMailConfig
			}).then(function(res){
				// return the new subscriber
				return res.data;
			}).catch(function(err){
				console.error('Ocorreu um erro ao adicionar uma nova configuração de email!');
				console.error(err);
				return err;
			});
		},
		remove: function(id){
			return $http({
				method: 'delete',
				url: '/api/mailconfig/'+id,
			}).then(function(res){
				// return the new subscriber
				return res.data;
			}).catch(function(err){
				console.error('Ocorreu um erro ao remover a configuração ' +id);
				console.error(err);
				return err;
			});
		},
		update: function(id,editedMailConfig){
			return $http({
				method: 'put',
				url: '/api/mailconfig/'+id,
				data: editedMailConfig
			}).then(function(res){
				// return the new author
				return res.data;
			}).catch(function(err){
				console.error('Ocorreu um erro ao actualizar a configuração ' +id);
				console.error(err);
				return err;
			});
		}
	};
});
