import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email) =>
  db.ref(`users/${id}`).set({
    username,
    email,
  });

export const onceGetUsers = () =>
  db.ref('users').once('value');


export const doCreateReview = (productid, message, email, name, stars) =>
  db.ref(`reviews/${productid}`).push({
  	message,
    name,
    email,
    stars,
  });


  export const getReviews = (productid, cb = () => { }) =>
    db.ref(`reviews/${productid}`).on('value',function(snapshot) { cb(snapshot) } );