import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { startPractice as startPracticeAction } from '../../actions';
import GenericViewContainer from '../genericViews/GenericViewContainer';
import { buttonBaseStyle } from '../../genericComponents/styles';

const ResultIcon = styled(FontAwesomeIcon)`
  margin-right: 8px;
  color: #FFD700;
`;

const PracticeMoreButton = styled.button`
  ${buttonBaseStyle}
  background: #0091EA;
  margin: 0 auto;
`;

function Result({ correct, attempted, startPractice }) {
  return (
    <GenericViewContainer>
      <h2>
        <ResultIcon icon="trophy" />
        Well done!
      </h2>
      <p>
        {`You got ${correct} out of ${attempted} right.`}
      </p>
      <PracticeMoreButton
        type="button"
        onClick={startPractice}
      >
        Practice more
      </PracticeMoreButton>
    </GenericViewContainer>
  );
}

Result.propTypes = {
  correct: PropTypes.number.isRequired,
  attempted: PropTypes.number.isRequired,
  startPractice: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  startPractice: () => dispatch(startPracticeAction()),
});

export default connect(
  null,
  mapDispatchToProps,
)(Result);
