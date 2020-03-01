import {
  initializeApp,
  auth,
  performance,
  analytics,
} from 'firebase/app';
import 'firebase/auth';
import 'firebase/performance';
import 'firebase/analytics';

const config = {
  apiKey: 'AIzaSyD5KltBeB5gNXcPsigqVHWeJj4yewpiVWY',
  authDomain: 'vocabulary-builder-7bcdb.firebaseapp.com',
  databaseURL: 'https://vocabulary-builder-7bcdb.firebaseio.com',
  projectId: 'vocabulary-builder-7bcdb',
  storageBucket: 'vocabulary-builder-7bcdb.appspot.com',
  messagingSenderId: '645256156137',
  appId: '1:645256156137:web:933bbe4b16a2037ffcf178',
  measurementId: 'G-9FXMKG0DTC',
};

initializeApp(config);
performance();
analytics();

const provider = new auth.GoogleAuthProvider();

const initiateSignIn = () => auth().signInWithPopup(provider);
const initiateSignOut = () => auth().signOut();
const authChangeListener = (cb) => auth().onAuthStateChanged(cb);

export {
  initiateSignIn,
  initiateSignOut,
  authChangeListener,
};
