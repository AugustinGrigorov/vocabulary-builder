import {
  actions,
} from '../constants';

const learn = (state = {
  editedEntryId: null,
  entryAdditionQueue: [],
  entryDeletionQueueIds: [],
}, action) => {
  switch (action.type) {
    case actions.QUEUE_ENTRY_FOR_ADDITION:
      return {
        ...state,
        entryAdditionQueue: [action.entry, ...state.entryAdditionQueue],
      };
    case actions.QUEUE_ENTRY_FOR_DELETION:
      return {
        ...state,
        entryDeletionQueueIds: [...state.entryDeletionQueueIds, action.entry.id],
      };
    case actions.DEQUEUE_COMPLETED:
      return {
        entryAdditionQueue: state.entryAdditionQueue.filter(
          (entry) => !action.dictionary.some(
            (dictionaryEntry) => entry.id === dictionaryEntry.id,
          ),
        ),
        entryDeletionQueueIds: state.entryDeletionQueueIds.filter(
          (id) => action.dictionary.some(
            (dictionaryEntry) => id === dictionaryEntry.id,
          ),
        ),
      };
    case actions.START_EDIT:
      return {
        ...state,
        editedEntryId: action.entryId,
      };
    case actions.FINISH_EDIT:
      return {
        ...state,
        editedEntryId: null,
      };
    default:
      return state;
  }
};

export default learn;
