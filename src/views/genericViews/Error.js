import React from 'react';
import PropTypes from 'prop-types';

function Error({ message }) {
  return (
    <div className="ErrorPage">
      <h2 className="ErrorPage-Heading">An error occured.</h2>
      <p>{message}</p>
    </div>
  );
}

Error.propTypes = {
  message: PropTypes.string,
};

Error.defaultProps = {
  message: null,
};

export default Error;
