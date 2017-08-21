adminApp.controller('NavCtrl', function($scope, $state){
	$scope.active = $state;
	$scope.isActive = function(viewLocation){
		var active = (viewLocation === $state.current.name);
		return active;
	};
});

adminApp.controller('AllPostsCtrl', function($scope, $window, postList, Posts, authorList, Authors, Categories, ngToast){

	$scope.updatePosts = function () {
		Posts.all().then(function(data){
			$scope.posts=data;
		});
	};

	$scope.selectedFilter = 'descend';

	var tagsIndex = [];
	var idsTags = [];

	$scope.authors = authorList;
	$scope.selectedAuthor = {};
	$scope.posts = $scope.updatePosts();
	$scope.activePost = false;
	var originalRetrievedTagsLength = 0;

	$scope.tagsLoaded = false;

	Categories.all().then(function(data){
		tagsIndex = data;
		$scope.tagsLoaded = true;
	});

	$scope.clearScope = function()
	{
		$scope.selectedAuthor = {};
		$scope.activePost = false;
		tagsIndex = [];
		idsTags = [];
		$scope.tags = [];
		$scope.tagsLoaded = false;

		Categories.all().then(function(data){
			tagsIndex = data;
			$scope.tagsLoaded = true;
		});
	}

	$scope.switchSelectedFilter = function(value)
	{
		$scope.selectedFilter = value;
	}

	$scope.tags = [];

	$scope.setActive = function(post){
		$scope.clearScope();

		$scope.activePost = post;
		var authorIndex;

		var json = [];
		for(var i=0; i<post.categories.length; i++)
		{
			json[i] = { text: post.categories[i].tag }
		}

		originalRetrievedTagsLength = post.categories.length;

		$scope.tags = [];
		$scope.tags = json;

		for(var i=0; i< $scope.authors.length; i++)
		{
			if($scope.authors[i]._id == post.author._id)
			{
				authorIndex = i;
			}
		}
		$scope.selectedAuthor = $scope.authors[authorIndex];
	}

	$scope.draftIt = function(post)
	{
		if(post.isDraft == true){
			post.isDraft = false;
		}else{
			post.isDraft = true;
		}
		Posts.update(post._id, post).then(function(res){});
	}

	$scope.editPost = function(id,editedPost){

		Posts.update(id,editedPost).then(function(res){
			if(res.message != undefined)
			{
				if(res.message == "Post updated!")
				res.message = "Artigo Actualizado!";
				ngToast.create(res.message);
				$scope.title = '';
				$scope.author = '';
				$scope.post = {};
				$scope.posts = postList;
				$scope.activePost = false;
				$scope.activePost.tags = [];
				$scope.tags = [];
			}
			// create a simple toast:

			$window.location.reload();
		});
	};

	$scope.removePost = function(id){
		Posts.remove(id).then(function(res){
			if(res.message != undefined)
			{
				ngToast.create(res.message);
				$scope.updatePosts();
			}
			else {
				ngToast.create("Artigo " + id + " Removido");
				$scope.post = {};
				$scope.activePost = false;
				$scope.updatePosts();
			}
		});
	};

	$scope.selectAuthor = function(author){
		$scope.activePost.author = author;
	};

	$scope.trimContentTo140Char = function(content)
	{
		var trimmedContent = '';

		if(content.body.indexOf('ta-insert-video') > -1)
		{
			trimmedContent = '(V&iacute;deo)';
		}
		else if(content.body.indexOf('<img src="') > -1)
		{
			trimmedContent = '(Imagem)';
		}
		else {
			trimmedContent = content.body.substr(0, 140);
			trimmedContent = trimmedContent + "...";
		}

		return trimmedContent;
	}

	$scope.loadTags = function(query) {
		var loadedTags = Categories.returnJSON();
		return loadedTags;
	};

	$scope.removeTag = function(tag)
	{

		var indexToRemove = '';

		for(var i=0 ; i < tagsIndex.length; i++)
		{
			if(tagsIndex[i].tag == tag.text)
			{
				indexToRemove = tagsIndex[i]._id;
			}

			// Find and remove item from an array
			var x = idsTags.indexOf(indexToRemove);
			if(x != -1) {
				idsTags.splice(x, 1);
			}

			$scope.activePost.tags = idsTags;
		}
	}

	$scope.$watch('tags.length', function(value) {

		if($scope.tags.length != originalRetrievedTagsLength)
		{
			// ver se as novas tags ja existem
			var jaExiste = false;
			for(var i=0 ; i < tagsIndex.length; i++)
			{
				if($scope.tags.length > 0)
				{
					if(tagsIndex[i].tag.toString() == $scope.tags[value-1].text.toString())
					{
						jaExiste = true;
					}
				}
			}
			if(!jaExiste)
			{
				var category = {};
				if($scope.tags.length > 0)
				{
					category.tag = $scope.tags[value-1].text.toString();
					Categories.add(category).then(function(data){
						idsTags[value-1] = data._id;
						tagsIndex[value-1] = data;
					});
				}
			}

			// popular as tags no post
			if(tagsIndex)
			{
				for(var i=0 ; i < tagsIndex.length; i++)
				{
					for(var j=0; j<$scope.tags.length; j++)
					{
						if(tagsIndex[i].tag == $scope.tags[j].text)
						{
							idsTags[j] = tagsIndex[i]._id;
						}

					}

					$scope.activePost.tags = idsTags;
				}
			}
		}

	});
});

