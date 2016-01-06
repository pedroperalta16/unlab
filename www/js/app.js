'use strict';
(function(){

  var app=angular.module('unlab', ['ionic','ngCordovaOauth']);


  app.config(function($stateProvider,$urlRouterProvider){

    $stateProvider.state('login',{
      url:'/login',
      templateUrl:'templates/login.html'

    });


    $urlRouterProvider.otherwise('/login');

  });

   /*
    *controladro para autenticar el usuario  en el sistema
    */
  app.controller('LoginController',function($scope,$cordovaOauth,$location,$ionicLoading){
    
    /*login con facebook*/
  $scope.facebookLogin = function() {
    document.addEventListener("deviceready", function () {

         $cordovaOauth.facebook("1687504901530092", ["email","public_profile"]).then(function(result) {
            
           //navigator.notification.activityStart('Espere por favor','Cargando'); 
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

              $.post(endpoint+"api/mobile/socialLogin",{data:login},function(res){
                     
                     //navigator.notification.activityStop(); 
                     $ionicLoading.hide();

                         if(res.status=="ok"){

                               localStorage.setItem("id", res.data.id);
                               localStorage.setItem("name",  res.data.name);
                               localStorage.setItem("lastname",  res.data.lastname);
                               localStorage.setItem("correo",  res.data.correo);
                               localStorage.setItem("logged_in",  res.data.id);

                               
                               $location.path('/'+res.redirect);

                         }else{
                           alert("Ha ocurrido un error, vuelve a intentarlo mas tarde");
                           
                         }
               });
            

              }, function(error) {
                  alert("Ha ocurrido un error inesperado, vuelve a intentarlo mas tarde");
              });

          }, function(error) {
             alert("Ha ocurrido un error inesperado, vuelve a intentarlo mas tarde");
        });

     },false);

  }/*end login facebook*/


  });

    app.run(function($ionicPlatform) {
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
      });
    });

}());

