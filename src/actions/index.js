// TODO: Move action strings to constants

import nanoid from 'nanoid';
import { firestore } from 'firebase/app';
import 'firebase/firestore';

import {
  initiateSignIn,
  initiateSignOut,
  authChangeListener,
} from '../utils/firebase';

const db = firestore();

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

function removeEntry(entry) {
  return {
    type: 'REMOVE_ENTRY',
    entry,
  };
}

function dequeueCompleted(dictionary) {
  return {
    type: 'DEQUEUE_COMPLETED',
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
    type: 'START_EDIT',
    entryId,
  };
}

export function finishEdit() {
  return {
    type: 'FINISH_EDIT',
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

function setPracticeQueue(queue) {
  return {
    type: 'SET_QUIZ_QUEUE',
    queue,
  };
}

function setCurrentPracticeEntry(entry) {
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
    dispatch(setPracticeQueue(remainingEntries));
    dispatch(setCurrentPracticeEntry(selectedEntry));
  };
}

export function startPractice() {
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

export function recordAttempt({ userId, entryId, correct }) {
  return () => {
    const entryRef = db.collection('users').doc(userId).collection('words').doc(entryId);
    entryRef.update({
      attempts: firestore.FieldValue.arrayUnion({
        correct,
        timestamp: new Date(),
      }),
    });
  };
}
