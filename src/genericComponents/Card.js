import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Card.css';

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flipped: false,
    };

    this.flipCard = this.flipCard.bind(this);
  }

  flipCard() {
    this.setState(prevState => ({
      flipped: !prevState.flipped,
    }));
  }

  render() {
    const { front, back } = this.props;
    const { flipped } = this.state;

    return (
      <div
        className={classNames('Card', { 'Card--focused': flipped })}
        onMouseEnter={this.flipCard}
        onMouseLeave={this.flipCard}
      >
        <div className="Card-body">
          {
            !flipped
              ? (
                <div className="Card-front">
                  {front}
                </div>
              )
              : (
                <div className="Card-back">
                  {back}
                </div>
              )
          }
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  front: PropTypes.node.isRequired,
  back: PropTypes.node.isRequired,
};

export default Card;
