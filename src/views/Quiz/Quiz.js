// TODO: When no entries in the beginning
// TODO: When finish

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  nextWordFrom as nextWordFromAction,
  fetchDictionaryForUser as fetchDictionaryForUserAction,
  quizSetupFailed as quizSetupFailedAction
} from '../../actions';
import { Error, Loading } from '../genericViews';
import './Quiz.css';

const initialState = {
  submission: '',
  grade: null, // TODO: Maybe change that
};

class Quiz extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loadNextWord = this.loadNextWord.bind(this);
    this.revealWord = this.revealWord.bind(this);
  }

  componentDidMount() {
    const {
      nextWordFrom,
      dictionary,
      fetchDictionaryForUser,
      user,
      quizSetupFailed,
    } = this.props;
    if (dictionary.initialized) {
      if (dictionary.data.length) nextWordFrom(dictionary.data);
      else quizSetupFailed('Dictionary is empty');
    } else fetchDictionaryForUser(user);
  }

  componentDidUpdate(prevProps) {
    const { nextWordFrom, dictionary, quizSetupFailed } = this.props;
    if (dictionary !== prevProps.dictionary && dictionary.initialized) {
      if (dictionary.data.length) nextWordFrom(dictionary.data);
      else quizSetupFailed('Dictionary is empty');
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const { submission } = this.state;
    const { currentEntry } = this.props;
    const correctness = submission === currentEntry.definition;
    this.setState({ grade: correctness ? 'correct' : 'incorrect' });
  }

  handleChange(event) {
    const { value } = event.target;
    this.setState({ submission: value });
  }

  loadNextWord() {
    const { nextWordFrom, wordQueue } = this.props;
    nextWordFrom(wordQueue);
    this.setState(initialState);
  }

  revealWord() {
    const { currentEntry } = this.props;
    this.setState({ submission: currentEntry.definition });
  }

  render() {
    const { grade, submission } = this.state;
    const { currentEntry, quizInitialized, quizError } = this.props;
    if (quizError) return <Error />;
    if (!quizInitialized) return <Loading />;
    if (!currentEntry) return <p>Well done</p>;
    return (
      <div className={`QuizBox QuizBox--${grade}`}>
        {currentEntry
          ? (
            <form onSubmit={this.handleSubmit} className="AddWordForm">
              <h2>{currentEntry.word}</h2>
              <label htmlFor="definition">
                Definition:
                <input id="submission" name="submission" type="text" onChange={this.handleChange} value={submission} />
              </label>
              <input type="submit" value="Submit" />
              {
                (() => {
                  switch (grade) {
                    case 'correct':
                      return <button type="button" onClick={this.loadNextWord}>Next word!</button>;
                    case 'incorrect':
                      return <button type="button" onClick={this.revealWord}>Reveal!</button>;
                    default:
                      return null;
                  }
                })()
              }
            </form>
          ) : null
        }
      </div>
    );
  }
}

Quiz.propTypes = {
  dictionary: PropTypes.shape({
    fetching: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.shape({
      word: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      definition: PropTypes.string.isRequired,
    })),
    error: PropTypes.bool,
  }).isRequired,
  wordQueue: PropTypes.arrayOf(PropTypes.shape({
    word: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    definition: PropTypes.string.isRequired,
  })),
  currentEntry: PropTypes.shape({
    word: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    definition: PropTypes.string.isRequired,
  }),
  nextWordFrom: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  quizError: state.quiz.error,
  quizInitialized: state.quiz.initialized,
  currentEntry: state.quiz.currentEntry,
  wordQueue: state.quiz.wordQueue,
  dictionary: state.dictionary,
  user: state.user,
});


const mapDispatchToProps = dispatch => ({
  fetchDictionaryForUser: user => dispatch(fetchDictionaryForUserAction(user)),
  nextWordFrom: dictionary => dispatch(nextWordFromAction(dictionary)),
  quizSetupFailed: () => dispatch(quizSetupFailedAction()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Quiz);
