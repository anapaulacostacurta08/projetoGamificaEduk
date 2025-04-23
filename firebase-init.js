const firebaseConfig = {
    apiKey: `${process.env.APIKEY}`,
    authDomain: `${process.env.$AUTHDOMAIN}`,
    projectId: `${process.env.PROJECTID}`,
    storageBucket: `${process.env.STORAGEBUCKET}`,
    messagingSenderId: `${process.env.MESSAGINGSENDERID}`,
    appId: `${process.env.PPID}`,
    measurementId: `${process.env.MEASUREMENTID}`
  };

firebase.initializeApp(firebaseConfig);  
  
