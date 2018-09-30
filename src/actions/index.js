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

export function getWordsForUser(userId) {
  return (dispatch) => {
    db.collection('users').doc(userId).collection('words').get()
      .then((querySnapshot) => {
        dispatch(receiveWords(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))));
      });
  };
}

export function addWordAction({ word, userId }) {
  return (dispatch) => {
    db.collection('users').doc(userId).collection('words').add({
      ...word,
    })
      .then(() => {
        // TODO: Perhaps add the word to state to avoid ajax call
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
  return (dispatch) => {
    auth
      .signInWithPopup(provider)
      .then(({ user }) => {
        dispatch(receiveUserDetails(user));
        dispatch(getWordsForUser(user.uid));
      })
      .catch((error) => {
        console.log('Error signing in: ', error);
      });
  };
}

export function signOut() {
  return (dispatch) => {
    auth
      .signOut()
      .then(() => {
        dispatch(receiveUserDetails(null));
        dispatch(receiveWords([]));
      })
      .catch((error) => {
        console.log('Error signing out: ', error);
      });
  };
}

export function retrieveUser() {
  return (dispatch) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(receiveUserDetails(user));
        dispatch(getWordsForUser(user.uid));
      }
    });
  };
}
