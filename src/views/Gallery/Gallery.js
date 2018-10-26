import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchDictionaryForUser as fetchDictionaryForUserAction } from '../../actions';
import { dictionaryType, userType } from '../../types';
import AddCard from '../../customComponents/AddCard';
import WordCard from '../../customComponents/WordCard';
import './Gallery.css';

class Gallery extends Component {
  constructor(props) {
    super(props);
    const { dictionary, user, fetchDictionaryForUser } = this.props;
    if (!dictionary.initialized) fetchDictionaryForUser(user);
  }

  render() {
    const { dictionary } = this.props;

    return (
      <div className="Gallery">
        <AddCard />
        {dictionary.data.map(entry => (
          <WordCard key={entry.id} entry={entry} />
        ))}
      </div>
    );
  }
}

Gallery.propTypes = {
  dictionary: dictionaryType.isRequired,
  fetchDictionaryForUser: PropTypes.func.isRequired,
  user: userType.isRequired,
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
