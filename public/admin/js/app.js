var adminApp = angular.module('moveramontanha.admin', [
	'ui.router',
	'ui.bootstrap',
	'btford.markdown',
	'moveramontanha.users',
	'moveramontanha.posts',
	'moveramontanha.authors',
	'ngFileUpload',
	'ngTagsInput',
	'textAngular',
	'angularMoment',
	'moveramontanha.services',
	'moveramontanha.categories',
	'moveramontanha.subscribers',
	'moveramontanha.mailconfig',
	'angulartics',
	'angulartics.google.analytics',
	'ngAnalytics',
	'ngToast',
	'chart.js'
]);

// inject ngAnalyticsService
adminApp.run(['ngAnalyticsService', function (ngAnalyticsService) {
	ngAnalyticsService.setClientId('622043874240-aaibdsh9aer7tq1imde72op5ge1am19e.apps.googleusercontent.com'); // e.g. xxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
}]);


adminApp.config(function($stateProvider, $urlRouterProvider, $provide, $locationProvider){

	$urlRouterProvider.otherwise('/');

	$stateProvider
	.state('allPosts', {
		url: '/',
		templateUrl: '/admin/templates/allPosts.html',
		resolve: {
			postList: function(Posts){
				return Posts.all().then(function(data){
					return data;
				});
			},
			authorList: function(Authors){
				return Authors.all().then(function(data){
					return data;
				});
			},
			categoryList: function(Categories){
				return Categories.all().then(function(data){
					return data;
				});
			}
		},
		controller: 'AllPostsCtrl'
	})
	.state('addPost', {
		url: '/addPost',
		templateUrl: '/admin/templates/addPost.html',
		resolve: {
			authorList: function(Authors){
				return Authors.all().then(function(data){
					return data;
				});
			}
		},
		controller: 'AddPostCtrl'
	})
	.state('changepass', {
		url: '/changepass',
		templateUrl: '/admin/templates/changepass.html',
		controller: 'ChangePassCtrl'
	})
	.state('logout', {
		url: '/logout',
		controller: function($scope, $location, $window, Services) {
			Services.logout().then(function(err, data){
				$window.location.href= "/admin"
			});
		}
	})
	.state('allAuthors', {
		url: '/allAuthors',
		templateUrl: '/admin/templates/allAuthors.html',
		resolve: {
			authorList: function(Authors){
				return Authors.all().then(function(data){
					return data;
				});
			}
		},
		controller: 'AllAuthorsCtrl'
	})
	.state('allSubscribers', {
		url: '/allSubscribers',
		templateUrl: '/admin/templates/allSubscribers.html',
		resolve: {
			subscriberList: function(Subscribers){
				return Subscribers.all().then(function(data){
					return data;
				});
			},
			mailConfig: function(MailConfig){
				return MailConfig.all().then(function(data){
					return data;
				});
			}
		},
		controller: 'AllSubscribersCtrl'
	})
	.state('addAuthor', {
		url: '/addAuthor',
		templateUrl: '/admin/templates/addAuthor.html',
		controller: 'AddAuthorCtrl'
	})
	.state('allCategories', {
		url: '/allCategories',
		templateUrl: '/admin/templates/allCategories.html',
		resolve: {
			categoryList: function(Categories){
				return Categories.all().then(function(data){
					return data;
				});
			}
		},
		controller: 'AllCategoriesCtrl'
	})
	.state('statistics', {
		url: '/statistics',
		templateUrl: '/admin/templates/statistics.html',
		resolve: {
			postList: function(Posts){
				return Posts.all().then(function(data){
					return data;
				});
			}
		},
		controller: 'StatisticsCtrl'
	})
	.state('admin', {
		url: '/admin',
		templateUrl: '/admin/templates/admin.html',
		resolve: {
			userList: function(Users){
				return Users.all().then(function(data){
					return data;
				});
			}
		},
		controller: 'AdminCtrl'
	});

	$provide.decorator('taOptions', ['taRegisterTool', '$delegate', '$modal', function (taRegisterTool, taOptions, $uibModal) {
		taRegisterTool('uploadImage', {
			iconclass: "fa fa-upload",
			action: function (deferred) {
				var textAngular = this;
				$uibModal.open({
					controller: 'UploadImageModalInstance',
					controllerAs: 'modal',
					templateUrl: '/admin/templates/imageUploadModal.html'
				}).result.then(
					function (result) {
						console.log(result);
						console.log(document);
						textAngular.$editor().wrapSelection('insertImage', result);
						document.execCommand('insertImage', true, result);
						deferred.resolve();
					},
					function () {
						deferred.resolve();
					}
				);
				return false;
			}
		});
		taOptions.toolbar[3].splice(2,0,'uploadImage');
		return taOptions;
	}]);

	//Remover o trailing # do url
	$locationProvider.html5Mode({
		enabled: true,
	});
});
