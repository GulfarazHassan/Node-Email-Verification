const firebase = require("firebase/app");
require("firebase/firestore");

const app = firebase.initializeApp({
  apiKey: "AIzaSyB1A6etu_AIdo1VTG_Xjlqm--hAjz6VDFg",
  authDomain: "promptedly.firebaseapp.com",
  projectId: "promptedly",
  storageBucket: "promptedly.appspot.com",
  messagingSenderId: "1053134511095",
  appId: "1:1053134511095:web:314fac01d5121811062cf2",
  measurementId: "G-HFKYVXMX9J",
});

module.exports = app;
