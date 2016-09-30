/**
 * Created by jonh on 29.9.2016.
 */
import {State} from 'jumpsuit'
import firebase from 'firebase'
import {NotificationManager} from 'react-notifications'

var firebaseIsInitialized = false;
var app;
var fbconfig =  {
  apiKey: "AIzaSyAfbMcx8RBUqigJxVF3w493D4uz4__UvsM",
  authDomain: "calmus-play-web.firebaseapp.com",
  databaseURL: "https://calmus-play-web.firebaseio.com",
  storageBucket: "calmus-play-web.appspot.com",
  messagingSenderId: "283309000835"
};

const firestate = State('firebase', {
  initial: {
    initialized: false,
    showLogin: true,
    user: '',
    userName: ''
  },

  setInitialized: (state, payload) => ({
    initialized: payload
  }),

  setShowLogin: (state, payload) => ({
    showLogin: payload
  }),

  setUser: (state, payload) => ({
    user: payload,
  }),

  setUserName: (state, payload) => ({
    userName: payload,
  }),


});

export default firestate;

export function initializeFirebase() {
  if(firebaseIsInitialized) {
    return;
  }
  app = firebase.initializeApp(fbconfig);
  firebaseIsInitialized = true;
  firestate.setInitialized(true);

  app.auth().onAuthStateChanged(function(user) {
    if (user) {
      if (user != null) {
        firestate.setUser(user);
        firestate.setUserName(user.email);
      }
    } else {
      firestate.setUser('');
      firestate.setUserName('')
    }
  });
}

export function loginUser(email, password) {
  app.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    NotificationManager.error(errorMessage, errorCode, 3000);
  });
}

export function createUser(email, password) {
  app.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    NotificationManager.error(errorMessage, errorCode, 3000);
  });
}

export function logOutUser() {
  app.auth().signOut().then(function() {
    // Sign-out successful.
    firestate.setUser('');
  }, function(error) {
    // An error happened.
  });
}