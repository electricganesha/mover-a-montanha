app.factory('initMenu', function(){
  return {
    init: function () {
      (function($) {
        $(window).scroll(function() {
          var addRemClass = $(window).scrollTop() > 300 ? 'addClass' : 'removeClass';
          $("header")[addRemClass]('muda');
        });
      })(jQuery);
      (function($) {
        $('.button').off('click');
        $("#cssmenu ul li").off('click');
        var isLargeWindow;
        $(document).ready(function(){
          if($(this).width() > 1015){
            isLargeWindow = true;
          }else{
            isLargeWindow = false;
          }
          $("#cssmenu").menumaker({
            format: "multitoggle"
          });
        });
        $.fn.menumaker = function(options) {
          var cssmenu = $(this), settings = $.extend({
            format: "dropdown",
            sticky: false
          }, options);
          return this.each(function() {
            $(this).find(".button").on('click', function(){
              var mainmenu = $(this).next('ul');
              $(this).toggleClass('menu-opened');
              if (mainmenu.hasClass('open')) {
                mainmenu.slideToggle().removeClass('open');
              } else {
                mainmenu.slideToggle().addClass('open');
                if (settings.format === "dropdown") {
                  mainmenu.find('ul').show();
                }
              }
            }),
            $("#cssmenu ul li").on("click", function () {
              if (!isLargeWindow){
                $("#cssmenu").find(".button").removeClass('menu-opened');
                $("#cssmenu ul").slideToggle().removeClass('open');
              }
            });
          });
        };
      })(jQuery);
    }
  }
});

