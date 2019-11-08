import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GenericViewContainer from '../genericViews/GenericViewContainer';

const ResultIcon = styled(FontAwesomeIcon)`
  margin-right: 8px;
  color: #FFD700;
`;

function Result({ correct, attempted }) {
  return (
    <GenericViewContainer>
      <h2>
        <ResultIcon icon="trophy" />
        Well done!
      </h2>
      <p>
        {`You got ${correct} out of ${attempted} right.`}
      </p>
    </GenericViewContainer>
  );
}

Result.propTypes = {
  correct: PropTypes.number.isRequired,
  attempted: PropTypes.number.isRequired,
};

export default Result;
