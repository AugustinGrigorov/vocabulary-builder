const dictionary = (state = {
  initialized: false,
  data: [],
}, action) => {
  switch (action.type) {
    case 'RECEIVE_DICTIONARY':
      return {
        ...state,
        data: action.dictionary,
        initialized: true,
      };
    default:
      return state;
  }
};

export default dictionary;
