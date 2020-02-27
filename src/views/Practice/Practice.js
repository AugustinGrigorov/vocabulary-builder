import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { buttonBaseStyle } from '../../genericComponents/styles';

import {
  nextWord as nextWordAction,
  startPractice as startPracticeAction,
  updateScore as updateScoreAction,
  recordAttempt as recordAttemptAction,
} from '../../actions';
import { dictionaryType, entryType, userType } from '../../types';

import { Error, Loading } from '../genericViews';
import Result from './Result';

const initialState = {
  submission: '',
  hasUsedHint: false,
  grade: null,
};

const NextButton = styled.button`
  ${buttonBaseStyle}
  background: #0091EA;
`;

const RevealButton = styled.button`
  ${buttonBaseStyle}
  background: #EF6C00;
`;

const SubmitButton = styled.input`
  ${buttonBaseStyle}
  appearance: none;
  background: #388E3C;
`;

const PracticeBox = styled.div`
  max-width: 480px;
  margin: 24px auto;
  padding: 10px;
  border-radius: 4px;
  border: 2px solid;
  background-color: ${(props) => {
    switch (props.grade) {
      case 'correct':
        return '#00E676';
      case 'incorrect':
        return '#EF9A9A';
      default:
        return null;
    }
  }};
  border-color: ${(props) => {
    switch (props.grade) {
      case 'correct':
        return '#00C853';
      case 'incorrect':
        return '#E57373';
      default:
        return '#9E9E9E';
    }
  }};

  @media (max-width: 520px) {
    margin: 10px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 75%;
  margin: auto;
`;

const Answer = styled.input`
  font-size: 16px;
  border: none;
  border-bottom: 2px solid;
  padding: 4px;
  text-align: center;
  border-radius: 0;
  outline: none;
  border-color: ${(props) => {
    switch (props.grade) {
      case 'correct':
        return '#00C853';
      case 'incorrect':
        return '#E57373';
      default:
        return '#455A64';
    }
  }}
`;

function isCorrect(entry, definition) {
  const lowercaseDefinition = definition.toLowerCase();
  const definitionComponents = lowercaseDefinition.split(/,\s|,/g);
  return definitionComponents.some((component) => (
    component === entry.toLowerCase()
  ));
}

function isCorrect(entry, definition) {
  const lowercaseDefinition = definition.toLowerCase();
  const definitionComponents = lowercaseDefinition.split(/,\s|,/g);
  return definitionComponents.some((component) => (
    component === entry.toLowerCase()
  ));
}

class Practice extends Component {
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
      startPractice,
      dictionary,
    } = this.props;

    if (dictionary.data.length) startPractice();
  }

  componentDidUpdate(prevProps) {
    const {
      startPractice,
      dictionary,
    } = this.props;

    if (!prevProps.dictionary.data.length && dictionary.initialized && dictionary.data.length) {
      startPractice();
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const { submission } = this.state;
    const { currentEntry, recordAttempt, user } = this.props;
    const correctness = isCorrect(submission, currentEntry.definition);
    recordAttempt(user.details.uid, currentEntry.id, correctness);
    this.setState({ grade: correctness ? 'correct' : 'incorrect' });
  }

  handleChange(event) {
    const { value } = event.target;
    this.setState({ submission: value });
  }

  loadNextWord() {
    const {
      nextWord,
      attempted,
      correct,
      updateScore,
    } = this.props;
    const {
      hasUsedHint,
    } = this.state;
    const newScore = hasUsedHint ? correct : correct + 1;

    updateScore(attempted + 1, newScore);
    nextWord();
    this.setState(initialState);
  }

  revealWord() {
    const { currentEntry } = this.props;
    this.setState({ submission: currentEntry.definition, hasUsedHint: true });
  }

  render() {
    const { grade, submission, hasUsedHint } = this.state;
    const {
      currentEntry,
      dictionary,
      attempted,
      correct,
    } = this.props;
    if (!dictionary.initialized) return <Loading />;
    if (dictionary.initialized && !dictionary.data.length) return <Error message="No words in dictionary." />;
    if (!currentEntry) return <Result attempted={attempted} correct={correct} />;
    return (
      <PracticeBox grade={grade}>
        {currentEntry
          ? (
            <Form
              onSubmit={this.handleSubmit}
            >
              <h2>{currentEntry.word}</h2>
              <Answer
                id="submission"
                grade={grade}
                autoCapitalize="none"
                name="submission"
                placeholder="Answer"
                type="text"
                onChange={this.handleChange}
                value={submission}
              />
              {!(hasUsedHint || grade === 'correct') ? (
                <SubmitButton type="submit" value="Submit" />
              ) : null}
              <NextStep
                hasUsedHint={hasUsedHint}
                grade={grade}
                loadNextWord={this.loadNextWord}
                revealWord={this.revealWord}
              />
            </Form>
          ) : null}
      </PracticeBox>
    );
  }
}

function NextStep({
  grade,
  loadNextWord,
  revealWord,
  hasUsedHint,
}) {
  if (grade === 'correct' || hasUsedHint) {
    return <NextButton type="submit" onClick={loadNextWord}>Next word</NextButton>;
  }
  if (grade === 'incorrect') {
    return <RevealButton type="button" onClick={revealWord}>Reveal</RevealButton>;
  }
  return null;
}

Practice.propTypes = {
  dictionary: dictionaryType.isRequired,
  currentEntry: entryType,
  nextWord: PropTypes.func.isRequired,
  startPractice: PropTypes.func.isRequired,
  attempted: PropTypes.number.isRequired,
  correct: PropTypes.number.isRequired,
  updateScore: PropTypes.func.isRequired,
  user: userType.isRequired,
  recordAttempt: PropTypes.func.isRequired,
};

Practice.defaultProps = {
  currentEntry: null,
};

NextStep.propTypes = {
  grade: PropTypes.string,
  loadNextWord: PropTypes.func.isRequired,
  revealWord: PropTypes.func.isRequired,
  hasUsedHint: PropTypes.bool.isRequired,
};

NextStep.defaultProps = {
  grade: null,
};

const mapStateToProps = (state) => ({
  currentEntry: state.practice.wordQueue[state.practice.currentEntryIndex],
  dictionary: state.dictionary,
  attempted: state.practice.attempted,
  correct: state.practice.correct,
  user: state.user,
});


const mapDispatchToProps = (dispatch) => ({
  startPractice: (wordQueue) => dispatch(startPracticeAction(wordQueue)),
  nextWord: () => dispatch(nextWordAction()),
  updateScore: (attempted, correct) => dispatch(updateScoreAction({ attempted, correct })),
  recordAttempt: (
    userId,
    entryId,
    correct,
  ) => dispatch(recordAttemptAction({ userId, entryId, correct })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Practice);
