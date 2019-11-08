import React from 'react';
import styled, { keyframes } from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GenericViewContainer from './GenericViewContainer';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const StatusIcon = styled(FontAwesomeIcon)`
  margin-left: 8px;
  animation: 2s linear infinite ${spin};
`;

function Error() {
  return (
    <GenericViewContainer>
      <h2>
        Loading
        <StatusIcon icon="spinner" />
      </h2>
    </GenericViewContainer>
  );
}


export default Error;
