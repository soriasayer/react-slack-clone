import firebase from 'firebase/app'
import "firebase/auth"
import "firebase/database"
import "firebase/storage"

var firebaseConfig = {
    apiKey: "AIzaSyAqNcaLOZKdLGHobrKjrC1V6pE2H6Gn2k8",
    authDomain: "react-slack-clone-6ff97.firebaseapp.com",
    databaseURL: "https://react-slack-clone-6ff97.firebaseio.com",
    projectId: "react-slack-clone-6ff97",
    storageBucket: "react-slack-clone-6ff97.appspot.com",
    messagingSenderId: "283012233204",
    appId: "1:283012233204:web:bc5ab2330af45e495aaba1",
    measurementId: "G-R09HPMPDC3"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
firebase.analytics();
    
export default firebase
  
