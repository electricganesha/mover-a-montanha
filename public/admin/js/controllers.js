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
		post.isDraft = !post.isDraft;

		Posts.update(post._id, post).then(function(res){
			if(res.message != undefined)
			{
				if(res.message == "Post updated!")
				res.message = "Artigo Actualizado!";
				$scope.post = {};
				$scope.posts = postList;
				$scope.activePost = false;
				$scope.isActive('allPosts');
			}
		});
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

adminApp.controller('AllSubscribersCtrl', function($scope, subscriberList, Subscribers){

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

adminApp.controller('StatisticsCtrl', function($scope, postList){

	$scope.labels = ["Janeiro", "Fevereiro", "Mar&ccedil;o", "Abril", "Maio", "Junho", "Julho", 'Agosto','Setembro','Outubro','Novembro','Dezembro'];
  $scope.series = ['Series A'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
	$scope.colors = {colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']};
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: true,
          position: 'right'
        }
      ]
    }
  };

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
