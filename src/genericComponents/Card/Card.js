import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/macro';

const cardBaseStyle = css`
  width: 240px;
  height: 320px;
`;

const Container = styled.div`
  cursor: pointer;
  display: inline-flex;
  margin: 10px;
  vertical-align: top;
  perspective: 1000px;
  outline: none;
  opacity: ${(props) => (props.queued ? '0.6' : null)}
`;

const Body = styled.div`
  ${cardBaseStyle}
  transition: .5s;
  transform-style: preserve-3d;
  position: relative;
  transform: ${(props) => (props.focused ? 'rotateY(180deg)' : 'none')};
`;

const CardContent = styled.div`
  ${cardBaseStyle}
  position: absolute;
  top: 0;
  left: 0;
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
  background: ${({ backgroundColor }) => backgroundColor};
  border-color: ${({ borderColor }) => borderColor};
  color: ${({ color }) => color};
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
      queued,
    } = this.props;
    const { flipped } = this.state;

    return (
      <Container
        tabIndex={0}
        onFocus={(e) => this.flipCard(e, true)}
        onBlur={(e) => this.flipCard(e, false)}
        role="button"
        ref={this.elementReferece}
        queued={queued}
      >
        <Body
          focused={flipped}
        >
          <Front>
            {front}
          </Front>
          <Back
            backgroundColor={theme.backgroundColor}
            borderColor={theme.borderColor}
            color={theme.color}
          >
            {back}
          </Back>
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
  queued: PropTypes.bool,
};

Card.defaultProps = {
  theme: {
    borderColor: '#9E9E9E',
  },
  queued: false,
};

export default Card;
