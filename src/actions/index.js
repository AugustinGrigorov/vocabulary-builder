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

if (window.Cypress) {
  db.settings({
    host: 'localhost:8080',
    ssl: false,
    experimentalForceLongPolling: true,
  });
}

function startFetchingDictionary() {
  return {
    type: actions.START_FETCHING_DICTIONARY,
  };
}

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

function removeEntryFromDictionary(entry) {
  return {
    type: actions.REMOVE_ENTRY,
    entry,
  };
}

function addEntryToDictionary(entry) {
  return {
    type: actions.ADD_ENTRY,
    entry,
  };
}

function dequeueCompleted(entry) {
  return {
    type: actions.DEQUEUE_COMPLETED,
    entry,
  };
}

export function fetchDictionaryForUser(userId) {
  return (dispatch) => {
    dispatch(startFetchingDictionary());

    const wordsCollectionSnapshot = db.collection('users').doc(userId).collection('words').get();
    wordsCollectionSnapshot.then((collection) => {
      const dictionary = collection.docs.map((entry) => (
        {
          id: entry.id,
          ...entry.data(),
        }
      ));
      dispatch(receiveDictionary(dictionary));
    });
  };
}

export function addEntry({ entryData, userId }) {
  return (dispatch) => {
    const entry = {
      id: nanoid(),
      createdAt: new Date(),
      strength: 0,
      ...entryData,
    };

    dispatch(queueEntryForAddition(entry));
    const entryRef = db.collection('users').doc(userId).collection('words').doc(entry.id);
    entryRef.set(entry).then(() => {
      dispatch(dequeueCompleted(entry));
      dispatch(addEntryToDictionary(entry));
    });
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
    dispatch(removeEntryFromDictionary(oldEntry));
    dispatch(queueEntryForAddition(newEntry));
    const entryRef = db.collection('users').doc(userId).collection('words').doc(oldEntry.id);
    entryRef.update((({
      word,
      type,
      definition,
      example,
      theme,
    }) => ({
      word,
      type,
      definition,
      example,
      theme,
    }))(newEntry)).then(() => {
      dispatch(dequeueCompleted(newEntry));
      dispatch(addEntryToDictionary(newEntry));
    });
  };
}

export function removeEntry({ entry, userId }) {
  return (dispatch) => {
    dispatch(queueEntryForDeletion(entry));
    const entryRef = db.collection('users').doc(userId).collection('words').doc(entry.id);
    entryRef.delete().then(() => {
      dispatch(dequeueCompleted(entry));
      dispatch(removeEntryFromDictionary(entry));
    });
  };
}

function requestUserDetails() {
  return {
    type: actions.FETCH_USER_DETAILS_REQUEST,
  };
}

export function receiveUserDetails(userDetails) {
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
      else userDetailsRequestFailed();
    });
  };
}

export function nextWord() {
  return {
    type: actions.NEXT_WORD,
  };
}

function getWeakestWords(dictionaryData, amount) {
  const wordsForQuiz = new Set();
  const allocationArray = [];
  const newEntries = [];

  dictionaryData.forEach((entry) => {
    if (entry.strength === 1) newEntries.push(entry);
    const allocatationRatio = 1 / entry.strength;
    const allocations = Math.ceil(allocatationRatio * 100);
    for (let i = 0; i < allocations; i += 1) {
      allocationArray.push(entry);
    }
  });

  newEntries.slice(0, amount).forEach((entry) => {
    wordsForQuiz.add(entry);
  });

  while (wordsForQuiz.size < dictionaryData.length && wordsForQuiz.size < amount) {
    wordsForQuiz.add(allocationArray[Math.floor(Math.random() * allocationArray.length)]);
  }

  return Array.from(wordsForQuiz);
}

export function startPractice() {
  return (dispatch, getState) => {
    const { dictionary } = getState();

    dispatch({
      type: actions.START_QUIZ,
      wordQueue: getWeakestWords(dictionary.data, 10),
    });
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

export function sumbitFeedback({ email, feedback }) {
  return () => {
    const feedbackId = nanoid();
    const feedbackRef = db.collection('feedback').doc(feedbackId);
    feedbackRef.set({
      email,
      feedback,
      timestamp: new Date(),
    });
  };
}
