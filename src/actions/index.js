// TODO: Handle errors properly
// TODO: Revisit variable naming

import firebase, {
  auth,
  provider,
} from '../utils/firebase';

const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true,
});

function requestDictionary() {
  return {
    type: 'FETCH_DICTIONARY_REQUEST',
  };
}

function receiveDictionary(dictionary) {
  return {
    type: 'RECEIVE_DICTIONARY',
    dictionary,
  };
}

function dictionaryRequestFailed() {
  return {
    type: 'DICTIONARY_REQUEST_FAILED',
  };
}

export function fetchDictionaryForUser({ details }) {
  return (dispatch) => {
    dispatch(requestDictionary());
    if (details && details.uid) {
      db.collection('users').doc(details.uid).collection('words').get()
        .then((querySnapshot) => {
          dispatch(receiveDictionary(querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }))));
        })
        .catch(() => dispatch(dictionaryRequestFailed()));
    } else {
      dispatch(receiveDictionary([]));
    }
  };
}

export function addWordAction({ word, user }) {
  return (dispatch) => {
    db.collection('users').doc(user.details.uid).collection('words').add(word)
      .then(() => {
        dispatch(fetchDictionaryForUser(user)); // Cancel old request if new one becomes in flight
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
  };
}

function requestUserDetails() {
  return {
    type: 'FETCH_USER_DETAILS_REQUEST',
  };
}

function receiveUserDetails(userDetails) {
  return {
    type: 'RECEIVE_USER_DETAILS',
    userDetails,
  };
}

function userDetailsRequestFailed() {
  return {
    type: 'USER_DETAILS_REQUEST_FAILED',
  };
}

export function signIn() {
  return (dispatch) => {
    dispatch(requestUserDetails());
    auth.signInWithPopup(provider).catch(() => {
      dispatch(userDetailsRequestFailed());
    });
  };
}

export function signOut() {
  return (dispatch) => {
    dispatch(requestUserDetails());
    auth.signOut().catch(() => {
      dispatch(userDetailsRequestFailed());
    });
  };
}

export function listenForAuthChanges() {
  return (dispatch) => {
    auth.onAuthStateChanged((user) => {
      dispatch(receiveUserDetails(user));
    }, () => userDetailsRequestFailed());
  };
}

function setQuizQueue(queue) {
  return {
    type: 'SET_QUIZ_QUEUE',
    queue,
  };
}

function setCurrentQuizEntry(entry) {
  return {
    type: 'SET_CURRENT_QUIZ_ENTRY',
    entry,
  };
}

export function quizSetupFailed() {
  return {
    type: 'QUIZ_SETUP_FAILED',
  };
}

export function nextWordFrom(currentWords) {
  return (dispatch) => {
    const wordPosition = Math.floor(currentWords.length * Math.random());
    const selectedWord = currentWords[wordPosition];
    const remainingWords = [
      ...currentWords.slice(0, wordPosition),
      ...currentWords.slice(wordPosition + 1),
    ];
    dispatch(setQuizQueue(remainingWords));
    dispatch(setCurrentQuizEntry(selectedWord));
  };
}
