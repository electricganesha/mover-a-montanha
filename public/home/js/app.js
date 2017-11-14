var app = angular.module('moveramontanha.home', [
	'ui.router',
	'ngSanitize',
	'btford.markdown',
	'moveramontanha.posts',
	'moveramontanha.authors',
	'moveramontanha.services',
	'moveramontanha.categories',
	'720kb.socialshare',
	'moveramontanha.subscribers',
	'slickCarousel',
	'textAngular'
	//'ngMeta'
]);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider){

	$stateProvider
		.state('home', {
			url: "/",
			templateUrl: "/home/templates/main.html",
			data: {
	      meta: {
	        'title': 'Home page',
	        'description': 'This is the description shown in Google search results'
	    	}
			},
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
		data: {
      meta: {
        'title': 'Home page',
        'description': 'This is the description shown in Google search results'
    	}
		}
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
		url: "/articles?category",
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
			hasCategory:function($stateParams){
					return $stateParams.category;
			}
		},
		controller: 'ArticlesCtrl',
	})
	.state('article', {
		url: "/article/:id",
		templateUrl: "/home/templates/article.html",
		data: {
      meta: {
        'title': 'Home page',
        'description': 'This is the description shown in Google search results'
    	}
		},
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
	}).
	state('highlights', {
		url: "/highlights",
		templateUrl: "/home/templates/highlights.html",
		resolve:{
			allPosts: function($stateParams, Posts){
				return Posts.highlights().then(function(data){
					return data;
				});
			}
		},
		controller: 'HighLightsCtrl',
	});

	//Remover o trailing # do url
	$locationProvider.html5Mode({
		enabled: true,
	});
	
	$urlRouterProvider.otherwise("/");
});
