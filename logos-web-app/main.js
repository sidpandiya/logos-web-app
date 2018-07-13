var firebase = require("firebase");
require("firebase/app");

// Add additional services that you want to use
require("firebase/auth");
require("firebase/database");
require("firebase/firestore");
require("firebase/messaging");
require("firebase/functions");
require("firebase/storage");

// Comment out (or don't require) services that you don't want to use
// require("firebase/storage");

var config = {
    apiKey: "AIzaSyD57NYPtxbNb6qnSOo7lg0mtD-id7Da0hw",
    authDomain: "logos-app-915d7.firebaseapp.com",
    databaseURL: "https://logos-app-915d7.firebaseio.com",
    projectId: "logos-app-915d7",
    storageBucket: "logos-app-915d7.appspot.com",
    messagingSenderId: "112244798411"
};
firebase.initializeApp(config);