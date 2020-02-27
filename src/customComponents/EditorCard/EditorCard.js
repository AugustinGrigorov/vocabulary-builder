import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Card from '../../genericComponents/Card';
import WordForm from '../../genericComponents/WordForm';

const Word = styled.h2`
  letter-spacing: 1px;
`;

const AddIcon = styled(FontAwesomeIcon)`
  color: #4CAF50;
  font-size: 32px;
`;

function EditorCard() {
  return (
    <Card
      editor
      front={<Word><AddIcon icon="plus-circle" /></Word>}
      back={<WordForm />}
    />
  );
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(
  mapStateToProps,
)(EditorCard);
