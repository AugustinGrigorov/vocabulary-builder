// TODO: Handle errors properly

import firebase, {
  auth,
  provider,
} from '../utils/firebase';

const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true,
});

function receiveWords(words) {
  return {
    type: 'RECEIVE_WORDS',
    words,
  };
}

export function getWordsForUser(user) {
  return (dispatch) => {
    if (user && user.uid) {
      db.collection('users').doc(user.uid).collection('words').get()
        .then((querySnapshot) => {
          dispatch(receiveWords(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))));
        });
    } else {
      dispatch(receiveWords([]));
    }
  };
}

export function addWordAction({ word, userId }) {
  return (dispatch) => {
    db.collection('users').doc(userId).collection('words').add({
      ...word,
    })
      .then(() => {
        dispatch(getWordsForUser(userId));
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
  };
}

function receiveUserDetails(user) {
  return {
    type: 'RECEIVE_LOGIN_DETAILS',
    user,
  };
}

export function signIn() {
  return () => {
    auth.signInWithPopup(provider).catch((error) => {
      console.log('Error signing in: ', error);
    });
  };
}

export function signOut() {
  return () => {
    auth.signOut().catch((error) => {
      console.log('Error signing out: ', error);
    });
  };
}

export function listenForAuthChanges() {
  return (dispatch) => {
    auth.onAuthStateChanged((user) => {
      dispatch(receiveUserDetails(user));
      dispatch(getWordsForUser(user));
    });
  };
}
