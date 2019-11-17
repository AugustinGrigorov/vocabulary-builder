import {
  actions,
} from '../constants';

const practice = (state = {
  wordQueue: [],
  attempted: 0,
  correct: 0,
}, action) => {
  switch (action.type) {
    case actions.START_QUIZ:
      return {
        ...state,
        attempted: 0,
        correct: 0,
      };
    case actions.SET_QUIZ_QUEUE:
      return {
        ...state,
        wordQueue: action.queue,
      };
    case actions.SET_CURRENT_QUIZ_ENTRY:
      return {
        ...state,
        currentEntry: action.entry,
      };
    case actions.UPDATE_SCORE:
      return {
        ...state,
        attempted: action.attempted,
        correct: action.correct,
      };
    default:
      return state;
  }
};

export default practice;
