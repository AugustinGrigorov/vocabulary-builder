import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  signIn as signInAction,
  signOut as signOutAction,
} from '../../actions';
import './NavigationBar.css';

function NavigationBar({ user, signIn, signOut }) {
  return (
    <nav className="TopNavigation">
      <Link
        className="TopNavigation-Link"
        to="/"
      >
        Home
      </Link>
      {
        user.details ? (
          <Fragment>
            <Link
              className="TopNavigation-Link"
              to="/gallery"
            >
              Gallery
            </Link>
            <Link
              className="TopNavigation-Link"
              to="/quiz"
            >
              Quiz
            </Link>
          </Fragment>
        ) : null
      }
      {
        user.details
          ? <ProfileControls userDetails={user.details} signOut={signOut} />
          : <InteractiveButton text="Sign in" action={signIn} className="TopNavigation-SignInButton" />
      }
    </nav>
  );
}

class ProfileControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
    };
  }

  render() {
    const { showMenu } = this.state;
    const { userDetails, signOut } = this.props;
    return (
      <div
        className="ProfileControls"
        onMouseEnter={() => this.setState({ showMenu: true })}
        onMouseLeave={() => this.setState({ showMenu: false })}
      >
        <UserBadge userDetails={userDetails} />
        { showMenu
          ? (
            <div className="ProfileControls-Menu">
              <ul>
                <li className="ProfileControls-MenuItem">
                  <InteractiveButton
                    text="Sign out"
                    action={signOut}
                    className="ProfileControls-MenuButton"
                  />
                </li>
              </ul>
            </div>
          ) : null
        }
      </div>
    );
  }
}

function UserBadge({ userDetails }) {
  return (
    <div className="UserBadge">
      <img
        className="UserBadge-Avatar"
        alt={userDetails.displayName}
        src={userDetails.photoURL}
      />
      <span className="UserBadge-Name">
        {userDetails.displayName}
      </span>
      <FontAwesomeIcon className="UserBadge-Arrow" icon="caret-down" />
    </div>
  );
}

function InteractiveButton({ text, action, className }) {
  return (
    <button
      className={className}
      type="button"
      onClick={action}
    >
      {text}
    </button>
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

ProfileControls.propTypes = {
  userDetails: PropTypes.shape({}).isRequired,
  signOut: PropTypes.func.isRequired,
};

UserBadge.propTypes = {
  userDetails: PropTypes.shape({}).isRequired,
};

InteractiveButton.propTypes = {
  text: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  className: PropTypes.string,
};

InteractiveButton.defaultProps = {
  className: null,
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
