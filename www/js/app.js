'use strict';
(function(){

  var app=angular.module('unlab', ['ionic','task','ngCordovaOauth','ngSanitize']);
  var resourceEndPoint="http://appunlab.comtic.co/"



  app.config(function($stateProvider,$urlRouterProvider){

    $stateProvider.state('login',{
      url:'/login',
      templateUrl:'templates/login.html'
    });
    $stateProvider.state('home',{
      url:'/home',
      templateUrl:'templates/home.html'
    });
    $stateProvider.state('news_detail',{
      url:'/news-detail/:id',
      templateUrl:'templates/news.html'
    });
    $stateProvider.state('consult',{
      url:'/consult',
      templateUrl:'templates/consult.html'
    });


    $urlRouterProvider.otherwise('/login');

  });

   /*
    *controladro para autenticar el usuario  en el sistema
    */
  app.controller('LoginController',function($scope,
                                            $cordovaOauth,
                                            $ionicLoading,
                                            $ionicPopup,
                                            $http,
                                            $state,
                                            Task,Session){
    Session.isLoggin();

    
    $scope.hasError=false;
    $scope.error='';
    $scope.formData={email:'',password:''}

    /*regular login*/
    $scope.login=function(){
      

      if($scope.email!=""){

        if(!Task.validEmail($scope.formData.email)){

          $scope.hasError=true;
          $scope.error='Por favor ingrese un correo electronico valido!';
          return;
        }

      }
      $scope.hasError=false;
      $scope.error='';

      if ($scope.formData.email ==""||$scope.formData.password=="" ){
          $scope.hasError=true;
          $scope.error='Por favor ingrese un correo electronico! , Por favor ingrese una contraseña!';
          return;
      }
      $scope.hasError=false;
      $scope.error='';

      $ionicLoading.show({
              template: 'Cargando...'
            });

      $.post(resourceEndPoint+"api/sigin",{email:$scope.formData.email,password:$scope.formData.password},function(res){
                    $ionicLoading.hide();
                     localStorage.setItem("id", res.userdata.id);
                     localStorage.setItem("name",  res.userdata.name);
                     localStorage.setItem("lastname",  res.userdata.lastname);
                     localStorage.setItem("email",  res.userdata.email);
                     localStorage.setItem("img",  res.userdata.image);
                     localStorage.setItem("logged_in", true);
                     localStorage.setItem("token", res.token.token);
                    $state.go('home');

         }).fail(function(error){
             $ionicPopup.alert({
                 title: 'Fallo autenticación!',
                 template: 'Compruebe los datos de acceso y vuelva a intentarlo'+angular.toJson(error,true)
            });
           $ionicLoading.hide();
         });
                
    }/*end regular login*/

    
    /*login con facebook*/
  $scope.facebookLogin = function() {
    document.addEventListener("deviceready", function () {

         $cordovaOauth.facebook("1687504901530092", ["email","public_profile"]).then(function(result) {
           $ionicLoading.show({
              template: 'Cargando...'
            });

           $http.get("https://graph.facebook.com/v2.2/me", {params: { access_token: result.access_token, fields: "id,first_name,last_name,email,picture", format: "json" }}).then(function(result) {
                 
              var login ={
                'identifier' : result.data.id,
                'firstName': result.data.first_name,
                'photoURL' : result.data.picture.data.url,
                'lastName' : result.data.last_name,
                'email': result.data.email
              };
              alert(angular.toJson(login,true));

              $.post(resourceEndPoint+"api/social/sigin",{data:login},function(res){

                     $ionicLoading.hide();
                     localStorage.setItem("id", res.userdata.id);
                     localStorage.setItem("name",  res.userdata.name);
                     localStorage.setItem("lastname",  res.userdata.lastname);
                     localStorage.setItem("email",  res.userdata.email);
                     localStorage.setItem("img",  res.userdata.image);
                     localStorage.setItem("logged_in", true);
                     localStorage.setItem("token", res.token.token);
                     $state.go('home');

               }).fail(function(){
                     $ionicPopup.alert({
                         title: 'Fallo autenticación!',
                         template: 'Compruebe los datos de acceso y vuelva a intentarlo'
                    });
                   $ionicLoading.hide();
             });
            

              }, function(error) {

                  alert("Ha ocurrido un error inesperado, vuelve a intentarlo mas tarde, error("+angular.toJson(error,true)+")");
                  $ionicLoading.hide();
              });

          }, function(error) {
             alert("Ha ocurrido un error inesperado, vuelve a intentarlo mas tarde, error("+angular.toJson(error,true)+")");
             $ionicLoading.hide();
        });

     },false);

  }/*end login facebook*/

  /*login con google*/
  $scope.googleLogin  = function() {
    document.addEventListener("deviceready", function () {

         $cordovaOauth.google("300274685250-j35fcbdbo8hu8i3oh90dqovfub762uen.apps.googleusercontent.com", ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"]).then(function(result) {
            
           //navigator.notification.activityStart('Espere por favor','Cargando');
           $ionicLoading.show({
              template: 'Cargando...'
            });

           $http.get("https://www.googleapis.com/plus/v1/people/me", {params: { access_token: result.access_token }}).then(function(result) {
                 
              var login ={
                    'identifier' :result.data.id,
                    'firstName': result.data.name.givenName,
                    'photoURL' : result.data.image.url,
                    'lastName' : result.data.name.familyName,
                    'email': result.data.emails[0].value
                  };
              

                $.post(resourceEndPoint+"api/social/sigin",{data:login},function(res){
                        
                        $ionicLoading.hide();
                        localStorage.setItem("id", res.userdata.id);
                        localStorage.setItem("name",  res.userdata.name);
                        localStorage.setItem("lastname",  res.userdata.lastname);
                        localStorage.setItem("email",  res.userdata.email);
                        localStorage.setItem("img",  res.userdata.image);
                        localStorage.setItem("logged_in", true);
                        localStorage.setItem("token", res.token.token);
                        $state.go('home');

                  }).fail(function(){
                       $ionicPopup.alert({
                           title: 'Fallo autenticación!',
                           template: 'Compruebe los datos de acceso y vuelva a intentarlo'
                      });
                     $ionicLoading.hide();
                 });
                
             
 
              }, function(error) {
                  alert("Ha ocurrido un error inesperado, vuelve a intentarlo mas tarde, error("+angular.toJson(error,true)+")");
                  $ionicLoading.hide();
              });

          }, function(error) {
             alert("Ha ocurrido un error inesperado, vuelve a intentarlo mas tarde, error("+angular.toJson(error,true)+")");
             $ionicLoading.hide();
        });

     },false);

  }/*end login google*/

});/*end login controller*/

app.controller('HomeController',function($scope,$ionicSlideBoxDelegate,$http,Session){

Session.isLoggin();
$scope.base_url=resourceEndPoint;
$scope.galleryFolder='';
$scope.slides=[];
$scope.news=[];
$scope.pageNews=0;
$scope.hasNews=true;


/*cargar los  sliders*/
$http.get(resourceEndPoint+'api/gallery/active/?token='+localStorage['token']).success(function(res){

  $scope.galleryFolder=res.gallery.id;
  $scope.slides=res.items;


}).error(function(){
   $ionicPopup.alert({
          title: 'Fallo!',
          template: 'Fallo al cargar los sliders'
    });
});
$scope.navSlide = function(index) {
        $ionicSlideBoxDelegate.slide(index, 500);
}

/*cargar los noticias*/
$http.get(resourceEndPoint+'api/news/?token='+localStorage['token']+'&page='+$scope.pageNews).success(function(res){

  $scope.news=res;

}).error(function(){
    $scope.hasNews=false;

   $ionicPopup.alert({
          title: 'Fallo!',
          template: 'Fallo al cargar los sliders'
    });
});

  $scope.loadMore = function() {
    $scope.pageNews++;
    
      $http.get(resourceEndPoint+'api/news/?token='+localStorage['token']+'&page='+$scope.pageNews++).success(function(items) {
       
          
          angular.forEach(items,function(v){
              $scope.news.push(v);
          });

        $scope.$broadcast('scroll.infiniteScrollComplete');
      }).error(function(){
           $scope.hasNews=false;
      });

    };

});
/*controlador de noticias*/
app.controller('NewsController',function($scope,$state,$http,$sce){

    var id =$state.params.id;
    $scope.base_url =resourceEndPoint;

    /*cargar noticia especifica*/
    $http.get(resourceEndPoint+'api/news/'+id+'/?token='+localStorage['token']).success(function(res){

    $scope.news=res;
    $scope.thisCanBeusedInsideNgBindHtml = $sce.trustAsHtml($scope.news.content);

  }).error(function(){
      $scope.hasNews=false;

     $ionicPopup.alert({
            title: 'Fallo!',
            template: 'Fallo al cargar los sliders'
      });
  });

});
/*consultar resultados del laboratorio*/
app.controller("ConsultController",function($scope,$http){
 $scope.formData={number:'',password:''}
 $scope.hasError=false;
 $scope.error='';

});

    app.run(function($ionicPlatform,$rootScope,Session) {

      $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

          cordova.plugins.Keyboard.disableScroll(true);
        }

        if(window.cordova && window.cordova.plugin.InAppBrowser){

            window.open = cordova.InAppBrowser.open;
        }

        if(window.StatusBar) {
          StatusBar.styleDefault();
        }

        /*load global logout function*/
            $rootScope.task=Session;

      });
    });

}());

