import firebase from "firebase";

import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBOvNiT1WLAZQuQfw-voq9BNoUwz-uM6SQ",
  authDomain: "animated-login-88e30.firebaseapp.com",
  projectId: "animated-login-88e30",
  storageBucket: "animated-login-88e30.appspot.com",
  messagingSenderId: "47948515663",
  appId: "1:47948515663:web:fb44db71738bdf891d9d3a",
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { auth, db };
