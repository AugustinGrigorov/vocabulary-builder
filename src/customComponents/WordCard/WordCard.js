import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Card from '../../genericComponents/Card';
import './WordCard.css';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function WordCard({ entry }) {
  const {
    word,
    type,
    definition,
    backgroundColor,
  } = entry;

  return (
    <Card
      front={
        (
          <div className="WordCard-Front">
            <h2 className="Word">{word}</h2>
          </div>
        )
      }
      back={
        (
          <div
            className={
              classNames(
                'WordCard-Back',
                { [`WordCard-Back--${capitalizeFirstLetter(backgroundColor)}`]: backgroundColor !== 'none' },
              )
            }
          >
            <h2 className="Word">{word}</h2>
            <p className="Type">{type}</p>
            <p className="Definition">{definition}</p>
          </div>
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
    backgroundColor: PropTypes.string.isRequired,
  }).isRequired,
};

export default WordCard;
