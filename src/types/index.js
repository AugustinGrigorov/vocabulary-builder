import PropTypes from 'prop-types';

export const userType = PropTypes.shape({
  fetching: PropTypes.bool,
  details: PropTypes.shape({
    uid: PropTypes.string,
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
  }),
});

export const dictionaryType = PropTypes.shape({
  fetching: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.shape({
    word: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    definition: PropTypes.string.isRequired,
  })),
  error: PropTypes.bool,
});

export const entryType = PropTypes.shape({
  word: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  definition: PropTypes.string.isRequired,
});
