import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { removeWord as removeWordAction } from '../../actions';
import { userType } from '../../types';
import Card from '../../genericComponents/Card';

const themes = {
  red: {
    color: '#FFF',
    backgroundColor: '#D32F2F',
    borderColor: '#B71C1C',
  },
  blue: {
    color: '#FFF',
    backgroundColor: '#388E3C',
    borderColor: '#1B5E20',
  },
  green: {
    color: '#FFF',
    backgroundColor: '#1976D2',
    borderColor: '#0D47A1',
  },
  none: {
    backgroundColor: '#CFD8DC',
    borderColor: '#9E9E9E',
  },
};

const ButtonsContainer = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
`;

const ControlButtonWrapper = styled.div`
  cursor: pointer;
  background: transparent;
  padding: 0;
  border: none;
  outline: none;
`;

const RemoveButton = styled(FontAwesomeIcon)`
  color: #212121;
  margin: 0;
  font-size: 24px;
`;

const Word = styled.h2`
  letter-spacing: 1px;
`;

const Type = styled.p`
  font-style: italic;
  font-size: 16px;
`;

const Definition = styled.p`
  font-size: 16px;
`;

const Example = styled.p`
  font-style: italic;
`;

function WordCard({
  user,
  entry,
  removeWord,
  ...props
}) {
  const {
    word,
    type,
    definition,
    example,
    theme,
  } = entry;

  return (
    <Card
      {...props}
      theme={themes[theme]}
      front={
        (
          <h2 className="Word">{word}</h2>
        )
      }
      back={
        (
          <Fragment>
            <ButtonsContainer>
              <ControlButtonWrapper type="button" onClick={() => removeWord({ entry, user })}>
                <RemoveButton icon="minus-square" />
              </ControlButtonWrapper>
            </ButtonsContainer>
            <Word>{word}</Word>
            <Type>{type}</Type>
            <Definition>{definition}</Definition>
            <Example>
              &quot;
              {example}
              &quot;
            </Example>
          </Fragment>
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
    theme: PropTypes.string.isRequired,
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