adminApp.controller('AddPostCtrl', function($scope, Posts, authorList, Categories, ngToast){
	$scope.post = {};
	$scope.authors = authorList;
	$scope.selectedAuthor = {};
	$scope.post.isDraft = false;
	var tagsIndex = [];
	var idsTags = [];

	Categories.all().then(function(data){
		tagsIndex = data;
	});


	$scope.tags = [
		{ text: 'Política' },
		{ text: 'Portugal' },
		{ text: 'Europa' }
	];

	$scope.loadTags = function(query) {
		return Categories.returnJSON();
	};

	$scope.$watch('tags.length', function(value) {

		// ver se as novas tags ja existem
		var jaExiste = false;
		for(var i=0 ; i < tagsIndex.length; i++)
		{
			if(tagsIndex[i].tag.toString() == $scope.tags[value-1].text.toString())
			{
				jaExiste = true;
			}
		}
		if(!jaExiste)
		{
			var category = {};
			category.tag = $scope.tags[value-1].text.toString();
			Categories.add(category).then(function(data){
				idsTags[value-1] = data._id;
				tagsIndex[value-1] = data;
			});
		}
		else
		{
		}


		// popular as tags no post
		if(tagsIndex)
		{
			for(var i=0 ; i < tagsIndex.length; i++)
			{

				for(var j=0; j<$scope.tags.length; j++)
				{
					if(tagsIndex[i].tag == $scope.tags[j].text)
					{
						idsTags[j] = tagsIndex[i]._id;
					}

				}

				$scope.post.tags = idsTags;

			}
		}
	});

	$scope.selectAuthor = function(author){
		$scope.post.author = author;
	};

	$scope.draftIt = function(post)
	{
		post.isDraft = !post.isDraft;
	}

	$scope.addPost = function(newPost){

		newPost.tags = idsTags;

		Posts.add(newPost).then(function(res){
			if(res.message != undefined)
			{
				ngToast.create(res.message);
			}
			else {
				ngToast.create('Artigo Publicado');
				$scope.post = {};
				$scope.isActive('allPosts');
			}
		});
	};


});

// AUTHORS

