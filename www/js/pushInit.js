/*function initPushwoosh() {
  var pushNotification = cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");
  if (device.platform == "Android") {
    registerPushwooshAndroid();
  }

  if (device.platform == "iPhone" || device.platform == "iOS") {
    registerPushwooshIOS();
  }

  if (device.platform == "Win32NT") {
    registerPushwooshWP();
  }

  pushNotification.getLaunchNotification(
    function(notification) {
      if (notification != null) {
        alert(JSON.stringify(notification));
      } else {
        alert("No launch notification");
      }
    }
  );
}*/
function initPushwoosh()
{
    var pushNotification = cordova.require("pushwoosh-cordova-plugin.PushNotification");

    //set push notifications handler
    document.addEventListener('push-notification', function(event) {
        var title = event.notification.title;
        var userData = event.notification.userdata;

        if(typeof(userData) != "undefined") {
            console.warn('user data: ' + JSON.stringify(userData));
        }
        alert(title);
    });

    //initialize Pushwoosh with projectid: "GOOGLE_PROJECT_NUMBER", pw_appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
    pushNotification.onDeviceReady({ projectid: "300274685250", pw_appid : "10131-5FBF2" });

    //register for pushes
    pushNotification.registerDevice(
        function(status) {
            var pushToken = (status['deviceToken']) ? status['deviceToken']: status;
            localStorage.setItem("device", pushToken);
            console.warn('push token: ' + pushToken);
            //alert('push token: ' + pushToken)
        },
        function(status) {
          alert(JSON.stringify(['failed to register ', status]))
            console.warn(JSON.stringify(['failed to register ', status]));
        }
    );
}
