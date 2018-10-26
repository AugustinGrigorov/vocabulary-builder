import firebase, {
  auth,
  provider,
} from '../utils/firebase';

const db = firebase.firestore();

db.settings({
  timestampsInSnapshots: true,
});

function receiveDictionary(dictionary) {
  return {
    type: 'RECEIVE_DICTIONARY',
    dictionary,
  };
}

function dictionaryRequestFailed(error) {
  return {
    type: 'DICTIONARY_REQUEST_FAILED',
    error,
  };
}

export function fetchDictionaryForUser({ details }) {
  return (dispatch) => {
    if (details && details.uid) {
      db.collection('users').doc(details.uid).collection('words')
        .get()
        .then((querySnapshot) => {
          dispatch(receiveDictionary(querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }))));
        })
        .catch(error => dispatch(dictionaryRequestFailed(error)));
    } else {
      dispatch(receiveDictionary([]));
    }
  };
}

export function addWord({ word, user }) {
  return (dispatch) => {
    db.collection('users').doc(user.details.uid).collection('words')
      .add(word)
      .then(() => {
        dispatch(fetchDictionaryForUser(user)); // Cancel old request if new one becomes in flight
      })
      .catch(error => dispatch(dictionaryRequestFailed(error)));
  };
}

export function removeWord({ entry, user }) {
  return (dispatch) => {
    db.collection('users').doc(user.details.uid).collection('words').doc(entry.id)
      .delete()
      .then(() => dispatch(fetchDictionaryForUser(user)))
      .catch(error => dispatch(dictionaryRequestFailed(error)));
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

export function nextWordFrom(currentEntries) {
  return (dispatch) => {
    const wordPosition = Math.floor(currentEntries.length * Math.random());
    const selectedEntry = currentEntries[wordPosition];
    const remainingEntries = [
      ...currentEntries.slice(0, wordPosition),
      ...currentEntries.slice(wordPosition + 1),
    ];
    dispatch(setQuizQueue(remainingEntries));
    dispatch(setCurrentQuizEntry(selectedEntry));
  };
}

export function startQuiz() {
  return {
    type: 'START_QUIZ',
  };
}

export function updateScore({ attempted, correct }) {
  return {
    type: 'UPDATE_SCORE',
    attempted,
    correct,
  };
}
