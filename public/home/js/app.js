var app = angular.module('mean-blog.home', [
	'ui.router',
	'ngSanitize',
	'btford.markdown',
	'mean-blog.posts',
	'mean-blog.authors',
	'mean-blog.services',
	'720kb.socialshare'
]);

app.config(function($stateProvider, $urlRouterProvider){

	$stateProvider
		.state('home', {
			url: "/",
			templateUrl: "/home/templates/main.html",
			resolve: {
				postList: function(Posts){
					return Posts.all().then(function(data){
						return data;
					});
				}
			},
			controller: 'MainCtrl',
		}).state('about', {
			url: "/about",
			templateUrl: "/home/templates/about.html",
			controller: 'AboutCtrl',
		})
		.state('authors', {
			url: "/authors",
			templateUrl: "/home/templates/authors.html",
			resolve: {
				authorList: function(Authors){
					return Authors.all().then(function(data){
						return data;
					});
				}
			},
			controller: 'AuthorsCtrl',
		})
		.state('author', {
			url: "/author/:id",
			templateUrl: "/home/templates/author.html",
			resolve: {
				author: function($stateParams, Authors){
					return Authors.one($stateParams.id).then(function(data){
						console.log("xpto");
						return data;
					});
				}
			},
			controller: 'AuthorCtrl',
		})
		.state('article', {
			url: "/article/:id",
			templateUrl: "/home/templates/article.html",
			resolve: {
				article: function($stateParams, Posts){
					return Posts.one($stateParams.id).then(function(data){
						console.log(data);
						return data;
					});
				}
			},
			controller: 'ArticleCtrl',
		}).
		state('contact', {
			url: "/contact",
			templateUrl: "/home/templates/contact.html",
			controller: 'ContactCtrl',
		});

	$urlRouterProvider.otherwise("/");
});
