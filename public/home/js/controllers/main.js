app.controller('MainCtrl', function ($scope, $log, postList, category, author, Services) {

  $scope.posts = postList;
  $scope.category = category;
  $scope.author = author;

  /*$scope.shortenURL = function(postId)
  {
  var urlShortenPromise = Services.shortenURL("http://www.moveramontanha.com/posts/"+postId);
  urlShortenPromise.then(function(result) {

  // this is only run after getData() resolves
  $scope.data = result;
  console.log("data.name"+$scope.data.name);
});
}*/

$scope.convertDateToPT = function(date)
{
  var date = new Date(date);
  return moment(date, "D_M_YYYY").locale('pt-br').format('LLL');
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
.controller('ArticleCtrl', function ($scope, $log, article) {
  $scope.post = article;
  var meioartigo = article.body.length/2;
  var brDoMeio = article.body.indexOf("<br/>", meioartigo);
  $scope.post1 = article.body.substr(0, brDoMeio);
  $scope.post2 = article.body.substr(brDoMeio, article.body.length);
<<<<<<< Updated upstream
  
=======
  console.log($scope.post1);
  console.log($scope.post2);

>>>>>>> Stashed changes

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
