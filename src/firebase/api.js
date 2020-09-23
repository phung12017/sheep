import * as firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyB30IX3gdvfjTl2rICqVxoQblW_kFRWnVo",
  authDomain: "socail-86f56.firebaseapp.com",
  databaseURL: "https://socail-86f56.firebaseio.com",
  projectId: "socail-86f56",
  storageBucket: "socail-86f56.appspot.com",
  messagingSenderId: "689244354932",
  appId: "1:689244354932:web:9971e4efa9bbd56d421421",
  measurementId: "G-2BSSFXZG75"
};

try {
  firebase.initializeApp(firebaseConfig);
} catch (error) {}

export default firebase;

