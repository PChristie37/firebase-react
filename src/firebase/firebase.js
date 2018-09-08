import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: "AIzaSyD0miq05sm6UJaKwyFpTgmuwy8WTcpCX84",
  authDomain: "dev-product-review.firebaseapp.com",
  databaseURL: "https://dev-product-review.firebaseio.com",
  projectId: "dev-product-review",
  storageBucket: "dev-product-review.appspot.com",
  messagingSenderId: "1094571793551",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();

export {
  db,
  auth,
};