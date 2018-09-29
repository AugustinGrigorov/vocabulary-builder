import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  signIn as signInAction,
  signOut as signOutAction,
  retrieveUser as retrieveUserAction,
} from './actions';
import AddCard from './customComponents/AddCard';
import WordCard from './customComponents/WordCard';
import './App.css';

class App extends Component {
  componentDidMount() {
    const { retrieveUser } = this.props;
    retrieveUser();
  }

  render() {
    const {
      dictionary,
      user,
      signOut,
      signIn,
    } = this.props;

    return (
      <div className="App">
        <nav className="TopNavigation">
          {
            user
              ? <button type="button" className="AuthenticationButton" onClick={signOut}>Log Out</button>
              : <button type="button" className="AuthenticationButton" onClick={signIn}>Log In</button>
          }
        </nav>
        <AddCard />
        {dictionary.map(entry => (
          <WordCard key={entry.id} entry={entry} />
        ))}
      </div>
    );
  }
}

App.propTypes = {
  user: PropTypes.shape({}).isRequired,
  dictionary: PropTypes.arrayOf(PropTypes.shape({
    word: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    definition: PropTypes.string.isRequired,
  })).isRequired,
  retrieveUser: PropTypes.func.isRequired,
  signIn: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  retrieveUser: () => dispatch(retrieveUserAction()),
  signIn: () => dispatch(signInAction()),
  signOut: () => dispatch(signOutAction()),
});

const mapStateToProps = state => ({
  dictionary: state.dictionary,
  user: state.user,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
