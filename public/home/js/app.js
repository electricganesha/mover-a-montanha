var app = angular.module('mean-blog.home', [
	'ui.router',
	'ngSanitize',
	'btford.markdown',
	'mean-blog.posts',
	'mean-blog.authors',
	'mean-blog.services',
	'mean-blog.categories',
	'720kb.socialshare',
	'mean-blog.subscribers',
	'slickCarousel',
	'textAngular'
]);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider){

	$stateProvider
		.state('home', {
			url: "/?category/?author",
			templateUrl: "/home/templates/main.html",
			resolve: {
				postList: function($stateParams, Posts){

					if($stateParams.category != undefined)
					{
						return Posts.category($stateParams.category).then(function(data){
							return data;
						});
					}
					else if($stateParams.author != undefined) {
						return Posts.author($stateParams.author).then(function(data){
							return data;
						});
					}
					else {
						return Posts.all().then(function(data){
							return data;
						});
					}
				},
				category: function($stateParams, Categories)
				{
					if($stateParams.category)
					{
						return Categories.one($stateParams.category).then(function(data){
							return data;
						});
					}
					else {
						return $stateParams.category;
					}

				},
				author: function($stateParams, Authors)
				{
					if($stateParams.author)
					{
						return Authors.one($stateParams.author).then(function(data){
							return data;
						});
					}
					else {
						return $stateParams.author;
					}

				},
				authorList: function(Authors){
					return Authors.all().then(function(data){
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
					return data;
				});
			}
		},
		controller: 'AuthorCtrl',
	})
	.state('articles', {
		url: "/articles",
		templateUrl: "/home/templates/articles.html",
		resolve: {
			allPosts: function($stateParams, Posts){
				return Posts.all().then(function(data){
					return data;
				});
			},
			allCategories: function($stateParams, Categories){
				return Categories.all().then(function(data){
					return data;
				});
			},
			allAuthors: function($stateParams, Authors){
				return Authors.all().then(function(data){
					return data;
				});
			},
		},
		controller: 'ArticlesCtrl',
	})
	.state('article', {
		url: "/article/:id",
		templateUrl: "/home/templates/article.html",
		resolve: {
			article: function($stateParams, Posts){
				return Posts.one($stateParams.id).then(function(data){
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

	//Remover o trailing # do url
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
	$urlRouterProvider.otherwise("/");
});
