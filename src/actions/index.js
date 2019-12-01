// TODO: Move action strings to constants

import nanoid from 'nanoid';
import { firestore } from 'firebase/app';
import 'firebase/firestore';

import {
  initiateSignIn,
  initiateSignOut,
  authChangeListener,
} from '../utils/firebase';
import {
  actions,
} from '../constants';

const db = firestore();

function receiveDictionary(dictionary) {
  return {
    type: actions.RECEIVE_DICTIONARY,
    dictionary,
  };
}

function queueEntryForAddition(entry) {
  return {
    type: actions.QUEUE_ENTRY_FOR_ADDITION,
    entry,
  };
}

function queueEntryForDeletion(entry) {
  return {
    type: actions.QUEUE_ENTRY_FOR_DELETION,
    entry,
  };
}

function removeEntry(entry) {
  return {
    type: actions.REMOVE_ENTRY,
    entry,
  };
}

function dequeueCompleted(dictionary) {
  return {
    type: actions.DEQUEUE_COMPLETED,
    dictionary,
  };
}

export function fetchDictionaryForUser(userId) {
  return (dispatch) => {
    const wordsCollectionSnapshot = db.collection('users').doc(userId).collection('words').get();
    wordsCollectionSnapshot.then((collection) => {
      const dictionary = collection.docs.map((entry) => (
        {
          id: entry.id,
          ...entry.data(),
        }
      ));
      dispatch(receiveDictionary(dictionary));
      dispatch(dequeueCompleted(dictionary));
    });
  };
}

export function addEntry({ entryData, userId }) {
  return (dispatch) => {
    const entryId = nanoid();
    dispatch(queueEntryForAddition({ id: entryId, ...entryData }));
    const entryRef = db.collection('users').doc(userId).collection('words').doc(entryId);
    entryRef.set(entryData).then(() => dispatch(fetchDictionaryForUser(userId)));
  };
}

export function startEdit(entryId) {
  return {
    type: actions.START_EDIT,
    entryId,
  };
}

export function finishEdit() {
  return {
    type: actions.FINISH_EDIT,
  };
}


export function editEntry({
  oldEntry,
  newEntry,
  userId,
}) {
  return async (dispatch) => {
    dispatch(finishEdit());
    dispatch(removeEntry(oldEntry));
    dispatch(queueEntryForAddition(newEntry));
    const updateData = { ...newEntry };
    delete updateData.id;
    const entryRef = db.collection('users').doc(userId).collection('words').doc(oldEntry.id);
    entryRef.update(updateData).then(() => dispatch(fetchDictionaryForUser(userId)));
  };
}

export function removeWord({ entry, userId }) {
  return (dispatch) => {
    dispatch(queueEntryForDeletion(entry));
    const entryRef = db.collection('users').doc(userId).collection('words').doc(entry.id);
    entryRef.delete().then(() => dispatch(fetchDictionaryForUser(userId)));
  };
}

function requestUserDetails() {
  return {
    type: actions.FETCH_USER_DETAILS_REQUEST,
  };
}

function receiveUserDetails(userDetails) {
  return {
    type: actions.RECEIVE_USER_DETAILS,
    userDetails,
  };
}

function userDetailsRequestFailed() {
  return {
    type: actions.USER_DETAILS_REQUEST_FAILED,
  };
}

export function signIn() {
  return (dispatch) => {
    dispatch(requestUserDetails());
    initiateSignIn().catch(() => {
      dispatch(userDetailsRequestFailed());
    });
  };
}

export function signOut() {
  return (dispatch) => {
    dispatch(requestUserDetails());
    initiateSignOut().catch(() => {
      dispatch(userDetailsRequestFailed());
    });
  };
}

export function listenForAuthChanges() {
  return (dispatch) => {
    authChangeListener((user) => {
      dispatch(receiveUserDetails(user));
      if (user) dispatch(fetchDictionaryForUser(user.uid));
    }, () => userDetailsRequestFailed());
  };
}

export function nextWord() {
  return {
    type: actions.NEXT_WORD,
  };
}

export function startPractice(wordQueue) {
  return {
    type: actions.START_QUIZ,
    wordQueue,
  };
}

export function updateScore({ attempted, correct }) {
  return {
    type: actions.UPDATE_SCORE,
    attempted,
    correct,
  };
}

function updateAttempts(entryId, correct) {
  return {
    type: actions.UPDATE_ATTEMPTS,
    entryId,
    correct,
  };
}

export function recordAttempt({ userId, entryId, correct }) {
  return (dispatch) => {
    dispatch(updateAttempts(entryId, correct));
    const entryRef = db.collection('users').doc(userId).collection('words').doc(entryId);
    entryRef.update({
      attempts: firestore.FieldValue.arrayUnion({
        correct,
        timestamp: new Date(),
      }),
    });
  };
}
