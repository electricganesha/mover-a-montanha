var formatDateController = function(date)
{
	var monthNames = [
		"Janeiro", "Fevereiro", "Março",
		"Abril", "Maio", "Junho", "Julho",
		"Agosto", "Setembro", "Outubro",
		"Novembro", "Dezembro"
	];

	date = new Date(date);

	var day = date.getDate();
	var monthIndex = date.getMonth();
	var year = date.getFullYear();

	return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

var formatMonthController = function (month)
{
	switch(month)
	{
		case(1):
		return 'Janeiro';
		break;
		case(2):
		return 'Fevereiro';
		break;
		case(3):
		return 'Março';
		break;
		case(4):
		return 'Abril';
		break;
		case(5):
		return 'Maio';
		break;
		case(6):
		return 'Junho';
		break;
		case(7):
		return 'Julho';
		break;
		case(8):
		return 'Agosto';
		break;
		case(9):
		return 'Setembro';
		break;
		case(10):
		return 'Outubro';
		break;
		case(11):
		return 'Novembro';
		break;
		case(12):
		return 'Dezembro';
		break;
	}
}

adminApp.controller('NavCtrl', function($scope, $state){
	$scope.active = $state;
	$scope.isActive = function(viewLocation){
		var active = (viewLocation === $state.current.name);
		return active;
	};
});

adminApp.controller('AllPostsCtrl', function($scope, $window, postList, Posts, authorList, categoryList, Authors, Categories, ngToast, Users){

	$scope.updatePosts = function () {
		Posts.all().then(function(data){
			$scope.posts=data;
		});
	};

	var applyFilter = function (){
		Posts.filter($scope.changedDate,$scope.changedAuthor,$scope.changedCategory).then(function(data){
			$scope.posts=data;
		});
	}

	$scope.selectedFilter = 'descend';

	var tagsIndex = [];
	var idsTags = [];

	$scope.authors = authorList;
	$scope.selectedAuthor = {};
	$scope.posts = $scope.updatePosts();
	$scope.activePost = false;
	$scope.showEditionDiv = false;
	var originalRetrievedTagsLength = 0;

	$scope.tagsLoaded = false;

	/*-------- Categories -------*/
	$scope.categoriesArray = [];
	$scope.categoriesArray.push({tag:"Todas", _id:"Todas"});
	for(var i=0; i<categoryList.length; i++){
		$scope.categoriesArray.push(categoryList[i]);
	}
	$scope.allC = $scope.categoriesArray;

	/*-------- Authors -------*/
	var authorsArray = [];
	authorsArray.push({name:"Todos", _id:"Todos"});
	for(var i=0; i<authorList.length; i++){
		authorsArray.push(authorList[i]);
	}
	$scope.allA = authorsArray;

	$scope.formattedDate = '';

	$scope.changedDate = 'All';
	$scope.changedAuthor = 'All';
	$scope.changedCategory = 'All';

	$scope.convertDateToPT = function(date)
	{
		var date = new Date(date);
		return moment(date, "D_M_YYYY").locale('pt-br').format('LLL');
	}

	var formatMonthExtended = function(month)
	{
		switch(month)
		{
			case('01'):
			return 'Janeiro';
			break;
			case('02'):
			return 'Fevereiro';
			break;
			case('03'):
			return 'Março';
			break;
			case('04'):
			return 'Abril';
			break;
			case('05'):
			return 'Maio';
			break;
			case('06'):
			return 'Junho';
			break;
			case('07'):
			return 'Julho';
			break;
			case('08'):
			return 'Agosto';
			break;
			case('09'):
			return 'Setembro';
			break;
			case('10'):
			return 'Outubro';
			break;
			case('11'):
			return 'Novembro';
			break;
			case('12'):
			return 'Dezembro';
			break;
		}
	}

	var formatMonthNumeric = function(month)
	{
		switch(month)
		{
			case('Janeiro'):
			return '01';
			break;
			case('Fevereiro'):
			return '02';
			break;
			case('Março'):
			return '03';
			break;
			case('Abril'):
			return '04';
			break;
			case('Maio'):
			return '05';
			break;
			case('Junho'):
			return '06';
			break;
			case('Julho'):
			return '07';
			break;
			case('Agosto'):
			return '08';
			break;
			case('Setembro'):
			return '09';
			break;
			case('Outubro'):
			return '10';
			break;
			case('Novembro'):
			return '11';
			break;
			case('Dezembro'):
			return '12';
			break;
		}
	}

	var getMonthList = function()
	{
		var dates = [];
		dates.push("Todos");

		for(var i=0; i<postList.length; i++)
		{
			var post = postList[i];

			var date = formatMonthExtended(post.created_at[5]+post.created_at[6])+" de "+post.created_at[0]+post.created_at[1]+post.created_at[2]+post.created_at[3];

			if(dates.indexOf(date) == -1)
			dates.push(date);
		}
		return dates;
	}
	$scope.monthList = getMonthList();

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
		$scope.showEditionDiv = true;
		var authorIndex;

		$scope.manageTags();

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
			if(post.author)
			{
				if($scope.authors[i]._id == post.author._id)
				{
					authorIndex = i;
				}
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

	$scope.changePubMode = function(post)
	{
		if(post.isAuto == true){
			post.isAuto = false;
		}else{
			post.isAuto = true;
		}
		Posts.update(post._id, post).then(function(res){});
	}

	$scope.editPost = function(id,editedPost){

		editedPost.tags = idsTags;
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
				$scope.updatePosts();
			}
			// create a simple toast:

			$scope.showEditionDiv = false;
		});
	};

	$scope.removePost = function(id){
		Posts.remove(id).then(function(res){
			$scope.activePost.title = '';
			$scope.activePost.author = '';
			$scope.activePost = '';
			$scope.showEditionDiv = false;
			$scope.activePost.tags = [];
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

	if($scope.currentUser.author != "" && $scope.currentUser.author != undefined)
	{
		Authors.one($scope.currentUser.author).then(function(data){
			$scope.currentUserName = data.name;
		});
	}


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
		$scope.manageTags(value);
	});

	$scope.manageTags = function(value)
	{
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
	}

	$scope.changedCategories = function(value)
	{
		if(value != 'Todas')
		{
			$scope.changedCategory = value;
		}
		else
		{
			$scope.changedCategory = 'All';
		}

		applyFilter();
	}

	$scope.changedAuthors = function(value)
	{
		if(value != 'Todos')
		{
			$scope.changedAuthor = value;
		}
		else
		{
			$scope.changedAuthor = 'All';
		}
		applyFilter();
	}

	$scope.changeMonthDropDown = function(value)
	{
		if(value != 'Todos')
		{
			var month = value.split(" ");
			var monthFormatted = formatMonthNumeric(month[0]);
			$scope.changedDate = monthFormatted+month[2];
		}
		else
		{
			$scope.changedDate = 'All';
		}
		applyFilter();
	}
});


