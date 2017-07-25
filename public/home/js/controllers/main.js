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
.controller('ArticlesCtrl', function ($scope, $log, allPosts, allCategories, allAuthors, Posts) {
  $scope.allP = allPosts;
  $scope.allC = allCategories;
  $scope.allA = allAuthors;
  $scope.formattedDate = '';

  $scope.convertDateToPT = function(date)
  {
    var date = new Date(date);
    return moment(date, "D_M_YYYY").locale('pt-br').format('LLL');
  }

  var getMonthList = function()
  {
    var dates = [];

    for(var i=0; i<allPosts.length; i++)
    {
      var post = allPosts[i];

      var date = formatMonthExtended(post.created_at[5]+post.created_at[6])+" de "+post.created_at[0]+post.created_at[1]+post.created_at[2]+post.created_at[3];

      if(dates.indexOf(date) == -1)
        dates.push(date);
    }
    return dates;
  }

  $scope.changeMonthDropDown = function(value)
  {
    var month = value.split(" ");
    var monthFormatted = formatMonthNumeric(month[0]);
    var changedDate = monthFormatted+month[2];

    Posts.filter(changedDate,'All','All').then(function(data){
	      $scope.allP=data;
	   });
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
        return 'Mar&ccedil;o';
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
      case('Mar&ccedil;o'):
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

  $scope.monthList = getMonthList();
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
