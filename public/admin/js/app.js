var adminApp = angular.module('mean-blog.admin', [
	'ui.router',
	'btford.markdown',
	'mean-blog.posts',
	'mean-blog.authors',
	'ngFileUpload',
	'textAngular',
	'angularMoment',
]);

adminApp.config(function($stateProvider, $urlRouterProvider){

	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('allPosts', {
			url: '/',
			templateUrl: '/admin/templates/allPosts.html',
			resolve: {
				postList: function(Posts){
					return Posts.all().then(function(data){
						console.log("STATEPROVIDER");
						console.log(data);
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
		.state('addAuthor', {
			url: '/addAuthor',
			templateUrl: '/admin/templates/addAuthor.html',
			controller: 'AddAuthorCtrl'
		});
});