adminApp.controller('AllAuthorsCtrl', function($scope, authorList, Authors, ngToast){

	$scope.updateAuthors = function () {
		Authors.all().then(function(data){
			$scope.authors=data;
		});
	};

	$scope.authors = $scope.updateAuthors();
	$scope.activeAuthor = false;

	$scope.setActive = function(author){
		$scope.activeAuthor = author;
	}

	$scope.editAuthor = function(id,editedAuthor){
		Authors.update(id,editedAuthor).then(function(res){
			if(res.message != undefined)
			{
				if(res.message == "Author updated!")
				ngToast.create("Autor - " + editedAuthor.name + " - Actualizado");
				$scope.$apply();
			}
		});
	};

	$scope.removeAuthor = function(author){
		Authors.remove(author._id).then(function(res){
			if(res.message != undefined)
			{
				if(res.message == 'Author deleted!')
				ngToast.create("Autor - " + author.name + " - Removido");
				$scope.updateAuthors();
			}
			else {
				ngToast.create("Autor - " + author.name + " - Removido");
				$scope.updateAuthors();
			}
		});
	};

	// upload on file select or drop
	$scope.upload = function (file) {
		var fd = new FormData();
		//Take the first selected file
		fd.append("uploadImageFile", file);
		Authors.upload(fd).then(function(res,err){
			$scope.activeAuthor.photo = res.path.replace("public/","../");
			$scope.activeAuthor.photo = res.path.replace("public/","../");

			if(res.message != undefined)
			{
				ngToast.create(res.message);
			}
			else {
				ngToast.create("Imagem Carregada com Sucesso");
				$scope.activeAuthor.photo = res.path.replace("public/","../");
				photo = res.path.replace("public/","../");
			}
		});
	};
});

// SUBSCRIBERS

