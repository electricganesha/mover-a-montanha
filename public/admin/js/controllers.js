adminApp.controller('NavCtrl', function($scope, $state){
	$scope.active = $state;
	$scope.isActive = function(viewLocation){
		var active = (viewLocation === $state.current.name);
		return active;
	};
});

adminApp.controller('AllPostsCtrl', function($scope, postList, Posts, Authors){

	$scope.updatePosts = function () {
		Posts.all().then(function(data){
	      $scope.posts=data;
	    });
  };

	$scope.posts = $scope.updatePosts();
	$scope.activePost = false;

	$scope.setActive = function(post){
		$scope.activePost = post;
		//$scope.getPostAuthor(post);
	}

	$scope.draftIt = function(post)
	{
		post.isDraft = !post.isDraft;

		Posts.update(post._id, post).then(function(res){
			console.log(res);
			if(res.message != undefined)
			{
				if(res.message == "Post updated!")
					res.message = "Artigo Actualizado!";
				//alert(res.message);
				$scope.post = {};
				$scope.posts = postList;
				$scope.activePost = false;
				$scope.isActive('allPosts');
			}
		});
	}

	$scope.editPost = function(id,editedPost){
		console.log("ID A EDITAR " + id);

		Posts.update(id,editedPost).then(function(res){
			console.log(res);
			if(res.message != undefined)
			{
				if(res.message == "Post updated!")
					res.message = "Artigo Actualizado!";
				alert(res.message);
				$scope.post = {};
				$scope.posts = postList;
				$scope.activePost = false;
				$scope.isActive('allPosts');
			}
		});
	};

	$scope.removePost = function(id){
		console.log("ID PASSADO " + id);
		Posts.remove(id).then(function(res){
			console.log(res);
			if(res.message != undefined)
			{
				alert(res.message);
				$scope.updatePosts();
			}
			else {
				alert("Artigo " + id + " Removido");
				$scope.post = {};
				$scope.activePost = false;
				$scope.updatePosts();
			}
		});
	};

	$scope.trimContentTo140Char = function(content)
	{
		console.log(content);
		var trimmedContent = content.substr(0, 140);
		trimmedContent = trimmedContent + "...";
		return trimmedContent;
	}
});

adminApp.controller('AddPostCtrl', function($scope, Posts, authorList, Categories){
	$scope.post = {};
	$scope.authors = authorList;
	$scope.selectedAuthor = {};
	$scope.post.isDraft = false;
	var tagsIndex;
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
			console.log(Categories.returnJSON());
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
			console.log($scope.tags[value-1].text.toString() + " NOVO")
		}
		else
		{
			console.log($scope.tags[value-1].text.toString() + " JA EXISTE")
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
			console.log(idsTags);
			console.log($scope.post.tags);
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
				alert(res.message);
			}
			else {
				alert("Artigo Publicado");
				$scope.post = {};
				$scope.isActive('allPosts');
			}
		});
	};


});

// AUTHORS

adminApp.controller('AllAuthorsCtrl', function($scope, authorList, Authors){

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
		console.log("ID A EDITAR " + id);

		Authors.update(id,editedAuthor).then(function(res){
			console.log(res);
			if(res.message != undefined)
			{
				if(res.message == "Author updated!")
					alert("Autor - " + editedAuthor.name + " - Actualizado");
				$scope.$apply();
			}
		});
	};

	$scope.removeAuthor = function(author){
		console.log("ID PASSADO " + author._id);
		Authors.remove(author._id).then(function(res){
			console.log(res);
			if(res.message != undefined)
			{
				console.log(res);
				if(res.message == 'Author deleted!')
					alert("Autor - " + author.name + " - Removido");
				$scope.updateAuthors();
			}
			else {
				alert("Autor - " + author.name + " - Removido");
				$scope.updateAuthors();
			}
		});
	};
});

adminApp.controller('AddAuthorCtrl', function($scope, Authors){
	$scope.author = {};
	$scope.defaultPhoto = '../home/img/thumbnail.jpeg'
	console.log($scope.author.photo);

	// upload on file select or drop
		 $scope.upload = function (file) {
			 var fd = new FormData();
			 //Take the first selected file
			 fd.append("uploadImageFile", file);
			 Authors.upload(fd).then(function(res,err){
				 $scope.author.photo = res.path.replace("public/","../");
				 $scope.author.photo = res.path.replace("public/","../");

				 console.log($scope.author);
				 if(res.message != undefined)
				 {
					 alert(res.message);
					 console.log(res.message);
				 }
				 else {
					 alert("Imagem Carregada com Sucesso");
					 $scope.author.photo = res.path.replace("public/","../");
					 photo = res.path.replace("public/","../");
				 }
			 });
	 };

	$scope.addAuthor = function(newAuthor){
		$scope.author.photo = photo;
		Authors.add(newAuthor).then(function(res){
			console.log(newAuthor);
			console.log(res);
			if(res.message != undefined)
			{
				alert(res.message);
			}
			else {
				alert("Autor Adicionado");
				$scope.author = {};
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
