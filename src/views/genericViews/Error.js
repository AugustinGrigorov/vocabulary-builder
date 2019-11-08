import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GenericViewContainer from './GenericViewContainer';

const StatusIcon = styled(FontAwesomeIcon)`
  margin-right: 8px;
  color: #D32F2F;
`;

function Error({ message }) {
  return (
    <GenericViewContainer>
      <h2>
        <StatusIcon icon="exclamation-triangle" />
        An error occured.
      </h2>
      <p>{message}</p>
    </GenericViewContainer>
  );
}

Error.propTypes = {
  message: PropTypes.string,
};

Error.defaultProps = {
  message: null,
};

export default Error;
