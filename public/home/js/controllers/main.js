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
.controller('AuthorCtrl', function ($scope, $log, author) {
  $scope.author = author;
})
.controller('AboutCtrl', function ($scope, $log) {
})
.controller('ArticlesCtrl', function ($scope, $log, allPosts, allCategories, allAuthors) {
  $scope.allP = allPosts;
  $scope.allC = allCategories;
  $scope.allA = allAuthors;

  $scope.convertDateToPT = function(date)
  {
    var date = new Date(date);
    return moment(date, "D_M_YYYY").locale('pt-br').format('LLL');
  }
  console.log(allAuthors);
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
.controller('ContactCtrl', function ($scope, $log, Services) {

  $scope.contactName = '';
  $scope.contactMail = '';
  $scope.contactBody = '<html>	<head><title></title></head><body><p style="text-align: center;"><img alt="" src="http://il5.picdn.net/shutterstock/videos/4796915/thumb/1.jpg"/></p><p><strong>Caro Administrador de Mover-A-Montanha</strong>,</p><p><strong>Foi efectuado um contacto com proveni&ecirc;ncia na p&aacute;gina de contacto de <a href="http://www.moveramontanha.com">www.moveramontanha.com</a></strong></p><p><strong>A mensagem enviada foi a seguinte:</strong></p><p>&nbsp;</p>';
  $scope.contactMessage = '';


  $scope.sendEmail = function()
  {
    var data = ({
      contactName: $scope.contactName,
      contactEmail: $scope.contactEmail,
      contactMessage: $scope.contactBody +'<p>&quot;<i>' + $scope.contactMessage + '</p></i>&quot;<br><p><strong>Este e-mail &eacute; gerado automaticamente atrav&eacute;s do servidor da p&aacute;gina.</strong></p></body></html>'
    });

    Services.sendEmail(data);
  }

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
