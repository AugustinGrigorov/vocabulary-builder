import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  signIn as signInAction,
  signOut as signOutAction,
  listenForAuthChanges as listenForAuthChangesAction,
} from './actions';
import NavigationBar from './customComponents/NavigationBar';
import Home from './views/Home';
import Gallery from './views/Gallery';
import Quiz from './views/Quiz';
import { Error, Loading } from './views/genericViews';
import './App.css';

const PrivateRoute = ({
  component: View,
  user,
  dictionary,
  signIn,
  ...rest
}) => (
  <Route
    {...rest}
    render={
      (props) => {
        if (user.fetching) return <Loading />;
        if (!user.details) return <Error message="Not logged in." />;
        if (dictionary.error) return <Error message="Fetching dictionary failed." />;
        return <View {...props} />;
      }
    }
  />
);

class App extends Component {
  componentDidMount() {
    const { listenForAuthChanges } = this.props;
    listenForAuthChanges();
  }

  render() {
    const { user, signIn, dictionary } = this.props;
    return (
      <div className="App">
        <Router>
          <Fragment>
            <NavigationBar />
            <Route exact path="/" component={Home} />
            <PrivateRoute
              user={user}
              dictionary={dictionary}
              signIn={signIn}
              exact
              path="/gallery"
              component={Gallery}
            />
            <PrivateRoute
              user={user}
              dictionary={dictionary}
              signIn={signIn}
              exact
              path="/quiz"
              component={Quiz}
            />
          </Fragment>
        </Router>
      </div>
    );
  }
}

App.propTypes = {
  dictionary: PropTypes.shape({
    fetching: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.shape({
      word: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      definition: PropTypes.string.isRequired,
    })),
    error: PropTypes.bool,
  }).isRequired,
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
  dictionary: state.dictionary,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
