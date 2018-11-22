import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { dictionaryType, entryType } from '../../types';
import AddCard from '../../customComponents/AddCard';
import WordCard from '../../customComponents/WordCard';

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  @media (max-width: 520px) {
    justify-content: center;
  }
`;

const Search = styled.div`
  display: flex;
  flex-direction: row;
  margin: 24px auto;
  width: 240px;
  border-bottom: 2px solid #455A64;
`;

const SearchInput = styled.input`
  width: 100%;
  font-size: 18px;
  padding: 4px;
  border: none;
  outline: none;
  appearance: none;
`;

const SearchIcon = styled(FontAwesomeIcon)`
  font-size: 18px;
  padding: 4px;
  justify-self: center;
  align-self: center;
`;

const Message = styled.h2`
  margin: auto;
  text-align: center;
`;

function filterEntriesOnSearchTerm(entries, searchTerm) {
  const searchRegex = new RegExp(searchTerm, 'i');
  return entries.filter(entry => searchRegex.test(entry.word));
}

class Learn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
    };
  }

  render() {
    const { dictionary, entryAdditionQueue, entryDeletionQueueIds } = this.props;
    const { searchTerm } = this.state;

    const committedEntires = filterEntriesOnSearchTerm(dictionary.data, searchTerm);
    const pendingEntries = filterEntriesOnSearchTerm(entryAdditionQueue, searchTerm);
    const noResults = searchTerm.length && !(committedEntires.length + pendingEntries.length);

    return (
      <Fragment>
        <Search>
          <SearchInput
            id="searchTerm"
            autoCapitalize="none"
            name="searchTerm"
            type="search"
            placeholder="Search"
            value={searchTerm}
            onChange={event => this.setState({ searchTerm: event.target.value })}
          />
          <SearchIcon icon="search" />
        </Search>
        <CardContainer>
          {!searchTerm.length ? <AddCard /> : null}
          {committedEntires.map(entry => (
            <WordCard
              key={entry.id}
              entry={entry}
              queued={entryDeletionQueueIds.includes(entry.id)}
            />
          ))}
          {pendingEntries.map(entry => (
            <WordCard key={entry.id} entry={entry} queued />
          ))}
        </CardContainer>
        {noResults ? <Message>No results</Message> : null}
      </Fragment>
    );
  }
}

Learn.propTypes = {
  dictionary: dictionaryType.isRequired,
  entryAdditionQueue: PropTypes.arrayOf(entryType).isRequired,
  entryDeletionQueueIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = state => ({
  dictionary: state.dictionary,
  entryAdditionQueue: state.learn.entryAdditionQueue,
  entryDeletionQueueIds: state.learn.entryDeletionQueueIds,
  user: state.user,
});

export default connect(
  mapStateToProps,
)(Learn);
