/*
 function to initialize android pushwoosh
*/
function initPushwooshANDROID(project_id,pushwoosh_id)
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

    //initialize Pushwoosh with projectid: "GOOGLE_PROJECT_ID", pw_appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
    pushNotification.onDeviceReady({ projectid: project_id, pw_appid : ,pushwoosh_id });

    //register for pushes
    pushNotification.registerDevice(
        function(status) {
            var pushToken = status;
            console.warn('push token: ' + pushToken);
            alert(pushToken);
        },
        function(status) {
            console.warn(JSON.stringify(['failed to register ', status]));
            alert(JSON.stringify(['failed to register ', status]));
        }
    );
}

/*
 function to initialize ios pushwoosh
*/
function initPushwooshIOS(pushwoosh_id) {
    var pushNotification = cordova.require("pushwoosh-cordova-plugin.PushNotification");

    //set push notification callback before we initialize the plugin
    document.addEventListener('push-notification', function(event) {
                                //get the notification payload
                                var notification = event.notification;

                                //display alert to the user for example
                                alert(notification.aps.alert);

                                //clear the app badge
                                pushNotification.setApplicationIconBadgeNumber(0);
                            });

    //initialize the plugin
    pushNotification.onDeviceReady({pw_appid:pushwoosh_id});

    //register for pushes
    pushNotification.registerDevice(
        function(status) {
            var deviceToken = status['deviceToken'];
            console.warn('registerDevice: ' + deviceToken);
        },
        function(status) {
            console.warn('failed to register : ' + JSON.stringify(status));
            alert(JSON.stringify(['failed to register ', status]));
        }
    );

    //reset badges on app start
    pushNotification.setApplicationIconBadgeNumber(0);
}
