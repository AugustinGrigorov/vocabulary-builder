import nanoid from 'nanoid';
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

function queueEntryForAddition(entry) {
  return {
    type: 'QUEUE_ENTRY_FOR_ADDITION',
    entry,
  };
}

function queueEntryForDeletion(entry) {
  return {
    type: 'QUEUE_ENTRY_FOR_DELETION',
    entry,
  };
}

function dequeueCompleted(dictionary) {
  return {
    type: 'DEQUEUE_COMPLETED',
    dictionary,
  };
}

export function fetchDictionaryForUser({ details }) {
  return (dispatch) => {
    if (details && details.uid) {
      db.collection('users').doc(details.uid).get()
        .then((doc) => {
          const dictionary = doc.data().words;
          dispatch(receiveDictionary(dictionary));
          dispatch(dequeueCompleted(dictionary));
        });
    }
  };
}

export function addEntry({ entryData, user }) {
  return (dispatch) => {
    const entry = {
      id: nanoid(),
      ...entryData,
    };
    dispatch(queueEntryForAddition(entry));
    db.collection('users').doc(user.details.uid).update({
      words: firebase.firestore.FieldValue.arrayUnion(entry),
    }).then(() => dispatch(fetchDictionaryForUser(user)));
  };
}

export function removeWord({ entry, user }) {
  return (dispatch) => {
    dispatch(queueEntryForDeletion(entry));
    db.collection('users').doc(user.details.uid).update({
      words: firebase.firestore.FieldValue.arrayRemove(entry),
    }).then(() => dispatch(fetchDictionaryForUser(user)));
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
