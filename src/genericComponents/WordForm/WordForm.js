import React, { Component } from 'react';
import styled from 'styled-components/macro';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  addEntry as addEntryAction,
  editEntry as editEntryAction,
  finishEdit as finishEditAction,
} from '../../actions';
import { userType, entryType } from '../../types';

const From = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 32px;
`;

const Input = styled.input`
  font-size: 16px;
  padding: 4px;
  text-align: center;
  border: none;
  border-bottom: 2px solid;
  border-radius: 0;
  outline: none;
  border-color: ${(props) => (props.hasError ? '#E57373' : '#455A64')}
`;

const Select = styled.select`
  border: none;
  padding: 4px;
  font-size: 16px;
  background: #FFF;
  border: 1px solid #455A64;
`;

const ColorPicker = styled.ul`
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: row;
  padding: 0;
  justify-content: center;
`;

const ColorOption = styled.label`
  border: 2px solid;
  display: flex;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border-color: ${(props) => (props.isActive ? '#448AFF' : 'transparent')};
  margin: 0 2px;
  background: ${(props) => {
    switch (props.color) {
      case 'none':
        return 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAAI0lEQVQYV2O0sLD4zwAFJ06cYISxGUmXgGkF0ci64WYSLQEAGPMQ/LG7mdcAAAAASUVORK5CYII=) repeat';
      case 'red':
        return '#D32F2F';
      case 'blue':
        return '#388E3C';
      case 'green':
        return '#1976D2';
      default:
        return null;
    }
  }};

  & > input {
    display: none;
  }
`;

const CancelButton = styled.button`
  cursor: pointer;
  appearance: none;
  font-size: 16px;
  font-weight: bold;
  padding: 8px 16px;
  border: none;
  background: #000;
  color: #FFF;
  text-align: center;
  border-radius: 18px;
  text-transform: uppercase;
  margin: 0 auto;
`;

const CardControls = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const Submit = styled.input`
  cursor: pointer;
  appearance: none;
  font-size: 16px;
  font-weight: bold;
  padding: 8px 16px;
  border: none;
  background: #388E3C;
  color: #FFF;
  text-align: center;
  border-radius: 18px;
  text-transform: uppercase;
  margin: 0 auto;
`;
const colorOptions = [
  'none',
  'red',
  'blue',
  'green',
];

const initialState = {
  entryData: {
    word: '',
    definition: '',
    example: '',
    type: 'noun',
    theme: 'none',
  },
  invalidInputFields: [],
};

function validateEntryData(entryData) {
  const mandatoryFields = [
    'word',
    'type',
    'definition',
    'example',
  ];
  return Object.keys(entryData).filter((field) => mandatoryFields.includes(field)
    && !entryData[field].length);
}

class WordForm extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { entry } = this.props;
    if (entry) {
      this.setState({
        entryData: entry,
      });
    }
  }

  handleSubmit(e) {
    const {
      addEntry,
      editEntry,
      entry,
      user,
    } = this.props;
    const { entryData } = this.state;
    e.preventDefault();
    const invalidInputFields = validateEntryData(entryData);
    if (!invalidInputFields.length) {
      this.setState(initialState);
      if (entry) {
        editEntry({ oldEntry: entry, newEntry: entryData, userId: user.details.uid });
      } else {
        addEntry({ entryData, userId: user.details.uid });
      }
      this.setState(initialState);
    } else {
      this.setState({ invalidInputFields });
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { entryData } = this.state;

    this.setState({
      entryData: {
        ...entryData,
        [name]: value,
      },
    });
  }

  render() {
    const {
      entryData,
      invalidInputFields,
    } = this.state;

    const {
      word,
      definition,
      example,
      type,
      theme,
    } = entryData;

    const { entry, finishEdit } = this.props;

    return (
      <>
        <From onSubmit={this.handleSubmit}>
          <Input
            id="word"
            autoCapitalize="none"
            hasError={invalidInputFields.includes('word')}
            name="word"
            type="text"
            placeholder="Type word"
            value={word}
            onChange={this.handleChange}
          />
          <Select
            id="type"
            name="type"
            value={type}
            onChange={this.handleChange}
          >
            <option value="noun">noun</option>
            <option value="verb">verb</option>
            <option value="adjective">adjective</option>
            <option value="adverb">adverb</option>
            <option value="other">other</option>
          </Select>
          <Input
            id="definition"
            hasError={invalidInputFields.includes('definition')}
            name="definition"
            type="text"
            placeholder="Enter definition"
            value={definition}
            onChange={this.handleChange}
          />
          <Input
            id="example"
            hasError={invalidInputFields.includes('example')}
            name="example"
            type="text"
            placeholder="Enter an example"
            value={example}
            onChange={this.handleChange}
          />
          <CardControls>
            <Submit
              type="submit"
              value={entry ? 'Update' : 'Create'}
            />
            {entry ? (
              <CancelButton
                type="button"
                onClick={finishEdit}
              >
                Cancel
              </CancelButton>
            ) : null}
          </CardControls>
          <ColorPicker>
            {colorOptions.map((color) => (
              <li key={color}>
                <ColorOption
                  isActive={theme === color}
                  color={color}
                >
                  <input
                    type="radio"
                    value={color}
                    name="theme"
                    onChange={this.handleChange}
                  />
                </ColorOption>
              </li>
            ))}
          </ColorPicker>
        </From>
      </>
    );
  }
}

WordForm.propTypes = {
  user: userType,
  entry: entryType,
  addEntry: PropTypes.func.isRequired,
  editEntry: PropTypes.func.isRequired,
  finishEdit: PropTypes.func.isRequired,
};

WordForm.defaultProps = {
  user: null,
  entry: null,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  editEntry: (payload) => dispatch(editEntryAction(payload)),
  addEntry: (payload) => dispatch(addEntryAction(payload)),
  finishEdit: () => dispatch(finishEditAction()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WordForm);
