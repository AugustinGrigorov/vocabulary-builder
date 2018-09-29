import React from 'react';
import PropTypes from 'prop-types';
import Card from '../../genericComponents/Card';
import './WordCard.css';

function WordCard({ entry }) {
  const { word, type, definition } = entry;

  return (
    <Card
      front={
        <h2 className="Word">{word}</h2>
      }
      back={
        (
          <React.Fragment>
            <h2 className="Word">{word}</h2>
            <p className="Type">{type}</p>
            <p className="Definition">{definition}</p>
          </React.Fragment>
        )
      }
    />
  );
}

WordCard.propTypes = {
  entry: PropTypes.shape({
    word: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    definition: PropTypes.string.isRequired,
  }).isRequired,
};

export default WordCard;
