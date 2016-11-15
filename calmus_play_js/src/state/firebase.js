/**
 * Created by jonh on 29.9.2016.
 */
import {State} from 'jumpsuit'
import firebase from 'firebase'
import {NotificationManager} from 'react-notifications'
import inputcell from './inputcell'

var firebaseIsInitialized = false;
var fbapp;
var fbconfig =  {
  apiKey: "AIzaSyAfbMcx8RBUqigJxVF3w493D4uz4__UvsM",
  authDomain: "calmus-play-web.firebaseapp.com",
  databaseURL: "https://calmus-play-web.firebaseio.com",
  storageBucket: "calmus-play-web.appspot.com",
  messagingSenderId: "283309000835"
};

const firestate = State('firestate', {
  initial: {
    initialized: false,
    showLogin: true,
    user: '',
    userUid: '',
    userName: '',
    settingsName: '',
    savedSettingsList: [],
    savedInputcellsList: [],
    savedCompositionsList: []
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

  setKeyValue: (state, payload) => ({
    [payload.key]: payload.value
  }),


});

export default firestate;

export function initializeFirebase() {
  if(firebaseIsInitialized) {
    return;
  }
  fbapp = firebase.initializeApp(fbconfig);
  firebaseIsInitialized = true;
  firestate.setInitialized(true);

  fbapp.auth().onAuthStateChanged(function(user) {
    if (user) {
      if (user != null) {
        //console.log(user);
        firestate.setUser(user);
        firestate.setUserName(user.email);
        firestate.setUserUid(user.uid);

        fbapp.database().ref('settings/' + user.uid).on('value', function(snapshot){
          let settingsList = [];
          snapshot.forEach(function(childSnapShot) {
            let key = childSnapShot.key;
            settingsList.push({...childSnapShot.val(), uid: key})
          });
          firestate.setSavedSettingsList(settingsList);
        }, function (error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          NotificationManager.error(errorMessage, "Settings", 5000);
        });

        fbapp.database().ref('inputcells/' + user.uid).on('value', function(snapshot){
          let inputcellslist = [];
          snapshot.forEach(function(childSnapShot) {
            let key = childSnapShot.key;
            inputcellslist.push({...childSnapShot.val(), uid: key})
          });
          firestate.setKeyValue({key: 'savedInputcellsList', value: inputcellslist});
        }, function (error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          NotificationManager.error(errorMessage, "Settings", 5000);
        });

        fbapp.database().ref('inputcell/' + user.uid).on('value', function(snapshot){
          let compositionsList = [];
          snapshot.forEach(function(childSnapShot) {
            let key = childSnapShot.key;
            compositionsList.push({...childSnapShot.val(), uid: key})
          });
          firestate.setKeyValue({key: 'savedCompositionsList', value: compositionsList});
        }, function (error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          NotificationManager.error(errorMessage, "Settings", 5000);
        });

      }
    } else {
      firestate.setUser('');
      firestate.setUserName('');
      firestate.setUserUid('');
    }
  });
}

export function loginUser(email, password) {
  fbapp.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    NotificationManager.error(errorMessage, "Login User", 5000);
  });
}

export function createUser(email, password) {
  fbapp.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    NotificationManager.error(errorMessage, "Create User", 5000);
  });
}

export function logOutUser() {
  fbapp.auth().signOut().then(function() {
    // Sign-out successful.
    firestate.setUser('');
  }, function(error) {
    // An error happened.
  });
}

export function saveSettings(settingsObject, path='settings') {
  let {userUid} = firestate.getState();
  let refstring = [path, userUid].join('/');
  fbapp.database().ref(refstring).push(settingsObject);
}

export function deleteSettings(settings_id, path) {
  let {userUid} = firestate.getState();
  let refstring = [path, userUid, settings_id].join('/');
  if (userUid) {
    fbapp.database().ref(refstring).remove(function (error)  {
      if(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        NotificationManager.error(errorMessage, "Delete Settings", 5000);
      }
    })
  }

}

export function saveInputCell() {
  let {eventList, name} = inputcell.getState();
  let {userUid} = firestate.getState();
  if (userUid) {
    fbapp.database().ref('inputcells/' + userUid).push({name: name, eventList: eventList, created: Date.now()}).catch(
      function(error) {
        if(error) {
          NotificationManager.error(error.message, "Save Input Cell", 5000);
        }
        else {
          inputcell.doneSaving();
        }
      }
    ).then(function() {
      inputcell.doneSaving();
    })
  }
}