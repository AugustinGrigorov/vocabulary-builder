const learn = (state = {
  entryAdditionQueue: [],
  entryDeletionQueueIds: [],
}, action) => {
  switch (action.type) {
    case 'QUEUE_ENTRY_FOR_ADDITION':
      return {
        ...state,
        entryAdditionQueue: [...state.entryAdditionQueue, action.entry],
      };
    case 'QUEUE_ENTRY_FOR_DELETION':
      return {
        ...state,
        entryDeletionQueueIds: [...state.entryDeletionQueueIds, action.entry.id],
      };
    case 'DEQUEUE_COMPLETED':
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
    default:
      return state;
  }
};

export default learn;
