import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addEntry as addEntryAction } from '../../actions';
import Card from '../../genericComponents/Card';

const Word = styled.h2`
  letter-spacing: 1px;
`;

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

const AddIcon = styled(FontAwesomeIcon)`
  color: #4CAF50;
  font-size: 32px;
`;

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

const colorOptions = [
  'none',
  'red',
  'blue',
  'green',
];

function validateEntryData(entryData) {
  return Object.keys(entryData).filter((field) => !entryData[field].length);
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
    const { entryData } = this.state;
    e.preventDefault();
    const invalidInputFields = validateEntryData(entryData);
    if (!invalidInputFields.length) {
      addEntry({ entryData, userId: user.details.uid });
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

    return (
      <Card
        front={<Word><AddIcon icon="plus-circle" /></Word>}
        back={
          (
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
                <Submit type="submit" value="Submit" />
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

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  addEntry: (payload) => dispatch(addEntryAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddCard);
