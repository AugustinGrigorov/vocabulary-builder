import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  listenForAuthChanges as listenForAuthChangesAction,
} from './actions';
import NavigationBar from './customComponents/NavigationBar';
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

class App extends Component {
  constructor(props) {
    super(props);
    const { listenForAuthChanges } = this.props;
    listenForAuthChanges();
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
};

App.defaultProps = {
  user: null,
};

const mapDispatchToProps = (dispatch) => ({
  listenForAuthChanges: () => dispatch(listenForAuthChangesAction()),
});

const mapStateToProps = (state) => ({
  user: state.user,
  dictionary: state.dictionary,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
