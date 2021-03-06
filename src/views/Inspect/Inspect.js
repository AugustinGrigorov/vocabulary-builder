import React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import styled from 'styled-components/macro';


import { dictionaryType } from '../../types';

import 'react-table/react-table.css';

const Indicator = styled.div`
  background: ${({ strength }) => {
    if (strength > 1.75) {
      return '#30bd17';
    }
    if (strength > 1.5) {
      return '#e0d607';
    }
    if (strength > 1.25) {
      return '#c96710';
    }
    return '#9c1111';
  }};
  width: 8px;
  height: 8px;
  border-radius: 4px;
  margin: auto;
`;

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
}, {
  Header: 'Strength',
  id: 'strength',
  accessor: (row) => <Indicator strength={row.strength} />,
  sortMethod: (a, b) => a.props.strength - b.props.strength,
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

const mapStateToProps = (state) => ({
  dictionary: state.dictionary,
});

export default connect(
  mapStateToProps,
)(Inspect);
