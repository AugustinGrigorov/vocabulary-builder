import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import {
  signIn as signInAction,
  signOut as signOutAction,
  listenForAuthChanges as listenForAuthChangesAction,
} from './actions';
import NavigationBar from './customComponents/NavigationBar';
import Home from './views/Home';
import Gallery from './views/Gallery';
import './App.css';

library.add(faCaretDown);

const PrivateRoute = ({
  component: View,
  user,
  signIn,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => (user
      ? (
        <View {...props} />
      ) : (
        <button
          type="button"
          onClick={signIn}
        >
          Sign in
        </button>
      ))
    }
  />
);

class App extends Component {
  componentDidMount() {
    const { listenForAuthChanges } = this.props;
    listenForAuthChanges();
  }

  render() {
    const { user, signIn } = this.props;
    return (
      <div className="App">
        <Router>
          <Fragment>
            <NavigationBar />
            <Route exact path="/" component={Home} />
            <PrivateRoute user={user} signIn={signIn} exact path="/gallery" component={Gallery} />
          </Fragment>
        </Router>
      </div>
    );
  }
}

App.propTypes = {
  listenForAuthChanges: PropTypes.func.isRequired,
  signIn: PropTypes.func.isRequired,
  user: PropTypes.shape({}),
};

App.defaultProps = {
  user: null,
};

const mapDispatchToProps = dispatch => ({
  listenForAuthChanges: () => dispatch(listenForAuthChangesAction()),
  signIn: () => dispatch(signInAction()),
  signOut: () => dispatch(signOutAction()),
});

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
