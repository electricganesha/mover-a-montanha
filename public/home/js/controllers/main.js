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
  console.log("authors controller");
  $scope.authors = authorList;
})
.controller('AuthorCtrl', function ($scope, $log, author) {
  console.log("um autor");
  console.log(author);
  $scope.author = author;
})
.controller('AboutCtrl', function ($scope, $log) {
})
.controller('ArticleCtrl', function ($scope, $log, article, Posts) {
  $scope.post = article;
  var meioartigo = article.body.length/2;
  var brDoMeio = article.body.indexOf("<br/>", meioartigo);
  $scope.post1 = article.body.substr(0, brDoMeio);
  $scope.post2 = article.body.substr(brDoMeio, article.body.length);



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
.controller('FooterCtrl', function($scope, $state, Subscribers){
  $scope.subscribe = function()
  {
    var subscriber = { email:'' };
    subscriber.email = $scope.email;
    console.log(subscriber);
    Subscribers.add(subscriber).then(function(data){
        $scope.email = '';
    });
  }
})
.controller('SidenavCtrl', function ($scope, $log) {
  $scope.close = function () {
    $log.debug("close RIGHT is done");
  };
});
