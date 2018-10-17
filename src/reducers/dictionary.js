const dictionary = (state = {
  initialized: false,
  data: [],
  errors: [],
}, action) => {
  switch (action.type) {
    case 'RECEIVE_DICTIONARY':
      return {
        ...state,
        data: action.dictionary,
        initialized: true,
      };
    case 'DICTIONARY_REQUEST_FAILED':
      return {
        ...state,
        errors: [...state.errors, action.error],
      };
    default:
      return state;
  }
};

export default dictionary;
