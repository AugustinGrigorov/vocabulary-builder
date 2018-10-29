import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  signIn as signInAction,
  signOut as signOutAction,
} from '../../actions';
import InteractiveButton from './InteractiveButton';
import ProfileControls from './ProfileControls';

const Container = styled.nav`
  position: relative;
  background-color: #388E3C;
  width: 100%;
  display: flex;
  box-shadow: 0 2px 4px rgba(0,0,0,0.4);
  height: 64px;
`;

const NavLink = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 12px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
`;

const RightSection = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  margin-left: auto;
  margin-right: 12px;
`;

const SignInButton = styled(InteractiveButton)`
  color: #FFF;
`;

function NavigationBar({ user, signIn, signOut }) {
  return (
    <Container>
      <NavLink to="/">
        Home
      </NavLink>
      {
        user.details ? (
          <Fragment>
            <NavLink to="/gallery">
              Gallery
            </NavLink>
            <NavLink to="/quiz">
              Quiz
            </NavLink>
          </Fragment>
        ) : null
      }
      <RightSection>
        {
          user.details
            ? <ProfileControls userDetails={user.details} signOut={signOut} />
            : <SignInButton type="button" onClick={signIn}>Sign in</SignInButton>
        }
      </RightSection>
    </Container>
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
