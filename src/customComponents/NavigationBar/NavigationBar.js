import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  signIn as signInAction,
  signOut as signOutAction,
} from '../../actions';
import './NavigationBar.css';

function NavigationBar({ user, signIn, signOut }) {
  return (
    <nav className="TopNavigation">
      {
        user
          ? <button type="button" className="AuthenticationButton" onClick={signOut}>Log Out</button>
          : <button type="button" className="AuthenticationButton" onClick={signIn}>Log In</button>
      }
    </nav>
  );
}

NavigationBar.propTypes = {
  user: PropTypes.shape({}),
  signIn: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
};

NavigationBar.defaultProps = {
  user: null,
};

const mapDispatchToProps = dispatch => ({
  signIn: () => dispatch(signInAction()),
  signOut: () => dispatch(signOutAction()),
});

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationBar);
