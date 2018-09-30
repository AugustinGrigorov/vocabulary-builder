import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
          ? <ProfileControls user={user} signOut={signOut} />
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
    const { user, signOut } = this.props;
    return (
      <div
        className="ProfileControls"
        onMouseEnter={() => this.setState({ showMenu: true })}
        onMouseLeave={() => this.setState({ showMenu: false })}
      >
        <UserBadge user={user} />
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

function UserBadge({ user }) {
  return (
    <div className="UserBadge">
      <img
        className="UserBadge-Avatar"
        alt={user.displayName}
        src={user.photoURL}
      />
      <span className="UserBadge-Name">
        {user.displayName}
        <FontAwesomeIcon className="UserBadge-Arrow" icon="caret-down" />
      </span>
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
  user: PropTypes.shape({}).isRequired,
  signOut: PropTypes.func.isRequired,
};

UserBadge.propTypes = {
  user: PropTypes.shape({}).isRequired,
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
