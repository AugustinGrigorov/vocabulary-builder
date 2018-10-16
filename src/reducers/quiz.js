const quiz = (state = {
  initialized: false,
  error: false,
  wordQueue: [],
}, action) => {
  switch (action.type) {
    case 'SET_QUIZ_QUEUE':
      return {
        ...state,
        wordQueue: action.queue,
      };
    case 'SET_CURRENT_QUIZ_ENTRY':
      return {
        ...state,
        currentEntry: action.entry,
        initialized: true,
      };
    case 'QUIZ_SETUP_FAILED':
      return {
        ...state,
        error: true,
      };
    default:
      return state;
  }
};

export default quiz;
