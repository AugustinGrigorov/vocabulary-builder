import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addWordAction } from '../../actions';
import Card from '../../genericComponents/Card';
import './AddCard.css';

const initialState = {
  word: '',
  type: 'noun',
  definition: '',
};

class AddCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    const { addWord, user } = this.props;
    e.preventDefault();
    addWord({ word: this.state, user });
    this.setState(initialState);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  }

  render() {
    const { word, definition, type } = this.state;
    return (
      <Card
        front={
          <h2 className="Word">+</h2>
        }
        back={
          (
            <form onSubmit={this.handleSubmit} className="AddWordForm">
              <input
                id="word"
                className="AddWordForm-Input"
                name="word"
                type="text"
                placeholder="Type word"
                value={word}
                onChange={this.handleChange}
              />
              <select
                id="type"
                className="AddWordForm-Select"
                name="type"
                value={type}
                onChange={this.handleChange}
              >
                <option value="noun">noun</option>
                <option value="verb">verb</option>
                <option value="adjective">adjective</option>
                <option value="adverb">adverb</option>
                <option value="other">other</option>
              </select>
              <input
                id="definition"
                className="AddWordForm-Input"
                name="definition"
                type="text"
                placeholder="Enter definition"
                value={definition}
                onChange={this.handleChange}
              />
              <input className="AddWordForm-Submit" type="submit" value="Submit" />
            </form>
          )
        }
      />
    );
  }
}

AddCard.propTypes = {
  user: PropTypes.shape({}),
  addWord: PropTypes.func.isRequired,
};

AddCard.defaultProps = {
  user: null,
};

const mapStateToProps = state => ({
  words: state.words,
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  addWord: payload => dispatch(addWordAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddCard);
