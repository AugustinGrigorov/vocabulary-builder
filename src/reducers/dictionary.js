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
    case 'REMOVE_ENTRY':
      return {
        ...state,
        data: state.data.filter((entry) => entry.id !== action.entry.id),
      };
    default:
      return state;
  }
};

export default dictionary;
