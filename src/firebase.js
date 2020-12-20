import firebase from "firebase";
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBmJ0ccIwltnlHZigM8tPLnm2rL5dxAPdI",
  authDomain: "instagram-reactjs-firebase.firebaseapp.com",
  projectId: "instagram-reactjs-firebase",
  storageBucket: "instagram-reactjs-firebase.appspot.com",
  messagingSenderId: "897313540972",
  appId: "1:897313540972:web:8cc37bc1d7ff9eb2620149",
  measurementId: "G-6M138FFVBP",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
