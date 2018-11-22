import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
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

const LinkContaienr = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  overflow: auto;
  margin: 8px;
  background: #66BB6A;
  border-radius: 24px;
  &::after{
    content: '\0a0';
    margin-left: -5px;
  }
`;

const StyledLink = styled(NavLink)`
  display: flex;
  margin: 0 8px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 18px;

  &.selected {
    background: #1B5E20;
  }
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
  width: 80px;
`;

function NavigationBar({ user, signIn, signOut }) {
  return (
    <Container>
      <LinkContaienr>
        <StyledLink
          exact
          activeClassName="selected"
          to="/"
        >
          Home
        </StyledLink>
        {
          user.details ? (
            <Fragment>
              <StyledLink
                exact
                activeClassName="selected"
                to="/inspect"
              >
                Inspect
              </StyledLink>
              <StyledLink
                exact
                activeClassName="selected"
                to="/learn"
              >
                Learn
              </StyledLink>
              <StyledLink
                exact
                activeClassName="selected"
                to="/practice"
              >
                Practice
              </StyledLink>
            </Fragment>
          ) : null
        }
      </LinkContaienr>
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
