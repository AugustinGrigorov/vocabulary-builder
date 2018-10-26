import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { addEntry as addEntryAction } from '../../actions';
import Card from '../../genericComponents/Card';
import './AddCard.css';

const initialState = {
  entry: {
    word: '',
    definition: '',
    example: '',
    type: 'noun',
    backgroundColor: 'none',
  },
  invalidInputFields: [],
};

function validateEntry(entry) {
  return Object.keys(entry).filter(field => !entry[field].length);
}

class AddCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    const { addEntry, user } = this.props;
    const { entry } = this.state;
    e.preventDefault();
    const invalidInputFields = validateEntry(entry);
    if (!invalidInputFields.length) {
      addEntry({ entry, user });
      this.setState(initialState);
    } else {
      this.setState({ invalidInputFields });
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { entry } = this.state;
    this.setState({
      entry: {
        ...entry,
        [name]: value,
      },
    });
  }

  render() {
    const {
      entry,
      invalidInputFields,
    } = this.state;
    const {
      word,
      definition,
      example,
      type,
      backgroundColor,
    } = entry;
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
                  className={classNames(
                    'AddWordForm-Input',
                    { 'AddWordForm-Input--WithError': invalidInputFields.includes('word') },
                  )}
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
                  className={classNames(
                    'AddWordForm-Input',
                    { 'AddWordForm-Input--WithError': invalidInputFields.includes('definition') },
                  )}
                  name="definition"
                  type="text"
                  placeholder="Enter definition"
                  value={definition}
                  onChange={this.handleChange}
                />
                <input
                  id="example"
                  className={classNames(
                    'AddWordForm-Input',
                    { 'AddWordForm-Input--WithError': invalidInputFields.includes('example') },
                  )}
                  name="example"
                  type="text"
                  placeholder="Enter an example"
                  value={example}
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
  addEntry: PropTypes.func.isRequired,
};

AddCard.defaultProps = {
  user: null,
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  addEntry: payload => dispatch(addEntryAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddCard);