adminApp.controller('AllSubscribersCtrl', function($scope, subscriberList, Subscribers, Services){

	$('input.timepicker').timepicker({
		timeFormat: 'H:mm',
		ampm: true       });

		Services.getEmailHour().then(function(data){
			$scope.currentEmailHour = data.hour;
		});


		$scope.updateEmailHour = function()
		{
			var hour = ''+$('input.timepicker')[0].value;
			Services.postEmailHour(hour).then(function(res){
				console.log(res);
				if(res.message != undefined)
				{
					$scope.currentEmailHour = res.hour;
				}
				else {
					$scope.currentEmailHour = data.hour;
				}
			});
		}

		$scope.updateSubscribers = function () {
			Subscribers.all().then(function(data){
				$scope.subscribers=data;
			});
		};

		$scope.subscribers = $scope.updateSubscribers();
		$scope.activeSubscriber = false;

		$scope.setActive = function(subscriber){
			$scope.activeSubscriber = subscriber;
		}

		$scope.removeSubscriber = function(subscriber){
			Subscribers.remove(subscriber._id).then(function(res){
				if(res.message != undefined)
				{
					if(res.message == 'Subscriber deleted!')
					$scope.updateSubscribers();
				}
				else {
					$scope.updateSubscribers();
				}
			});
		};
	});

	adminApp.controller('AllCategoriesCtrl', function($scope, categoryList, Categories){

		$scope.updateCategories = function () {
			Categories.all().then(function(data){
				$scope.categories=data;
			});
		};

		$scope.categories = $scope.updateCategories();
		$scope.activeCategory = false;

		$scope.setActive = function(category){
			$scope.activeCategory = category;
		}

		$scope.removeCategory = function(category){
			Categories.remove(category._id).then(function(res){
				if(res.message != undefined)
				{
					if(res.message == 'Category deleted!')
					$scope.updateCategories();
				}
				else {
					$scope.updateCategories();
				}
			});
		};
	});

	adminApp.controller('AddAuthorCtrl', function($scope, Authors, ngToast){
		$scope.author = {};
		$scope.defaultPhoto = '../home/img/thumbnail.jpeg'

		// upload on file select or drop
		$scope.upload = function (file) {
			var fd = new FormData();
			//Take the first selected file
			fd.append("uploadImageFile", file);
			Authors.upload(fd).then(function(res,err){
				if(res.path != undefined)
				{
					$scope.author.photo = res.path.replace("public/","../");
					$scope.author.photo = res.path.replace("public/","../");

					if(res.message != undefined)
					{
						ngToast.create(res.message);
					}
					else {
						ngToast.create("Imagem Carregada com Sucesso");
						$scope.author.photo = res.path.replace("public/","../");
						photo = res.path.replace("public/","../");
					}
				}
				else {
					ngToast.create({
						className: 'warning',
						content: 'Erro ao carregar a imagem.'
					});
				}
			});
		};

		$scope.addAuthor = function(newAuthor){
			$scope.author.photo = photo;
			Authors.add(newAuthor).then(function(res){
				if(res.message != undefined)
				{
					ngToast.create(res.message);
				}
				else {
					ngToast.create("Autor Adicionado");
					$scope.author = {};
				}
			});
		};

	});

	adminApp.controller('StatisticsCtrl', function($scope, postList, Authors, Services, Categories, $analytics){

		//populate year options
		var currentYear = new Date().getFullYear();

		$scope.availableYears = [];
		$scope.availableAuthors = [];
		$scope.availableCategories = [];
		$scope.authorChecked = 'fa fa-square-o';
		$scope.yearChecked = 'fa fa-square-o';
		$scope.categoryChecked = 'fa fa-square-o';
		$scope.selectedFilters = [{'filtro':'ano','selected':false,'valor':''},{'filtro':'autor','selected':false,'valor':''},{'filtro':'categoria','selected':false,'valor':''}];

		$scope.renderdirective = false;

		$scope.selectedYear = '2016';
		$scope.selectedAuthor = '';
		$scope.selectedCategories = '';
		//$scope.gaChartMain =	{};
		$scope.gaChartMain = {
			reportType: 'ga',
			query: {
				metrics: 'ga:sessions',
				dimensions: 'ga:date',
				'start-date': '30daysAgo',
				'end-date': 'yesterday',
				//ids: 'ga:XXXXXX' // put your viewID here or leave it empty if connected with a viewSelector
			},
			chart: {
				container: 'chart-container-1', // id of the created DOM-element
				type: 'LINE',
				options: {
					width: '100%'
				}
			}
		};

		$scope.toggleChartFilter = function(value)
		{
			console.log($analytics);
			console.log($scope.gaChartMain.query);
			console.log($scope.gaChartMain);

			$scope.gaChartMain = {};

			switch(value)
			{
				case('year'):
					$scope.gaChartMain.query = {metrics: 'ga:sessions',dimensions: 'ga:date','start-date': '365daysAgo','end-date': 'yesterday'}
				break;
				case('month'):
					$scope.gaChartMain.query = {metrics: 'ga:sessions',dimensions: 'ga:date','start-date': '30daysAgo','end-date': 'yesterday'}
				break;
				case('week'):
					$scope.gaChartMain.query = {metrics: 'ga:sessions',dimensions: 'ga:date','start-date': '7daysAgo','end-date': 'yesterday'}
				break;


			}

			console.log($scope);
			var options = {
			reportType: 'ga',
			query: {
				metrics: 'ga:sessions',
				dimensions: 'ga:date',
				'start-date': '30daysAgo',
				'end-date': 'yesterday',
				//ids: 'ga:XXXXXX' // put your viewID here or leave it empty if connected with a viewSelector
			},
			chart: {
				container: 'chart-container-1', // id of the created DOM-element
				type: 'LINE',
				options: {
					width: '100%'
				}
			}};
			$scope.gaChartMain.execute();
		}

		/*$scope.gaChartMain = {
			reportType: 'ga',
			query: {
				metrics: 'ga:sessions',
				dimensions: 'ga:date',
				'start-date': chartFilter,
				'end-date': 'yesterday',
				//ids: 'ga:XXXXXX' // put your viewID here or leave it empty if connected with a viewSelector
			},
			chart: {
				container: 'chart-container-1', // id of the created DOM-element
				type: 'LINE',
				options: {
					width: '100%'
				}
			}
		};*/

		$scope.gaChartTable = {
			reportType: 'ga',
			query: {
				metrics: 'ga:sessions',
				dimensions: 'ga:browser',
				'sort': '-ga:sessions',
      	'max-results': '6'
				//ids: 'ga:XXXXXX' // put your viewID here or leave it empty if connected with a viewSelector
			},
			chart: {
				container: 'chart-container-1', // id of the created DOM-element
				type: 'TABLE',
				options: {
					width: '100%'
				}
			}
		};

		$scope.queries = [{
			query: {
				//ids: 'ga:xxxxxx',  // put your viewID here
				metrics: 'ga:sessions',
				dimensions: 'ga:city'
			}
		}];

		for(var i=2016 ; i<=currentYear; i++)
		{
			$scope.availableYears.push({id: i, name: i});
		}

		Authors.all().then(function(data){
			$scope.availableAuthors=data;
		});

		Categories.all().then(function(data){
			$scope.availableCategories=data;
		});

		$scope.refreshCharts = function()
		{
			if($scope.selectedFilters[0].selected == false && $scope.selectedFilters[1].selected == false && $scope.selectedFilters[2].selected == false)
			{
				$scope.labels = [];
				$scope.data= [];
			}
		}

		$scope.toggleFilter = function(value)
		{
			if(value=="ano" && $scope.yearChecked == "fa fa-square-o")
			{
				$scope.selectedFilters[0].selected = true;
				$scope.yearChecked = 'fa fa-check-square-o';
				$scope.yearFilter($scope.selectedYear);
			}
			else if(value=="ano" && $scope.yearChecked == "fa fa-check-square-o")
			{
				$scope.selectedFilters[0].selected = false;
				$scope.yearChecked = 'fa fa-square-o';
				$scope.refreshCharts();
			}

			if(value=="author" && $scope.authorChecked == "fa fa-square-o")
			{
				$scope.selectedFilters[1].selected = true;
				$scope.authorChecked = 'fa fa-check-square-o';
				$scope.authorFilter();
			}
			else if(value=="author" && $scope.authorChecked == "fa fa-check-square-o")
			{
				$scope.selectedFilters[1].selected = false;
				$scope.authorChecked = 'fa fa-square-o';
				$scope.refreshCharts();
			}

			if(value=="category" && $scope.categoryChecked == "fa fa-square-o")
			{
				$scope.selectedFilters[2].selected = true;
				$scope.categoryChecked = 'fa fa-check-square-o';
				$scope.categoryFilter();
			}
			else if(value=="category" && $scope.categoryChecked == "fa fa-check-square-o")
			{
				$scope.selectedFilters[2].selected = false;
				$scope.categoryChecked = 'fa fa-square-o';
				$scope.refreshCharts();
			}

			console.log($scope.selectedFilters);
		}

		$scope.yearFilter = function(year)
		{
			$scope.selectedYear = year;
			$scope.selectedFilters[0].valor = year;
			$scope.options.title.text = 'Artigos por mês';
			$scope.options.scales.xAxes[0].scaleLabel.labelString = 'Mês';
			$scope.labels = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", 'Agosto','Setembro','Outubro','Novembro','Dezembro'];
			Services.getPostCountStatistics(year).then(function(data){
				$scope.data=data;
			});
		}

		$scope.authorFilter = function(author)
		{
			$scope.selectedAuthor = author;
			$scope.selectedFilters[1].valor = author;
			$scope.options.title.text = 'Artigos por autor';
			$scope.options.scales.xAxes[0].scaleLabel.labelString = 'Autor';
			Services.getPostAuthorCountStatistics().then(function(data){
				var labels = [];
				var counts = [];

				for(var i=0; i<data.length; i++)
				{
					var name = data[i].name.split(" ");

					var shortName = name[0][0] +". "+ name[name.length-1];

					labels.push(shortName);
					counts.push(data[i].count);
				}

				$scope.labels = labels;
				$scope.data=counts;
			});
		}

		$scope.categoryFilter = function(category)
		{
			$scope.selectedCategory = category;
			$scope.selectedFilters[2].valor = category;
			$scope.options.title.text = 'Artigos por palavra-chave';
			$scope.options.scales.xAxes[0].scaleLabel.labelString = 'Palavra-Chave';
			Services.getPostCategoryCountStatistics().then(function(data){
				var labels = [];
				var counts = [];

				for(var i=0; i<data.length; i++)
				{
					labels.push(data[i].tag);
					counts.push(data[i].count);
				}

				$scope.labels = labels;
				$scope.data=counts;
			});
		}

		//$scope.colors = {colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']};

		$scope.options = {
			responsive: true,
			labelFontSize : '4',
			title:{
				display:true,
				text:''
			},
			tooltips: {
				mode: 'index',
				intersect: false,
			},
			hover: {
				mode: 'nearest',
				intersect: true
			},
			scales: {
				xAxes: [{
					display: true,
					labelMaxWidth: 20,
					scaleLabel: {
						display: true,
						labelString: ''
					}
				}],
				yAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Número de Artigos'
					},
					ticks: {
						//min: 0,
						//max: 100,

						// forces step size to be 5 units
						stepSize: 5
					}
				}]
			},
			colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']
		};

		console.log($scope.selectedFilters);
		$scope.toggleFilter('ano');

	});

	//IMAGE upload
	adminApp.controller('UploadImageModalInstance', function($scope, $modalInstance, Services, ngToast){

		$scope.image = '/home/img/default.jpeg';

		$scope.progress = 0;
		$scope.files = [];

		console.log($scope.files);
		$scope.upload = function(file){
			console.log(file);
			var fd = new FormData();
			//Take the first selected file
			fd.append("uploadImageFile", file);

			Services.imageUpload(fd).then(function(res,err){

				if(res.message != undefined)
				{
					ngToast.create(res.message);
				}
				else {
					ngToast.create("Imagem Carregada com Sucesso");
					$scope.image = res.path.replace("public/","../");
				}
			});
		};

		$scope.insert = function(){
			$modalInstance.close($scope.image);
		};
	})

	//ADMIN Controller
	adminApp.controller('AdminCtrl', function($scope, Users, Services, ngToast){

		Services.getAdministratorList().then(function(data){
			$scope.adminList=data;
		});

		$scope.updateUsers = function () {
			Users.all().then(function(data){
				$scope.users=data;
			});
		};

		$scope.users = $scope.updateUsers();

		$scope.removeUser = function(user){
			Users.remove(user._id).then(function(res){
				if(res.message != undefined)
				{
					if(res.message == 'User deleted!')
					$scope.updateUsers();
				}
				else {
					$scope.updateUsers();
				}
			});
		};

		$scope.registerUser = function(user){
	
			Services.registerUser(user).then(function(res){
				if(res.message != undefined)
				{
					ngToast.create(res.message);
					$scope.updateUsers();
				}
				else {
					ngToast.create('Utilizador Registado');
					$scope.user = {};
					$scope.updateUsers();
				}
			});
		};

	});

	// DIRECTIVES

	adminApp.directive('contenteditable', [function() {
		return {
			require: '?ngModel',
			scope: {

			},
			link: function(scope, element, attrs, ctrl) {
				// view -> model (when div gets blur update the view value of the model)
				element.bind('blur', function() {
					scope.$apply(function() {
						ctrl.$setViewValue(element.html());
					});
				});

				// model -> view
				ctrl.$render = function() {
					element.html(ctrl.$viewValue);
				};

				// load init value from DOM
				ctrl.$render();

				// remove the attached events to element when destroying the scope
				scope.$on('$destroy', function() {
					element.unbind('blur');
					element.unbind('paste');
					element.unbind('focus');
				});
			}
		};
	}]);

	adminApp.directive('jqtimepicker', function () {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, element, attrs) {
				$(element).timepicker({});
			}
		};
	});
