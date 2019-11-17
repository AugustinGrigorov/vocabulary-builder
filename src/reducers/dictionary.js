import {
  actions,
} from '../constants';

const dictionary = (state = {
  initialized: false,
  data: [],
}, action) => {
  switch (action.type) {
    case actions.RECEIVE_DICTIONARY:
      return {
        ...state,
        data: action.dictionary,
        initialized: true,
      };
    case actions.REMOVE_ENTRY:
      return {
        ...state,
        data: state.data.filter((entry) => entry.id !== action.entry.id),
      };
    default:
      return state;
  }
};

export default dictionary;