app.controller('MainCtrl', function ($scope, $log, postList, authorList, category, author, Services, initMenu) {

  document.body.scrollTop = document.documentElement.scrollTop = 0;

  initMenu.init();

  $scope.slickConfig = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1350,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1150,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
  };

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

      if($scope.firstPost.body.indexOf("ta-insert-video") > -1)
      {
        $scope.temVideo = true;
      }
      else
      {
        $scope.temVideo = false;
      }
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
    if(content.body.includes("ta-insert-video")){
      var trimmedContent = "<div id=\"iconviddiv\"><img id=\"iconvid\" src=\"/home/img/playbutton.png\"></div>";
      return trimmedContent;
    }if(content.body.includes("<img")){
      var trimmedContent = "<div id=\"iconviddiv\"><img id=\"iconvid\" src=\"/home/img/picture.png\"></div>";
      return trimmedContent;
    }else{
      var trimmedContent = content.body.substr(0, 100);
      trimmedContent = trimmedContent + "...";
      return trimmedContent;
    }
  }

})
.controller('AuthorsCtrl', function ($scope, $log, authorList, initMenu) {
  $scope.authors = authorList;
  document.body.scrollTop = document.documentElement.scrollTop = 0;
  initMenu.init();
})
.controller('AuthorCtrl', function ($scope, $log, author, Posts, initMenu) {
  document.body.scrollTop = document.documentElement.scrollTop = 0;
  initMenu.init();
  $scope.author = author;
  $scope.mostraQuote = false;

  if($scope.author.quote == '' || $scope.author.quote == undefined){
    $scope.mostraQuote = false;
  }else{
    $scope.mostraQuote = true;
  }

  $scope.authorPosts = Posts.author($scope.author._id).then(function(data){

    $scope.postsAuthor = data;
    $scope.authorHasDrafts = false;

    for(var i=0; i<$scope.postsAuthor.length; i++)
    {
      if($scope.postsAuthor[i].isDraft == true)
      $scope.authorHasDrafts = true;
    }
  });
})
.controller('AboutCtrl', function ($scope, $log, initMenu) {
  document.body.scrollTop = document.documentElement.scrollTop = 0;
  initMenu.init();
})
.controller('ArticlesCtrl', function ($scope, $log, allPosts, allCategories, allAuthors, Posts, $timeout, hasCategory, initMenu) {
  var apllyFilter = function (){
    Posts.filter($scope.changedDate,$scope.changedAuthor,$scope.changedCategory).then(function(data){
      $scope.allP=data;
    });
    $timeout(function() {
      angular.element(document.querySelector(".divAllArtigos")).removeClass("animate-flicker");
    }, 600);
  }
  document.body.scrollTop = document.documentElement.scrollTop = 0;
  initMenu.init();
  $scope.allP = allPosts;
  $scope.indiceC = 0;

  /*-------- Categories -------*/
  $scope.categoriesArray = [];
  $scope.categoriesArray.push({tag:"Todos", _id:"Todos"});
  for(var i=0; i<allCategories.length; i++){
    $scope.categoriesArray.push(allCategories[i]);
  }
  $scope.allC = $scope.categoriesArray;

  /*-------- Authors -------*/
  var authorsArray = [];
  authorsArray.push({name:"Todos", _id:"Todos"});
  for(var i=0; i<allAuthors.length; i++){
    authorsArray.push(allAuthors[i]);
  }
  $scope.allA = authorsArray;

  $scope.formattedDate = '';

  $scope.changedDate = 'All';
  $scope.changedAuthor = 'All';
  $scope.changedCategory = 'All';

  $scope.searchFilters = function()
  {
    angular.element(document.querySelector(".divAllArtigos")).addClass("animate-flicker");

    $timeout(function() {
      if($scope.searchTerms != '')
      {
        Posts.search($scope.searchTerms).then(function(data){
          $scope.allP=data;
        });
      }
      else
      {
        Posts.filter('All','All','All').then(function(data){
          $scope.allP=data;
        });
      }
    }, 400);
    $timeout(function() {
      angular.element(document.querySelector(".divAllArtigos")).removeClass("animate-flicker");
    }, 600);
  }

  $scope.convertDateToPT = function(date)
  {
    var date = new Date(date);
    return moment(date, "D_M_YYYY").locale('pt-br').format('LLL');
  }

  var getMonthList = function()
  {
    var dates = [];
    dates.push("Todos");

    for(var i=0; i<allPosts.length; i++)
    {
      var post = allPosts[i];

      var date = formatMonthExtended(post.created_at[5]+post.created_at[6])+" de "+post.created_at[0]+post.created_at[1]+post.created_at[2]+post.created_at[3];

      if(dates.indexOf(date) == -1)
      dates.push(date);
    }
    return dates;
  }


  $scope.changedCategories = function(value)
  {
    if(value != 'Todos')
    {
      $scope.changedCategory = value;
    }
    else
    {
      $scope.changedCategory = 'All';
    }


    angular.element(document.querySelector(".divAllArtigos")).addClass("animate-flicker");

    $timeout(function() {
      apllyFilter();
    }, 400);
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

    angular.element(document.querySelector(".divAllArtigos")).addClass("animate-flicker");

    $timeout(function() {
      apllyFilter();
    }, 400);
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

    angular.element(document.querySelector(".divAllArtigos")).addClass("animate-flicker");

    $timeout(function() {
      apllyFilter();
    }, 400);
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

  if(hasCategory){
    $scope.changedCategory = hasCategory;
    for(i=0;i< $scope.categoriesArray.length; i++){
      if($scope.categoriesArray[i]._id == hasCategory){
        $scope.indiceC = i;
        apllyFilter();
      }
    }
  }
  $scope.monthList = getMonthList();
})
.controller('ArticleCtrl', function ($scope, $log, article, Posts, initMenu) {
  document.body.scrollTop = document.documentElement.scrollTop = 0;
  initMenu.init();
  $scope.post = article;
  var meioartigo = article.body.length/2;
  var brDoMeio = article.body.indexOf("</p>", meioartigo);
  if(brDoMeio != -1)
  {
    $scope.post1 = article.body.substr(0, brDoMeio);
    $scope.post2 = article.body.substr(brDoMeio, article.body.length);
  }
  else {
    brDoMeio2 = article.body.indexOf("<br/>", meioartigo);
	if(brDoMeio2 != -1){
		$scope.post1 = article.body.substr(0, brDoMeio2);
    		$scope.post2 = article.body.substr(brDoMeio2, article.body.length);
	}
else {
    $scope.post1 = article.body;
    $scope.post2 = "";
}
  }

  $scope.mostraRecap = false;
  $scope.mostraRecapSoCat = false;

  //NG META se necessario
  /*ngMeta.init();
  ngMeta.setTitle(article.title);
  ngMeta.setTag('author', 'Mover-A-Montanha');
  ngMeta.setTag('image', 'http://moveramontanha.pt/home/img/moveramontanha_share.png');
  ngMeta.setTag('description',article.recap);
  ngMeta.setDefaultTag('author', 'Mover-A-Montanha');*/

  if($scope.post.recap == '' || $scope.post.recap == undefined){
    $scope.mostraRecap = false;
    if($scope.post.categories.length == 0){
      $scope.mostraRecapSoCat = false;
    }else{
      $scope.mostraRecapSoCat = true;
    }
  }else{
    $scope.mostraRecap = true;
  }

  if($scope.post1.indexOf("ta-insert-video") > -1)
  {
    $scope.post1TemVideo = true;
  }
  else
  {
    $scope.post1TemVideo = false;
  }

  if($scope.post2.indexOf("ta-insert-video") > -1)
  {
    $scope.post2TemVideo = true;
  }
  else
  {
    $scope.post2TemVideo = false;
  }

  $scope.authorPosts = Posts.author($scope.post.author._id).then(function(data){
    $scope.postsAuthor = data;
  });

  $scope.convertDateToPT = function(date)
  {
    var date = new Date(date);
    return moment(date, "D_M_YYYY").locale('pt-br').format('LLL');
  }
})
.controller('ContactCtrl', function ($scope, $log, Services, initMenu) {
  document.body.scrollTop = document.documentElement.scrollTop = 0;
  initMenu.init();

  $scope.contactName = '';
  $scope.contactEmail = '';
  $scope.contactBody = '<html><head><title></title></head><body><p style="text-align: center;"><img src="http://www.moveramontanha.pt/uploads/images/1503419697227.jpg"/></img></p><p><strong>Caro Administrador de Mover-A-Montanha</strong>,</p><p><strong>Foi efectuado um contacto com proveni&ecirc;ncia na p&aacute;gina de contacto de <a href="http://www.moveramontanha.pt">www.moveramontanha.pt</a></strong></p><p><strong>A mensagem enviada foi a seguinte:</strong></p><p>&nbsp;</p>';
  $scope.contactMessage = '';


  $scope.sendEmail = function()
  {
    var data = ({
      contactName: $scope.contactName,
      contactEmail: $scope.contactEmail,
      contactMessage: $scope.contactBody +'<p>&quot;<i>' + $scope.contactMessage + '&quot;</p></i><br><p><strong>Este e-mail &eacute; gerado automaticamente atrav&eacute;s do servidor da p&aacute;gina.</strong></p></body></html>'
    });

    alert('Email enviado! Obrigado pelo seu contacto!');
    $scope.contactName = '';
    $scope.contactEmail = '';
    $scope.contactMessage = '';

    Services.sendEmail(data);

  }

})
.controller('HighLightsCtrl', function ($scope, $log, allPosts, Services, initMenu) {

  $scope.allP = allPosts;

  $scope.convertDateToPT = function(date)
  {
    var date = new Date(date);
    return moment(date, "D_M_YYYY").locale('pt-br').format('LLL');
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
    subscriber.active = true;
    Subscribers.add(subscriber).then(function(data){
      if(!data.code)
      {
        Subscribers.email(subscriber).then(function(data){
          alert('Bem-vindo! Obrigado por subscrever ao blog Mover-A-Montanha!');
        });
      }
      else if(data.code == '11000')
      {

        Subscribers.oneByEmail($scope.email).then(function(data)
        {

          theSubscriber = data[0];

          if(theSubscriber.active == true)
          {
            alert('Este e-mail já se encontra registado na nossa base-de-dados!');
          }
          else
          {
            theSubscriber.active = true;
            Subscribers.update(theSubscriber._id, theSubscriber).then(function(res){
              if(res.message != undefined)
              {
                if(res.message == 'Subscriber updated!')
                {
                  alert('Bem-vindo de volta. Obrigado por voltar a subscrever ao blog Mover-A-Montanha!');
                }
              }
              else {
              }
            });
          }
        });
      }
    });

  }
})
.controller('SidenavCtrl', function ($scope, $log) {
  $scope.close = function () {
    $log.debug("close RIGHT is done");
  };
});
