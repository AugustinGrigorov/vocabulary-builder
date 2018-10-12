import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AddCard from '../../customComponents/AddCard';
import WordCard from '../../customComponents/WordCard';

function Gallery({ dictionary }) {
  return (
    <div>
      <AddCard />
      {dictionary.map(entry => (
        <WordCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}

Gallery.propTypes = {
  dictionary: PropTypes.arrayOf(PropTypes.shape({
    word: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    definition: PropTypes.string.isRequired,
  })).isRequired,
};

const mapStateToProps = state => ({
  dictionary: state.dictionary,
});

export default connect(
  mapStateToProps,
)(Gallery);
