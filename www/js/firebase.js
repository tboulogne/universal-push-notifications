var setupFirebasePush = function() {

  var config = {
    messagingSenderId: '604077393164'
  };

  firebase.initializeApp(config);

  // Retrieve Firebase Messaging object.
  const messaging = firebase.messaging();

  // Callback fired if Instance ID token is updated.
  messaging.onTokenRefresh(getToken);

  // Handle incoming messages. Called when:
  // - a message is received while the app has focus
  // - the user clicks on an app notification created by a sevice worker
  //   `messaging.setBackgroundMessageHandler` handler.
  messaging.onMessage(function(payload) {
    pushManager.handleNotification(payload);
  });

  function getToken() {
    messaging.getToken()
      .then(function(token) {
        if (token) {
          pushManager.setRegistrationId(token);
        } else {
          pushManager.error('No Instance ID token available. Request permission to generate one.');
        }
        pushManager.registerSuccessfulSetup('firebase', requestPermission);
      })
      .catch(function(err) {
        pushManager.error(err, 'Unable to retrieve refreshed token ');
      });
  }

  function requestPermission() {
    messaging.requestPermission()
      .then(function() {
        getToken();
      })
      .catch(function(err) {
        pushManager.error(err, 'Unable to get permission to notify.');
      });
  }

  getToken();

};

pushManager.requestPermissionCallback = setupFirebasePush;