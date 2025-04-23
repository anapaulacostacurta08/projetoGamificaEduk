const firebaseConfig = {
    apiKey: `${APIKEY}`,
    authDomain: `{$AUTHDOMAIN}`,
    projectId: `${PROJECTID}`,
    storageBucket: `${STORAGEBUCKET}`,
    messagingSenderId: `${MESSAGINGSENDERID}`,
    appId: `${APPID}`,
    measurementId: `${MEASUREMENTID}`
  };

firebase.initializeApp(firebaseConfig);  
  
