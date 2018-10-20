import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  nextWordFrom as nextWordFromAction,
  fetchDictionaryForUser as fetchDictionaryForUserAction,
} from '../../actions';
import { dictionaryType, userType, entryType } from '../../types';
import { Error, Loading } from '../genericViews';
import './Quiz.css';

const initialState = {
  submission: '',
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
    if (!currentEntry) return <h2>Well done</h2>;
    return (
      <div className={`QuizBox QuizBox--${grade}`}>
        {currentEntry
          ? (
            <form
              className="QuizBox-Form"
              onSubmit={this.handleSubmit}
            >
              <h2>{currentEntry.word}</h2>
              <input
                id="submission"
                autoCapitalize="none"
                className="QuizBox-Answer"
                name="submission"
                placeholder="Answer"
                type="text"
                onChange={this.handleChange}
                value={submission}
              />
              <input className="QuizBox-Submit" type="submit" value="Submit" />
              <NextStep
                grade={grade}
                loadNextWord={this.loadNextWord}
                revealWord={this.revealWord}
              />
            </form>
          ) : null
        }
      </div>
    );
  }
}

function NextStep({ grade, loadNextWord, revealWord }) {
  switch (grade) {
    case 'correct':
      return <button className="QuizBox-Next" type="button" onClick={loadNextWord}>Next word</button>;
    case 'incorrect':
      return <button className="QuizBox-Reveal" type="button" onClick={revealWord}>Reveal</button>;
    default:
      return null;
  }
}

Quiz.propTypes = {
  dictionary: dictionaryType.isRequired,
  user: userType.isRequired,
  fetchDictionaryForUser: PropTypes.func.isRequired,
  wordQueue: PropTypes.arrayOf(entryType).isRequired,
  currentEntry: entryType,
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
