import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { fetchDictionaryForUser as fetchDictionaryForUserAction } from '../../actions';
import { dictionaryType, entryType, userType } from '../../types';
import AddCard from '../../customComponents/AddCard';
import WordCard from '../../customComponents/WordCard';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  @media (max-width: 520px) {
    justify-content: center;
  }
`;

class Gallery extends Component {
  constructor(props) {
    super(props);
    const { dictionary, user, fetchDictionaryForUser } = this.props;
    if (!dictionary.initialized) fetchDictionaryForUser(user);
  }

  render() {
    const { dictionary, entryAdditionQueue, entryDeletionQueueIds } = this.props;

    return (
      <Container>
        <AddCard />
        {dictionary.data.map(entry => (
          <WordCard
            key={entry.id}
            entry={entry}
            queued={entryDeletionQueueIds.includes(entry.id)}
          />
        ))}
        {entryAdditionQueue.map(entry => (
          <WordCard key={entry.id} entry={entry} queued />
        ))}
      </Container>
    );
  }
}

Gallery.propTypes = {
  dictionary: dictionaryType.isRequired,
  entryAdditionQueue: PropTypes.arrayOf(entryType).isRequired,
  entryDeletionQueueIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchDictionaryForUser: PropTypes.func.isRequired,
  user: userType.isRequired,
};

const mapStateToProps = state => ({
  dictionary: state.dictionary,
  entryAdditionQueue: state.gallery.entryAdditionQueue,
  entryDeletionQueueIds: state.gallery.entryDeletionQueueIds,
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  fetchDictionaryForUser: user => dispatch(fetchDictionaryForUserAction(user)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Gallery);
