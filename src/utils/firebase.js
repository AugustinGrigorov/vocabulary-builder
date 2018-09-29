import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyD5KltBeB5gNXcPsigqVHWeJj4yewpiVWY',
  authDomain: 'vocabulary-builder-7bcdb.firebaseapp.com',
  databaseURL: 'https://vocabulary-builder-7bcdb.firebaseio.com',
  storageBucket: 'vocabulary-builder-7bcdb.appspot.com',
  projectId: 'vocabulary-builder-7bcdb',
  messagingSenderId: '645256156137',
};

firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;
