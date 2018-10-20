import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { addWordAction } from '../../actions';
import Card from '../../genericComponents/Card';
import './AddCard.css';

const initialState = {
  word: '',
  type: 'noun',
  definition: '',
  backgroundColor: 'none',
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
    const {
      word,
      definition,
      type,
      backgroundColor,
    } = this.state;
    const colorPickerOptionBaseClass = 'AddWordForm-ColorPickerOption';
    return (
      <Card
        front={
          (
            <div>
              <h2 className="Word">+</h2>
            </div>
          )
        }
        back={
          (
            <div>
              <form onSubmit={this.handleSubmit} className="AddWordForm">
                <input
                  id="word"
                  autoCapitalize="none"
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
                <ul className="AddWordForm-ColorPicker">
                  <li>
                    <label
                      className={
                        classNames(
                          colorPickerOptionBaseClass,
                          `${colorPickerOptionBaseClass}--None`,
                          { [`${colorPickerOptionBaseClass}--Active`]: backgroundColor === 'none' },
                        )
                       }
                      htmlFor="backgroundNone"
                    >
                      <input
                        type="radio"
                        value="none"
                        name="backgroundColor"
                        id="backgroundNone"
                        onChange={this.handleChange}
                      />
                    </label>
                  </li>
                  <li>
                    <label
                      className={
                        classNames(
                          colorPickerOptionBaseClass,
                          `${colorPickerOptionBaseClass}--Red`,
                          { [`${colorPickerOptionBaseClass}--Active`]: backgroundColor === 'red' },
                        )
                       }
                      htmlFor="backgroundRed"
                    >
                      <input
                        type="radio"
                        value="red"
                        name="backgroundColor"
                        id="backgroundRed"
                        onChange={this.handleChange}
                      />
                    </label>
                  </li>
                  <li>
                    <label
                      className={
                        classNames(
                          colorPickerOptionBaseClass,
                          `${colorPickerOptionBaseClass}--Blue`,
                          { [`${colorPickerOptionBaseClass}--Active`]: backgroundColor === 'blue' },
                        )
                       }
                      htmlFor="backgroundBlue"
                    >
                      <input
                        type="radio"
                        value="blue"
                        name="backgroundColor"
                        id="backgroundBlue"
                        onChange={this.handleChange}
                      />
                    </label>
                  </li>
                  <li>
                    <label
                      className={
                        classNames(
                          colorPickerOptionBaseClass,
                          `${colorPickerOptionBaseClass}--Green`,
                          { [`${colorPickerOptionBaseClass}--Active`]: backgroundColor === 'green' },
                        )
                       }
                      htmlFor="backgroundGreen"
                    >
                      <input
                        type="radio"
                        value="green"
                        name="backgroundColor"
                        id="backgroundGreen"
                        onChange={this.handleChange}
                      />
                    </label>
                  </li>
                </ul>
              </form>
            </div>
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
