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
    userUid: '',
    userName: '',
    settingsName: '',
    savedSettingsList: []
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

  setSettingsName: (state, payload) => ({
    settingsName: payload
  }),

  setUserUid: (state, payload) => ({
    userUid: payload
  }),

  setSavedSettingsList: (state, payload) => ({
    savedSettingsList: payload
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
        console.log(user);
        firestate.setUser(user);
        firestate.setUserName(user.email);
        firestate.setUserUid(user.uid);

        app.database().ref('settings/' + user.uid).on('value', function(snapshot){
          let settingsList = [];
          snapshot.forEach(function(childSnapShot) {
            let key = childSnapShot.key;
            settingsList.push({...childSnapShot.val(), uid: key})
          });
          firestate.setSavedSettingsList(settingsList);


        }, function (error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          NotificationManager.error(errorMessage, "Get All", 5000);
        })


      }
    } else {
      firestate.setUser('');
      firestate.setUserName('');
      firestate.setUserUid('');
    }
  });
}

export function loginUser(email, password) {
  app.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    NotificationManager.error(errorMessage, "Login User", 5000);
  });
}

export function createUser(email, password) {
  app.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    NotificationManager.error(errorMessage, "Create User", 5000);
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

export function saveSettings(settingsObject, userUid) {
  let {transpose, speed, type, color, interval, polyphony, scale} = settingsObject;
  app.database().ref('settings/' + userUid).push(settingsObject)
}

export function deleteSettings(settings_id, userUid) {
  let refstring = ['settings', userUid, settings_id].join('/');
  app.database().ref(refstring).remove(function (error)  {
    if(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      NotificationManager.error(errorMessage, "Delete Settings", 5000);
    }
  })
}