import React from 'react';
import PropTypes from 'prop-types';
import SearchForm from '../../Search/SearchForm';
import { AutographaContext } from '../../AutogrpahaContext/AutographaContext';

const SearchData = () => {
  const filterList = ['name', 'language', 'date', 'view'];
  const {
    states: {
      starredrow,
      unstarredrow,
      starredProjects,
      unstarredProjects,
    },
    action: {
      setStarredRow,
      setUnStarredRow,
    },
  } = React.useContext(AutographaContext);

  return (
    <div>
      <SearchForm
        contentList1={starredProjects}
        contentList2={unstarredProjects}
        filterList={filterList}
        onfilerRequest1={setStarredRow}
        onfilerRequest2={setUnStarredRow}
      />
    </div>
  );
};

export default SearchData;

SearchData.propTypes = {
  onfilerRequest1: PropTypes.func,
  onfilerRequest2: PropTypes.func,
};
