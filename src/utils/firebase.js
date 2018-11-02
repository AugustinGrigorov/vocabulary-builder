import { initializeApp, auth } from 'firebase/app';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyD5KltBeB5gNXcPsigqVHWeJj4yewpiVWY',
  authDomain: 'vocabulary-builder-7bcdb.firebaseapp.com',
  databaseURL: 'https://vocabulary-builder-7bcdb.firebaseio.com',
  storageBucket: 'vocabulary-builder-7bcdb.appspot.com',
  projectId: 'vocabulary-builder-7bcdb',
  messagingSenderId: '645256156137',
};

initializeApp(config);

const provider = new auth.GoogleAuthProvider();

const initiateSignIn = () => auth().signInWithPopup(provider);
const initiateSignOut = () => auth().signOut();
const authChangeListener = cb => auth().onAuthStateChanged(cb);

export {
  initiateSignIn,
  initiateSignOut,
  authChangeListener,
};