adminApp.controller('AddPostCtrl', function($scope, Posts, authorList, Categories, ngToast){
	$scope.post = {};
	$scope.authors = authorList;
	$scope.selectedAuthor = {};
	$scope.post.isDraft = false;
	$scope.post.isAuto = false;
	$scope.post.programmed_to_post = new Date(Date.now());
	var tagsIndex = [];
	var idsTags = [];
	$scope.hour = '';

	Categories.all().then(function(data){
		tagsIndex = data;
		$scope.tags = [
			{ text: 'Política' },
			{ text: 'Portugal' },
			{ text: 'Europa' }
		];

		idsTags = ['596755fa5e0882799220c6a8','596755fe5e0882799220c6a9','596756015e0882799220c6aa']
	});



	$scope.loadTags = function(query) {
		return Categories.returnJSON();
	};

	$scope.$watch('tags.length', function(value) {
		$scope.tagsManager(value);
	});

	$scope.tagsManager = function(value)
	{
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
	}

	$scope.selectAuthor = function(author){
		$scope.post.author = author;
	};

	$scope.draftIt = function(post)
	{
		post.isDraft = !post.isDraft;
	}

	$scope.updateEmailHour = function(post)
	{
		var hour = $('#timepicker')[0].value;
		$scope.hour = hour;
	}

	$scope.changePubMode = function(post)
	{
		post.isAuto = !post.isAuto;
	}

	$scope.addPost = function(newPost){
		newPost.tags = idsTags;
		var timeConv = $scope.hour.split(':');
		newPost.programmed_to_post.setHours(parseInt(timeConv[0])+1);
		newPost.programmed_to_post.setMinutes(parseInt(timeConv[1]));

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
	$scope.showAuthorEditionDiv = false;

	$scope.setActive = function(author){
		$scope.showAuthorEditionDiv = true;
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
		$scope.showAuthorEditionDiv = false;
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

adminApp.controller('AllSubscribersCtrl', function($scope, subscriberList, ngToast, Subscribers, Services, mailConfig, MailConfig){

	$('input.timepicker').timepicker({
		timeFormat: 'H:mm',
		ampm: true       });

		Services.getEmailHour().then(function(data){
			$scope.currentEmailHour = data.hour;
		});


		$scope.mailConfig = mailConfig;
		$scope.emailHour = mailConfig[0].emailHour;

		$scope.saveConfig = function(updatedMailConfig)
		{
			MailConfig.update(mailConfig[0]._id, updatedMailConfig).then(function(res)
			{
				if(res.message != undefined)
				{
					ngToast.create(res.message);
				}
				else {
					ngToast.create("Configura&ccedil;&atilde;o Alterada com Sucesso");
				}
			});
		}

		$scope.updateEmailHour = function()
		{
			var hour = $('#timepicker')[0].value;
			$scope.mailConfig[0].emailHour = hour;
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

		$scope.availableYears = ['Ano','Mês','Dia'];
		$scope.availableAuthors = [];
		$scope.availableCategories = [];
		$scope.authorChecked = 'fa fa-square-o';
		$scope.yearChecked = 'fa fa-square-o';
		$scope.categoryChecked = 'fa fa-square-o';
		$scope.visitorsChecked = 'fa fa-square-o';
		$scope.subscribersChecked = 'fa fa-square-o';
		$scope.timeMetricsChecked = 'fa fa-square-o';
		$scope.dt = '';
		$scope.labels = '';
		$scope.counts = '';
		$scope.yearFilterFilter = 'mes';
		var dateUnformat = new Date();
		$scope.dateFrom = dateUnformat.setDate(dateUnformat.getDate() - 365);
		$scope.dateTo = Date.now();
		$scope.canvasType = 'bar';
		$scope.total = "";

		$scope.renderdirective = false;

		$scope.selectedYear = '2016';
		$scope.selectedAuthor = '';
		$scope.selectedCategories = '';

		Authors.all().then(function(data){
			$scope.availableAuthors=data;
		});

		Categories.all().then(function(data){
			$scope.availableCategories=data;
		});

		$scope.refreshCharts = function()
		{
			$scope.labels = [];
			$scope.data= [];
		}

		$scope.toggleFilter = function(value)
		{

			$scope.yearChecked = 'fa fa-square-o';
			$scope.authorChecked = 'fa fa-square-o';
			$scope.categoryChecked = 'fa fa-square-o';
			$scope.visitorsChecked = 'fa fa-square-o';
			$scope.subscribersChecked = 'fa fa-square-o';
			$scope.timeMetricsChecked = 'fa fa-square-o';

			if(value=="ano" && $scope.yearChecked == "fa fa-square-o")
			{
				$scope.yearChecked = 'fa fa-check-square-o';
				$scope.yearFilter($scope.selectedYear);
			}
			else if(value=="ano" && $scope.yearChecked == "fa fa-check-square-o")
			{
				$scope.yearChecked = 'fa fa-square-o';
				$scope.refreshCharts();
			}

			if(value=="author" && $scope.authorChecked == "fa fa-square-o")
			{
				$scope.authorChecked = 'fa fa-check-square-o';
				$scope.authorFilter();
			}
			else if(value=="author" && $scope.authorChecked == "fa fa-check-square-o")
			{
				$scope.authorChecked = 'fa fa-square-o';
				$scope.refreshCharts();
			}

			if(value=="category" && $scope.categoryChecked == "fa fa-square-o")
			{
				$scope.categoryChecked = 'fa fa-check-square-o';
				$scope.categoryFilter();
			}
			else if(value=="category" && $scope.categoryChecked == "fa fa-check-square-o")
			{
				$scope.categoryChecked = 'fa fa-square-o';
				$scope.refreshCharts();
			}

			if(value=="visitors" && $scope.categoryChecked == "fa fa-square-o")
			{
				$scope.visitorsChecked = 'fa fa-check-square-o';
				$scope.visitorFilter();
			}
			else if(value=="visitors" && $scope.categoryChecked == "fa fa-check-square-o")
			{
				$scope.visitorsChecked = 'fa fa-square-o';
				$scope.refreshCharts();
			}

			if(value=="subscribers" && $scope.categoryChecked == "fa fa-square-o")
			{
				$scope.subscribersChecked = 'fa fa-check-square-o';
				$scope.subscriberFilter();
			}
			else if(value=="subscribers" && $scope.categoryChecked == "fa fa-check-square-o")
			{
				$scope.subscribersChecked = 'fa fa-square-o';
				$scope.refreshCharts();
			}

			if(value=="time" && $scope.categoryChecked == "fa fa-square-o")
			{
				$scope.timeMetricsChecked = 'fa fa-check-square-o';
				$scope.timeFilter();
			}
			else if(value=="time" && $scope.categoryChecked == "fa fa-check-square-o")
			{
				$scope.timeMetricsChecked = 'fa fa-square-o';
				$scope.refreshCharts();
			}
		}

		$scope.yearFilter = function()
		{
			var total = 0;
			$scope.options.title.text = 'Artigos por período de tempo';

			$scope.options.scales.xAxes[0].scaleLabel.labelString = 'Período';
			Services.getPostCountStatistics($scope.dateFrom,$scope.dateTo).then(function(data){

				var labels = [];
				var counts = [];

				for(var i=0; i<data.length;i++)
				{
					var date = new Date(data[i].created_at);

					switch($scope.yearFilterFilter){

						case('ano'):
						yearDate = date.getFullYear();
						if(labels.indexOf(yearDate) > -1)
						{
							counts[labels.indexOf(yearDate)] = counts[labels.indexOf(yearDate)]+1;
						}
						else {
							labels.push(yearDate);
							counts.push(1);
						}
						break;
						case('mes'):
						monthDate = formatMonthController(date.getMonth()+1);

						yearDate = date.getFullYear();

						fullDate = monthDate + ", "+yearDate;

						if(labels.indexOf(fullDate) > -1)
						{
							counts[labels.indexOf(fullDate)] = counts[labels.indexOf(fullDate)]+1;
						}
						else {
							labels.push(fullDate);
							counts.push(1);
						}
						break;
						case('dia'):

						if(labels.indexOf(formatDateController(date)) > -1)
						{
							counts[labels.indexOf(formatDateController(date))] = counts[labels.indexOf(formatDateController(date))]+1;
						}
						else {
							labels.push(formatDateController(date));
							counts.push(1);
						}
						break;
					}

					total += 1;
					$scope.total = "Total de artigos publicados de "+formatDateController($scope.dateFrom)+" a "+formatDateController($scope.dateTo)+" : "+total;
				}

				$scope.labels = labels;
				$scope.data = counts;

			});


		}

		$scope.toggleYearFilter = function(filter)
		{
			switch(filter)
			{
				case('ano'):
				$scope.yearFilterFilter = 'ano';
				break;
				case('mes'):
				$scope.yearFilterFilter = 'mes';
				break;
				case('dia'):
				$scope.yearFilterFilter = 'dia';
				break;
			}

			$scope.yearFilter();
		}

		$scope.authorFilter = function(author)
		{
			var total = 0;
			$scope.selectedAuthor = author;
			$scope.options.title.text = 'Artigos por autor';
			$scope.options.scales.xAxes[0].scaleLabel.labelString = 'Autor';
			$scope.canvasType = 'bar';
			Services.getPostAuthorCountStatistics().then(function(data){
				var labels = [];
				var counts = [];

				for(var i=0; i<data.length; i++)
				{
					var name = data[i].name.split(" ");

					var shortName = name[0][0] +". "+ name[name.length-1];

					labels.push(shortName);
					counts.push(data[i].count);
					total += data[i].count;
				}

				$scope.labels = labels;
				$scope.data=counts;
				$scope.total = "Total de artigos publicados de "+formatDateController($scope.dateFrom)+" a "+formatDateController($scope.dateTo)+" : "+total;
			});
		}

		$scope.categoryFilter = function(category)
		{
			var total = 0;
			$scope.selectedCategory = category;
			$scope.options.title.text = 'Artigos por palavra-chave';
			$scope.options.scales.xAxes[0].scaleLabel.labelString = 'Palavra-Chave';
			$scope.canvasType = 'bar';
			Services.getPostCategoryCountStatistics().then(function(data){
				var labels = [];
				var counts = [];

				for(var i=0; i<data.length; i++)
				{
					labels.push(data[i].tag);
					counts.push(data[i].count);
					total+= data[i].count;
				}

				$scope.labels = labels;
				$scope.data=counts;

				$scope.total = "";
			});
		}

		$scope.visitorFilter = function(category)
		{
			$scope.options.title.text = 'Visitantes entre as datas : '+ formatDateController($scope.dateFrom)+ " e "+ formatDateController($scope.dateTo);
			$scope.options.scales.yAxes[0].scaleLabel.labelString = 'Número de Visitantes';
			$scope.options.scales.xAxes[0].scaleLabel.labelString = 'Período';
			$scope.canvasType = 'line';
			Services.getVisitorCountStatistics($scope.dateFrom,$scope.dateTo).then(function(data){
				var labels = [];
				var counts = [];
				var total = 0;

				for(var i=0; i<data.length; i++)
				{
					var date = new Date(data[i].dateOfAccess);

					if(labels.indexOf(date.toDateString()) > -1)
					{
						counts[labels.indexOf(date.toDateString())] = counts[labels.indexOf(date.toDateString())]+1;
					}
					else {
						labels.push(date.toDateString());
						counts.push(1);
						total++;
					}
				}

				$scope.labels = labels;
				$scope.data=counts;
				$scope.total = "Total de visitantes no intervalo de datas de "+formatDateController($scope.dateFrom)+" a "+formatDateController($scope.dateTo)+" : "+total;
			});
		}

		$scope.subscriberFilter = function(subscriber)
		{
			$scope.options.title.text = 'Subscritores entre as datas : '+ formatDateController($scope.dateFrom)+ " e "+ formatDateController($scope.dateTo);
			$scope.options.scales.yAxes[0].scaleLabel.labelString = 'Número de Subscritores';
			$scope.options.scales.xAxes[0].scaleLabel.labelString = 'Período';
			$scope.canvasType = 'line';
			Services.getSubscriberCountStatistics($scope.dateFrom,$scope.dateTo).then(function(data){
				var labels = [];
				var counts = [];
				var total = 0;

				for(var i=0; i<data.length; i++)
				{
					var date = new Date(data[i].dateOfSubscription);

					if(labels.indexOf(formatDateController(date)) > -1)
					{
						counts[labels.indexOf(formatDateController(date))] = counts[labels.indexOf(formatDateController(date))]+1;
					}
					else {
						labels.push(formatDateController(date));
						counts.push(1);
						total++;
					}
				}

				$scope.labels = labels;
				$scope.data=counts;

				$scope.total = "Total de subscritores no intervalo de datas de "+formatDateController($scope.dateFrom)+" a "+formatDateController($scope.dateTo)+" : "+total;
			});
		}

		$scope.timeFilter = function(time)
		{
			$scope.options.title.text = '';
			$scope.total = "";
			$scope.labels = [];
			$scope.data=[];
			$scope.temporalMetrics = true;
			$scope.timeMetrics = '';

			var extensedDate = ""+moment(Date.now()).locale('en').format('LL');
			extensedDate = extensedDate.split(',').join("");
			extensedDate = extensedDate.split(' ').join("-");

			Services.getPostsTimeMetrics().then(function(data){
				$scope.postsTimeMetrics = data;
			});

			Services.getVisitorsTimeMetrics().then(function(data){
				$scope.visitorsTimeMetrics = data;
			});

			Services.getSubscribersTimeMetrics().then(function(data){
				$scope.subscribersTimeMetrics = data;
			});

			Services.getPostCountAll().then(function(data){
				$scope.totalPosts = data;
			});

			Services.getSubscriberCountAll().then(function(data){
				$scope.totalSubscribers = data;
			});

			Services.getVisitorCountAll().then(function(data){
				$scope.totalVisitors = data;
			});

			$scope.convertDateToPT = function(dateToConvert)
			{
				var date = new Date(dateToConvert);
				return moment(date, "D_M_YYYY").locale('pt-br').format('LL');
			}

			$scope.dayOfWeek = function(day)
			{
				switch(day)
				{
					case(0):
					return 'Domingo';
					break;
					case(1):
					return 'Segunda-Feira';
					break;
					case(2):
					return 'Terça-Feira';
					break;
					case(3):
					return 'Quarta-Feira';
					break;
					case(4):
					return 'Quinta-Feira';
					break;
					case(5):
					return 'Sexta-Feira';
					break;
					case(6):
					return 'Sábado';
					break;
				}
			}
		}

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

		$scope.colors = [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];

		//$scope.toggleFilter('ano');
	});

	//IMAGE upload
	adminApp.controller('UploadImageModalInstance', function($scope, $modalInstance, Services, ngToast){

		$scope.image = '/home/img/default.jpeg';

		$scope.progress = 0;
		$scope.files = [];

		$scope.upload = function(file){
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
	adminApp.controller('AdminCtrl', function($scope, Authors, Users, Services, ngToast){

		Services.getAdministratorList().then(function(data){
			$scope.adminList=data;
		});

		Authors.all().then(function(data){
			$scope.authorsAvailable=data;
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

	adminApp.controller('ChangePassCtrl', function($scope, Services, ngToast){

		$scope.changePwd = function(newPwd)
		{
			Services.changePwd(newPwd,$scope.currentUser._id).then(function(res){
				if(res.message != undefined)
				{
					ngToast.create(res.message);
				}
				else {
					ngToast.create('Password Alterada com sucesso');
					$scope.newPwd = "";
				}
			});
		}
	});
