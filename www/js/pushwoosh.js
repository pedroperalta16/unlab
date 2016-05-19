angular.module('pushwoosh'[]).factory('PushWoosh', function($q, $rootScope, $window) {

  var service = {};

  $window.addEventListener('push-notification', function(event) {

    var notification = {};

    if(ionic.Platform.isIOS()) {
      notification.title = event.notification.aps.alert;
      notification.meta = event.notification.u;
      pushNotification.setApplicationIconBadgeNumber(0);
    }

    if(ionic.Platform.isAndroid()) {
      notification.title = event.notification.title;
      notification.meta = event.notification.userdata;
    }

    // No testeado
    if(ionic.Platform.isWindowsPhone()) {
      notification.title = event.notification.content;
      notification.meta = event.notification.userdata;
    }

    $rootScope.$broadcast('event:push-notification', notification);

  });

  // Metodo para inicializar PushWoosh
  service.init = function(PUSHWOOSH_APP_ID, GOOGLE_PROJECT_NUMBER) {
    var deferred = $q.defer();

    if(!PUSHWOOSH_APP_ID) {
      deferred.reject('No existe PushWoosh App Id');
    }
    else {
      // Inicializamos el plugin
      var pushNotification = cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");

      // Actuamos según la plataforma
      // Para IOS
      if(ionic.Platform.isIOS()) {
        pushNotification.onDeviceReady({pw_appid: PUSHWOOSH_APP_ID});
        // seteamos el badge de la app a 0
        pushNotification.setApplicationIconBadgeNumber(0);
      }
      // Para Android
      if(ionic.Platform.isAndroid()) {
        pushNotification.onDeviceReady({projectid: GOOGLE_PROJECT_NUMBER, pw_appid: PUSHWOOSH_APP_ID});
      }

      // Para Windows Phone (no testeado)
      if(ionic.Platform.isWindowsPhone()) {
        pushNotification.onDeviceReady({appid: PUSHWOOSH_APP_ID, serviceName: ''});
      }

      deferred.resolve();
    }

    return deferred.promise;
  }

  // Metodo para registrar el dispositivo
  service.registrarDispositivo = function() {
    var deferred = $q.defer();

    // Inicializamos el plugin
    var pushNotification = cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");

    // Registramos el dispositivo
    pushNotification.registerDevice(
      //success
      function(status) {
        var deviceToken;

        if(ionic.Platform.isIOS()) {
          deviceToken = status['deviceToken'];
        }

        if(ionic.Platform.isAndroid()) {
          deviceToken = status;
        }

        // No testeado
        if(ionic.Platform.isWindowsPhone()) {
          deviceToken = status;
        }

        deferred.resolve(deviceToken);
      },
      // error
      function(status) {
        deferred.reject(status);
      }
    );

    return deferred.promise;
  }

  // Devolvemos las funciones del factory
  return service;

})
