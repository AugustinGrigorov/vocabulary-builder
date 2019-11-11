import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  removeWord as removeWordAction,
  startEdit as startEditAction,
} from '../../actions';
import { userType } from '../../types';

import Card from '../../genericComponents/Card';
import WordForm from '../../genericComponents/WordForm';

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
  display: flex;
  flex-direction: row;
`;

const ControlButtonWrapper = styled.div`
  cursor: pointer;
  background: transparent;
  padding: 0;
  border: none;
  outline: none;
  margin: 4px;
`;

const RemoveButton = styled(FontAwesomeIcon)`
  color: #212121;
  margin: 0;
  font-size: 24px;
`;

const EditButton = styled(FontAwesomeIcon)`
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
  key,
  user,
  entry,
  removeWord,
  startEdit,
  editedEntryId,
  queued,
}) {
  const {
    id,
    word,
    theme,
  } = entry;

  const isBeingEdited = editedEntryId === id;

  return (
    <Card
      key={key}
      queued={queued}
      theme={isBeingEdited ? null : themes[theme]}
      front={
        (
          <h2 className="Word">{word}</h2>
        )
      }
      back={isBeingEdited ? (
        <WordForm entry={entry} />
      ) : (
        <DisplayContent
          removeWord={removeWord}
          startEdit={startEdit}
          entry={entry}
          userId={user.details.uid}
        />
      )}
    />
  );
}

function DisplayContent({
  removeWord,
  startEdit,
  entry,
  userId,
}) {
  const {
    word,
    type,
    definition,
    example,
  } = entry;
  return (
    <>
      <ButtonsContainer>
        <ControlButtonWrapper type="button" onClick={() => startEdit(entry.id)}>
          <EditButton icon="pen-square" />
        </ControlButtonWrapper>
        <ControlButtonWrapper type="button" onClick={() => removeWord({ entry, userId })}>
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
    </>
  );
}

const entryPropType = PropTypes.shape({
  word: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  definition: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
});

DisplayContent.propTypes = {
  entry: entryPropType.isRequired,
  userId: PropTypes.string.isRequired,
  removeWord: PropTypes.func.isRequired,
  startEdit: PropTypes.func.isRequired,
};

WordCard.propTypes = {
  user: userType.isRequired,
  entry: entryPropType.isRequired,
  removeWord: PropTypes.func.isRequired,
  startEdit: PropTypes.func.isRequired,
  editedEntryId: PropTypes.string,
  key: PropTypes.string,
  queued: PropTypes.bool,
};

WordCard.defaultProps = {
  editedEntryId: null,
  key: null,
  queued: false,
};

const mapStateToProps = (state) => ({
  user: state.user,
  editedEntryId: state.learn.editedEntryId,
});

const mapDispatchToProps = (dispatch) => ({
  removeWord: (payload) => dispatch(removeWordAction(payload)),
  startEdit: (payload) => dispatch(startEditAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WordCard);
