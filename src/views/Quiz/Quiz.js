import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  nextWordFrom as nextWordFromAction,
  fetchDictionaryForUser as fetchDictionaryForUserAction,
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
    } = this.props;
    if (!dictionary.initialized) fetchDictionaryForUser(user);
    if (dictionary.data.length) nextWordFrom(dictionary.data);
  }

  componentDidUpdate(prevProps) {
    const { nextWordFrom, dictionary } = this.props;
    if (dictionary !== prevProps.dictionary && dictionary.initialized && dictionary.data.length) {
      nextWordFrom(dictionary.data);
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
    const { currentEntry, dictionary } = this.props;
    if (dictionary.initialized && !dictionary.data.length) return <Error message="No words in dictionary." />;
    if (!dictionary.initialized) return <Loading />;
    if (!currentEntry) return <p>Well done</p>;
    // TODO: Refactor this render
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
  user: PropTypes.shape({}).isRequired,
  fetchDictionaryForUser: PropTypes.func.isRequired,
  wordQueue: PropTypes.arrayOf(PropTypes.shape({
    word: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    definition: PropTypes.string.isRequired,
  })).isRequired,
  currentEntry: PropTypes.shape({
    word: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    definition: PropTypes.string.isRequired,
  }),
  nextWordFrom: PropTypes.func.isRequired,
};

Quiz.defaultProps = {
  currentEntry: null,
};

const mapStateToProps = state => ({
  currentEntry: state.quiz.currentEntry,
  wordQueue: state.quiz.wordQueue,
  dictionary: state.dictionary,
  user: state.user,
});


const mapDispatchToProps = dispatch => ({
  fetchDictionaryForUser: user => dispatch(fetchDictionaryForUserAction(user)),
  nextWordFrom: dictionary => dispatch(nextWordFromAction(dictionary)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Quiz);
