import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  nextWordFrom as nextWordFromAction,
  fetchDictionaryForUser as fetchDictionaryForUserAction,
  startQuiz as startQuizAction,
  updateScore as updateScoreAction,
} from '../../actions';
import { dictionaryType, userType, entryType } from '../../types';
import { Error, Loading } from '../genericViews';
import './Quiz.css';

const initialState = {
  submission: '',
  hasUsedHint: false,
  grade: null,
};

class Quiz extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loadNextWord = this.loadNextWord.bind(this);
    this.revealWord = this.revealWord.bind(this);

    const {
      startQuiz,
      nextWordFrom,
      dictionary,
      fetchDictionaryForUser,
      user,
    } = this.props;

    startQuiz();
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
    const {
      nextWordFrom,
      wordQueue,
      attempted,
      correct,
      updateScore,
    } = this.props;
    const {
      hasUsedHint,
    } = this.state;
    const newScore = hasUsedHint ? correct : correct + 1;

    updateScore(attempted + 1, newScore);
    nextWordFrom(wordQueue);
    this.setState(initialState);
  }

  revealWord() {
    const { currentEntry } = this.props;
    this.setState({ submission: currentEntry.definition, hasUsedHint: true });
  }

  render() {
    const { grade, submission } = this.state;
    const {
      currentEntry,
      dictionary,
      attempted,
      correct,
    } = this.props;
    if (dictionary.initialized && !dictionary.data.length) return <Error message="No words in dictionary." />;
    if (!dictionary.initialized) return <Loading />;
    if (!currentEntry) {
      // TODO: Extract this into its own component
      return (
        <div>
          <h2>Well done</h2>
          <p>
            {`You got ${correct} out of ${attempted} right.`}
          </p>
        </div>
      );
    }
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
  startQuiz: PropTypes.func.isRequired,
  attempted: PropTypes.number.isRequired,
  correct: PropTypes.number.isRequired,
  updateScore: PropTypes.func.isRequired,
};

Quiz.defaultProps = {
  currentEntry: null,
};

const mapStateToProps = state => ({
  currentEntry: state.quiz.currentEntry,
  wordQueue: state.quiz.wordQueue,
  dictionary: state.dictionary,
  user: state.user,
  attempted: state.quiz.attempted,
  correct: state.quiz.correct,
});


const mapDispatchToProps = dispatch => ({
  startQuiz: () => dispatch(startQuizAction()),
  fetchDictionaryForUser: user => dispatch(fetchDictionaryForUserAction(user)),
  nextWordFrom: dictionary => dispatch(nextWordFromAction(dictionary)),
  updateScore: (attempted, correct) => dispatch(updateScoreAction({ attempted, correct })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Quiz);
