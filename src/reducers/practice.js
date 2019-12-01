import {
  actions,
} from '../constants';

const practice = (state = {
  wordQueue: [],
  attempted: 0,
  correct: 0,
  currentEntryIndex: 0,
}, action) => {
  switch (action.type) {
    case actions.START_QUIZ:
      return {
        ...state,
        wordQueue: action.wordQueue,
        attempted: 0,
        correct: 0,
        currentEntryIndex: 0,
      };
    case actions.NEXT_WORD:
      return {
        ...state,
        currentEntryIndex: state.currentEntryIndex + 1,
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
