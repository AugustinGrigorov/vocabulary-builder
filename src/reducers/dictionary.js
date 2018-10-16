const dictionary = (state = {
  initialized: false,
  fetching: false,
  data: [],
  error: false,
}, action) => {
  switch (action.type) {
    case 'FETCH_DICTIONARY_REQUEST':
      return {
        ...state,
        fetching: true,
        error: false,
      };
    case 'RECEIVE_DICTIONARY':
      return {
        fetching: false,
        data: action.dictionary,
        initialized: true,
        error: false,
      };
    case 'DICTIONARY_REQUEST_FAILED':
      return {
        ...state,
        fetching: false,
        error: true,
      };
    default:
      return state;
  }
};

export default dictionary;
