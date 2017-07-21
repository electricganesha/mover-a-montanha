app.controller('MainCtrl', function ($scope, $log, postList, authorList, category, author, Services) {

  $scope.posts = postList;
  $scope.category = category;
  $scope.author = author;
  $scope.authors = authorList;
  $scope.activePosts = [];

    for(var i=0 ; i < $scope.posts.length; i++)
    {
      if($scope.posts[i].isDraft == true)
        {
          $scope.firstPost = $scope.posts[i];
          break;
        }
    }

    for(var i=1 ; i < $scope.posts.length; i++)
    {
      if($scope.posts[i].isDraft == true)
        {
          $scope.activePosts[i-1] = $scope.posts[i];
        }
    }


    $scope.slickConfig = {
        draggable: false,
        centerMode: false,
        slidesToShow: 4,
        infinite: true,
        event: {
            beforeChange: function (event, slick, currentSlide, nextSlide) {
            },
            afterChange: function (event, slick, currentSlide, nextSlide) {
            }
        }
    };

$scope.convertDateToPT = function(date)
{
  var date = new Date(date);
  return moment(date, "D_M_YYYY").locale('pt-br').format('LLL');
}

$scope.trimContentTo100Char = function(content)
{
  var trimmedContent = content.body.substr(0, 100);
  trimmedContent = trimmedContent + "...";
  return trimmedContent;
}

})
.controller('AuthorsCtrl', function ($scope, $log, authorList) {
  $scope.authors = authorList;
})
.controller('AuthorCtrl', function ($scope, $log, author, Posts) {
  $scope.author = author;
  $scope.mostraQuote = false;

  if($scope.author.quote == '' || $scope.author.quote == undefined){
    $scope.mostraQuote = false;
  }else{
    $scope.mostraQuote = true;
  }

  $scope.authorPosts = Posts.author($scope.author._id).then(function(data){
    $scope.postsAuthor = data;
  });
})
.controller('AboutCtrl', function ($scope, $log) {
})
.controller('ArticleCtrl', function ($scope, $log, article, Posts) {
  $scope.post = article;
  var meioartigo = article.body.length/2;
  var brDoMeio = article.body.indexOf("<br/>", meioartigo);
  $scope.post1 = article.body.substr(0, brDoMeio);
  $scope.post2 = article.body.substr(brDoMeio, article.body.length);

  $scope.mostraRecap = false;
  $scope.mostraRecapSoCat = false;

  if($scope.post.recap == '' || $scope.post.recap == undefined){
    $scope.mostraRecap = false;
    if($scope.post.categories.length == 0){
      console.log("Entrei");
      $scope.mostraRecapSoCat = false;
    }else{
      $scope.mostraRecapSoCat = true;
    }
  }else{
    $scope.mostraRecap = true;
  }
  console.log($scope.post.categories.length);
  console.log($scope.mostraRecap);
  console.log($scope.mostraRecapSoCat);

	$scope.authorPosts = Posts.author($scope.post.author._id).then(function(data){
    $scope.postsAuthor = data;
  });
      
  $scope.convertDateToPT = function(date)
  {
    var date = new Date(date);
    return moment(date, "D_M_YYYY").locale('pt-br').format('LLL');
  }
})
.controller('ContactCtrl', function ($scope, $log) {
})
.controller('NavCtrl', function($scope, $state){
  $scope.active = $state;
  $scope.isActive = function(viewLocation){
    var active = (viewLocation === $state.current.name);
    return active;
  };
})
.controller('SidenavCtrl', function ($scope, $log) {
  $scope.close = function () {
    $log.debug("close RIGHT is done");
  };
});
