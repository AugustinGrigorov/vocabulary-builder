import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { removeWord as removeWordAction } from '../../actions';
import { userType } from '../../types';
import Card from '../../genericComponents/Card';
import './WordCard.css';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function WordCard({ user, entry, removeWord }) {
  const {
    word,
    type,
    definition,
    example,
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
            <div className="WordCard-Buttons">
              <button className="WordCard-ControlButton" type="button" onClick={() => removeWord({ entry, user })}>
                <FontAwesomeIcon className="WordCard-RemoveButton" icon="minus-square" />
              </button>
            </div>
            <h2 className="Word">{word}</h2>
            <p className="Type">{type}</p>
            <p className="Definition">{definition}</p>
            <p className="Example">
              &quot;
              {example}
              &quot;
            </p>
          </div>
        )
      }
    />
  );
}

WordCard.propTypes = {
  user: userType.isRequired,
  entry: PropTypes.shape({
    word: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    definition: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string.isRequired,
  }).isRequired,
  removeWord: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  removeWord: payload => dispatch(removeWordAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WordCard);
