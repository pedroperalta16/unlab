function initPushwoosh() {
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
}
