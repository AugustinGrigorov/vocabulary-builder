const quiz = (state = {
  wordQueue: [],
  attempted: 0,
  correct: 0,
}, action) => {
  switch (action.type) {
    case 'START_QUIZ':
      return {
        ...state,
        attempted: 0,
        correct: 0,
      };
    case 'SET_QUIZ_QUEUE':
      return {
        ...state,
        wordQueue: action.queue,
      };
    case 'SET_CURRENT_QUIZ_ENTRY':
      return {
        ...state,
        currentEntry: action.entry,
      };
    case 'UPDATE_SCORE':
      return {
        ...state,
        attempted: action.attempted,
        correct: action.correct,
      };
    default:
      return state;
  }
};

export default quiz;
