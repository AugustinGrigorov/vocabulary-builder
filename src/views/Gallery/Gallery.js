import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchDictionaryForUser as fetchDictionaryForUserAction } from '../../actions';
import AddCard from '../../customComponents/AddCard';
import WordCard from '../../customComponents/WordCard';

class Gallery extends Component {
  componentDidMount() {
    const { dictionary, user, fetchDictionaryForUser } = this.props;
    if (!dictionary.initialized) fetchDictionaryForUser(user);
  }

  render() {
    const { dictionary } = this.props;

    // TODO: Make this show when it's loading and add words to the state before sending network request.

    return (
      <div>
        <AddCard />
        {dictionary.data.map(entry => (
          <WordCard key={entry.id} entry={entry} />
        ))}
      </div>
    );
  }
}

Gallery.propTypes = {
  dictionary: PropTypes.shape({
    fetching: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.shape({
      word: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      definition: PropTypes.string.isRequired,
    })),
    error: PropTypes.bool,
  }).isRequired,
};

const mapStateToProps = state => ({
  dictionary: state.dictionary,
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  fetchDictionaryForUser: user => dispatch(fetchDictionaryForUserAction(user)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Gallery);
