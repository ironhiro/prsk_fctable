// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
    authDomain: "prsk-fctable.firebaseapp.com",
    databaseURL: "https://prsk-fctable-default-rtdb.firebaseio.com",
    projectId: "prsk-fctable",
    storageBucket: "prsk-fctable.appspot.com",
    messagingSenderId: "140146201777",
    appId: "1:140146201777:web:abb25839a5311ce056be90",
    measurementId: "G-X3M6JJ94V0"
  };

firebase.initializeApp(firebaseConfig);

const firestore = firebase.database();

export {firestore};


