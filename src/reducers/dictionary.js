import {
  actions,
} from '../constants';

import { calculateStrength } from '../utils/entity_utils';

const dictionary = (state = {
  initialized: false,
  data: [],
}, action) => {
  const dictionaryData = state.data;
  let entryToUpdate;
  let entryToUpdateIndex;
  let attempts;

  switch (action.type) {
    case actions.RECEIVE_DICTIONARY:
      return {
        ...state,
        data: action.dictionary
          .map((entry) => ({
            createdAt: { seconds: 0 },
            ...entry,
            strength: calculateStrength(entry),
          })).sort((a, b) => a.strength - b.strength || b.createdAt.seconds - a.createdAt.seconds),
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

      attempts = [
        ...entryToUpdate.attempts || [],
        {
          correct: action.correct,
          timestamp: {
            seconds: Date.now() / 1000,
          },
        },
      ];

      return {
        ...state,
        data: [
          ...dictionaryData.slice(0, entryToUpdateIndex),
          {
            ...entryToUpdate,
            attempts,
            strength: calculateStrength({ attempts }),
          },
          ...dictionaryData.slice(entryToUpdateIndex + 1),
        ],
      };
    default:
      return state;
  }
};

export default dictionary;
