import React from 'react';
import SearchForm from '../../Search/SearchForm';
import { AutographaContext } from '../../AutogrpahaContext/AutographaContext';

const SearchData = () => {
  const filterList = ['name', 'language', 'date', 'view'];
  const {
    states: {
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
