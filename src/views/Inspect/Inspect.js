import React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { dictionaryType } from '../../types';
import 'react-table/react-table.css';

const columns = [{
  Header: 'Word',
  accessor: 'word',
}, {
  Header: 'Type',
  accessor: 'type',
}, {
  Header: 'Definition',
  accessor: 'definition',
}, {
  Header: 'Example',
  accessor: 'example',
}];

function Inspect({ dictionary }) {
  return (
    <ReactTable
      data={dictionary.data}
      columns={columns}
    />
  );
}

Inspect.propTypes = {
  dictionary: dictionaryType.isRequired,
};

const mapStateToProps = state => ({
  dictionary: state.dictionary,
});

export default connect(
  mapStateToProps,
)(Inspect);
