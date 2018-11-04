import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import {
  nextWordFrom as nextWordFromAction,
  startPractice as startPracticeAction,
  updateScore as updateScoreAction,
} from '../../actions';
import { dictionaryType, entryType } from '../../types';
import { Error, Loading } from '../genericViews';
import Result from './Result';

const initialState = {
  submission: '',
  hasUsedHint: false,
  grade: null,
};

const buttonBaseStyle = css`
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  padding: 8px 16px;
  border: none;
  text-align: center;
  border-radius: 18px;
  text-transform: uppercase;
  margin: 12px auto;
  color: #FFF;
`;

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

class Practice extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loadNextWord = this.loadNextWord.bind(this);
    this.revealWord = this.revealWord.bind(this);

    const {
      startPractice,
      nextWordFrom,
      dictionary,
    } = this.props;

    startPractice();
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
              <SubmitButton type="submit" value="Submit" />
              <NextStep
                grade={grade}
                loadNextWord={this.loadNextWord}
                revealWord={this.revealWord}
              />
            </Form>
          ) : null
        }
      </PracticeBox>
    );
  }
}

function NextStep({ grade, loadNextWord, revealWord }) {
  switch (grade) {
    case 'correct':
      return <NextButton type="button" onClick={loadNextWord}>Next word</NextButton>;
    case 'incorrect':
      return <RevealButton type="button" onClick={revealWord}>Reveal</RevealButton>;
    default:
      return null;
  }
}

Practice.propTypes = {
  dictionary: dictionaryType.isRequired,
  wordQueue: PropTypes.arrayOf(entryType).isRequired,
  currentEntry: entryType,
  nextWordFrom: PropTypes.func.isRequired,
  startPractice: PropTypes.func.isRequired,
  attempted: PropTypes.number.isRequired,
  correct: PropTypes.number.isRequired,
  updateScore: PropTypes.func.isRequired,
};

Practice.defaultProps = {
  currentEntry: null,
};

const mapStateToProps = state => ({
  currentEntry: state.practice.currentEntry,
  wordQueue: state.practice.wordQueue,
  dictionary: state.dictionary,
  attempted: state.practice.attempted,
  correct: state.practice.correct,
});


const mapDispatchToProps = dispatch => ({
  startPractice: () => dispatch(startPracticeAction()),
  nextWordFrom: dictionary => dispatch(nextWordFromAction(dictionary)),
  updateScore: (attempted, correct) => dispatch(updateScoreAction({ attempted, correct })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Practice);
