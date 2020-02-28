import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  listenForAuthChanges as listenForAuthChangesAction,
  fetchDictionaryForUser as fetchDictionaryForUserAction,
  receiveUserDetails as receiveUserDetailsAction,
} from './actions';
import NavigationBar from './customComponents/NavigationBar';
import FeedbackWidget from './customComponents/FeedbackWidget';
import Home from './views/Home';
import Inspect from './views/Inspect';
import Learn from './views/Learn';
import Practice from './views/Practice';
import { Error, Loading } from './views/genericViews';
import { userType, dictionaryType } from './types';

const PrivateRoute = ({
  component: View,
  user,
  dictionary,
  exact,
  path,
}) => (
  <Route
    exact={exact}
    path={path}
    render={
      () => {
        if (user.fetching) return <Loading />;
        if (!user.details) return <Error message="Not logged in." />;
        if (dictionary.error) return <Error message="Fetching dictionary failed." />;
        return <View user={user} dictionary={dictionary} />;
      }
    }
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  user: userType.isRequired,
  dictionary: dictionaryType.isRequired,
  path: PropTypes.string.isRequired,
  exact: PropTypes.bool,
};

PrivateRoute.defaultProps = {
  exact: false,
};

const testUserDetails = {
  uid: '1234',
  displayName: 'Test User',
  photoURL: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDEwMCAxMDAiIHhtbDpzcGFjZT0icHJlc2VydmUiIGhlaWdodD0iMTAwcHgiIHdpZHRoPSIxMDBweCI+CjxnPgoJPHBhdGggZD0iTTI4LjEsMzYuNmM0LjYsMS45LDEyLjIsMS42LDIwLjksMS4xYzguOS0wLjQsMTktMC45LDI4LjksMC45YzYuMywxLjIsMTEuOSwzLjEsMTYuOCw2Yy0xLjUtMTIuMi03LjktMjMuNy0xOC42LTMxLjMgICBjLTQuOS0wLjItOS45LDAuMy0xNC44LDEuNEM0Ny44LDE3LjksMzYuMiwyNS42LDI4LjEsMzYuNnoiLz4KCTxwYXRoIGQ9Ik03MC4zLDkuOEM1Ny41LDMuNCw0Mi44LDMuNiwzMC41LDkuNWMtMyw2LTguNCwxOS42LTUuMywyNC45YzguNi0xMS43LDIwLjktMTkuOCwzNS4yLTIzLjFDNjMuNywxMC41LDY3LDEwLDcwLjMsOS44eiIvPgoJPHBhdGggZD0iTTE2LjUsNTEuM2MwLjYtMS43LDEuMi0zLjQsMi01LjFjLTMuOC0zLjQtNy41LTctMTEtMTAuOGMtMi4xLDYuMS0yLjgsMTIuNS0yLjMsMTguN0M5LjYsNTEuMSwxMy40LDUwLjIsMTYuNSw1MS4zeiIvPgoJPHBhdGggZD0iTTksMzEuNmMzLjUsMy45LDcuMiw3LjYsMTEuMSwxMS4xYzAuOC0xLjYsMS43LTMuMSwyLjYtNC42YzAuMS0wLjIsMC4zLTAuNCwwLjQtMC42Yy0yLjktMy4zLTMuMS05LjItMC42LTE3LjYgICBjMC44LTIuNywxLjgtNS4zLDIuNy03LjRjLTUuMiwzLjQtOS44LDgtMTMuMywxMy43QzEwLjgsMjcuOSw5LjgsMjkuNyw5LDMxLjZ6Ii8+Cgk8cGF0aCBkPSJNMTUuNCw1NC43Yy0yLjYtMS02LjEsMC43LTkuNywzLjRjMS4yLDYuNiwzLjksMTMsOCwxOC41QzEzLDY5LjMsMTMuNSw2MS44LDE1LjQsNTQuN3oiLz4KCTxwYXRoIGQ9Ik0zOS44LDU3LjZDNTQuMyw2Ni43LDcwLDczLDg2LjUsNzYuNGMwLjYtMC44LDEuMS0xLjYsMS43LTIuNWM0LjgtNy43LDctMTYuMyw2LjgtMjQuOGMtMTMuOC05LjMtMzEuMy04LjQtNDUuOC03LjcgICBjLTkuNSwwLjUtMTcuOCwwLjktMjMuMi0xLjdjLTAuMSwwLjEtMC4yLDAuMy0wLjMsMC40Yy0xLDEuNy0yLDMuNC0yLjksNS4xQzI4LjIsNDkuNywzMy44LDUzLjksMzkuOCw1Ny42eiIvPgoJPHBhdGggZD0iTTI2LjIsODguMmMzLjMsMiw2LjcsMy42LDEwLjIsNC43Yy0zLjUtNi4yLTYuMy0xMi42LTguOC0xOC41Yy0zLjEtNy4yLTUuOC0xMy41LTktMTcuMmMtMS45LDgtMiwxNi40LTAuMywyNC43ICAgQzIwLjYsODQuMiwyMy4yLDg2LjMsMjYuMiw4OC4yeiIvPgoJPHBhdGggZD0iTTMwLjksNzNjMi45LDYuOCw2LjEsMTQuNCwxMC41LDIxLjJjMTUuNiwzLDMyLTIuMyw0Mi42LTE0LjZDNjcuNyw3Niw1Mi4yLDY5LjYsMzcuOSw2MC43QzMyLDU3LDI2LjUsNTMsMjEuMyw0OC42ICAgYy0wLjYsMS41LTEuMiwzLTEuNyw0LjZDMjQuMSw1Ny4xLDI3LjMsNjQuNSwzMC45LDczeiIvPgo8L2c+Cjwvc3ZnPg==',
};

class App extends Component {
  constructor(props) {
    super(props);
    const {
      listenForAuthChanges,
      fetchDictionaryForUser,
      receiveUserDetails,
    } = this.props;
    if (process.env.REACT_APP_ENV !== 'test') {
      listenForAuthChanges();
    } else {
      receiveUserDetails(testUserDetails);
      fetchDictionaryForUser(testUserDetails.uid);
    }
  }

  render() {
    const { user, dictionary } = this.props;
    return (
      <div className="App">
        <Router>
          <>
            <Route path="*" component={NavigationBar} />
            <Route exact path="/" component={Home} />
            <PrivateRoute
              user={user}
              dictionary={dictionary}
              exact
              path="/inspect"
              component={Inspect}
            />
            <PrivateRoute
              user={user}
              dictionary={dictionary}
              exact
              path="/learn"
              component={Learn}
            />
            <PrivateRoute
              user={user}
              dictionary={dictionary}
              exact
              path="/practice"
              component={Practice}
            />
            <Route path="*" component={FeedbackWidget} />
          </>
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
  user: userType,
  receiveUserDetails: PropTypes.func.isRequired,
  fetchDictionaryForUser: PropTypes.func.isRequired,
};

App.defaultProps = {
  user: null,
};

const mapDispatchToProps = (dispatch) => ({
  listenForAuthChanges: () => dispatch(listenForAuthChangesAction()),
  receiveUserDetails: (userDetails) => dispatch(receiveUserDetailsAction(userDetails)),
  fetchDictionaryForUser: (userId) => dispatch(fetchDictionaryForUserAction(userId)),
});

const mapStateToProps = (state) => ({
  user: state.user,
  dictionary: state.dictionary,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
