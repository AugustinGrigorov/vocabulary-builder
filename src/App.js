import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  signIn as signInAction,
  signOut as signOutAction,
  listenForAuthChanges as listenForAuthChangesAction,
} from './actions';
import AddCard from './customComponents/AddCard';
import WordCard from './customComponents/WordCard';
import NavigationBar from './customComponents/NavigationBar';
import './App.css';

class App extends Component {
  componentDidMount() {
    const { listenForAuthChanges } = this.props;
    listenForAuthChanges();
  }

  render() {
    const { dictionary } = this.props;

    return (
      <div className="App">
        <NavigationBar />
        <AddCard />
        {dictionary.map(entry => (
          <WordCard key={entry.id} entry={entry} />
        ))}
      </div>
    );
  }
}

App.propTypes = {
  dictionary: PropTypes.arrayOf(PropTypes.shape({
    word: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    definition: PropTypes.string.isRequired,
  })).isRequired,
  listenForAuthChanges: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  listenForAuthChanges: () => dispatch(listenForAuthChangesAction()),
  signIn: () => dispatch(signInAction()),
  signOut: () => dispatch(signOutAction()),
});

const mapStateToProps = state => ({
  dictionary: state.dictionary,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
