const dictionary = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_WORDS':
      return action.words;
    default:
      return state;
  }
};

export default dictionary;
