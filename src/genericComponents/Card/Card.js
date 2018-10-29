import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const cardBaseStyle = css`
  width: 240px;
  height: 320px;
`;

const Container = styled.div`
  ${cardBaseStyle}
  display: inline-flex;
  margin: 10px;
  vertical-align: top;
  perspective: 1000px;
`;

const Body = styled.div`
  transition: 0.6s;
  transform-style: preserve-3d;
  position: relative;
  transform: ${props => (props.focused ? 'rotateY(180deg)' : 'none')};
`;

const CardContent = styled.div`
  ${cardBaseStyle}
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  backface-visibility: hidden;
  border: 2px solid;
  border-radius: 10px;
  border-color: #9E9E9E;
`;

const Front = styled(CardContent)`
  z-index: 2;
`;

const Back = styled(CardContent)`
  transform: rotateY(180deg);
  background: ${props => props.backgroundColor};
  border-color: ${props => props.borderColor};
  color: ${props => props.color};
`;

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
    const {
      front,
      back,
      theme,
    } = this.props;
    const { flipped } = this.state;

    return (
      <Container
        onMouseEnter={this.flipCard}
        onMouseLeave={this.flipCard}
      >
        <Body
          focused={flipped}
        >
          {
            !flipped
              ? (
                <Front>
                  {front}
                </Front>
              )
              : (
                <Back {...theme}>
                  {back}
                </Back>
              )
          }
        </Body>
      </Container>
    );
  }
}

Card.propTypes = {
  front: PropTypes.node.isRequired,
  back: PropTypes.node.isRequired,
  theme: PropTypes.shape({
    backgroundColor: PropTypes.string,
    borderColor: PropTypes.string,
    color: PropTypes.string,
  }),
};

Card.defaultProps = {
  theme: {
    borderColor: '#9E9E9E',
  },
};

export default Card;
