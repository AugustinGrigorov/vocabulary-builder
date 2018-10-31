import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Transition } from 'react-transition-group';

const cardBaseStyle = css`
  width: 240px;
  height: 320px;
`;

const Container = styled.div`
  ${cardBaseStyle}
  cursor: pointer;
  display: inline-flex;
  margin: 10px;
  vertical-align: top;
  perspective: 1000px;
  outline: none;
`;

const Body = styled.div`
  transition: .5s;
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
  transform: rotateY(0deg);
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

    this.elementReferece = React.createRef();
    this.flipCard = this.flipCard.bind(this);
  }

  flipCard(e, isFocused) {
    const currentElement = this.elementReferece.current;
    const relatedElement = e.relatedTarget;

    // On blur do not flip if new focus is inside the card
    if (!isFocused && relatedElement && currentElement.contains(relatedElement)) return;

    this.setState(() => ({
      flipped: isFocused,
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
        tabIndex={0}
        onFocus={e => this.flipCard(e, true)}
        onBlur={e => this.flipCard(e, false)}
        role="button"
        ref={this.elementReferece}
      >
        <Body focused={flipped}>
          <Transition
            in={flipped}
            timeout={150}
          >
            {(state) => {
              switch (state) {
                case 'entering':
                  return (
                    <Front>
                      {front}
                    </Front>
                  );
                case 'entered':
                  return (
                    <Back {...theme}>
                      {back}
                    </Back>
                  );
                case 'exiting':
                  return (
                    <Back {...theme}>
                      {back}
                    </Back>
                  );
                case 'exited':
                  return (
                    <Front>
                      {front}
                    </Front>
                  );
                default:
                  return null;
              }
            }}
          </Transition>
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
