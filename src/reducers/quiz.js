const quiz = (state = {
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
      };
    default:
      return state;
  }
};

export default quiz;
