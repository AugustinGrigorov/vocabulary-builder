import {
  actions,
} from '../constants';

const dictionary = (state = {
  initialized: false,
  data: [],
}, action) => {
  const dictionaryData = state.data;
  let entryToUpdate;
  let entryToUpdateIndex;

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
        data: dictionaryData.filter((entry) => entry.id !== action.entry.id),
      };
    case actions.UPDATE_ATTEMPTS:
      for (let i = 0; i < dictionaryData.length; i += 1) {
        if (dictionaryData[i].id === action.entryId) {
          entryToUpdate = dictionaryData[i];
          entryToUpdateIndex = i;
        }
      }

      return {
        ...state,
        data: [
          ...dictionaryData.slice(0, entryToUpdateIndex),
          {
            ...entryToUpdate,
            attempts: [
              ...entryToUpdate.attempts || [],
              {
                correct: action.correct,
                timestamp: {
                  seconds: Date.now() / 1000,
                },
              },
            ],
          },
          ...dictionaryData.slice(entryToUpdateIndex + 1),
        ],
      };
    default:
      return state;
  }
};

export default dictionary;
