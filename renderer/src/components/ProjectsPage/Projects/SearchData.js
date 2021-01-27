import React from 'react';
import PropTypes from 'prop-types';
import SearchForm from '../../Search/SearchForm';

const SearchData = ({ onfilerRequest1, onfilerRequest2 }) => {
  function createData(name, language, date, view) {
    return {
      name, language, date, view,
    };
  }
  const starrtedData = [
    createData(
      'Project Arabic',
      'Arabic(arb)',
      '22 Apr 2020',
      '2021-01-15 14:33:26',
    ),
    createData(
      'Hindi New Testment',
      'Hindi(hin)',
      '21 may 2020',
      '2020-09-13 14:33:26',
    ),
    createData(
      'English NIV',
      'English(eng)',
      '2 May 2020',
      '2020-08-29 14:33:26',
    ),
    createData(
      'Kannada Revised',
      'kannada(knd)',
      '31 Jun 2021',
      '2020-01-15 14:33:26',
    ),
    createData(
      'new Malayalam',
      'Malayalam(mal)',
      '04 Jul 2020',
      '2020-03-15 6:33:26',
    ),
    createData(
      'New Testment Oriya',
      'Oriya(or)',
      '23 Feb 2010',
      '2018-04-21 8:33:26',
    ),
    createData(
      'English Old',
      'English(eng)',
      '17 Dec 2029',
      '2018-04-21 8:33:26',
    ),
  ];
  const unstarrtedData = [
    createData(
      'Project Malayalam',
      'Malayalam(mal)',
      '21 Mar 2021',
      '2020-09-15 14:33:26',
    ),
    createData(
      'Spanish Project',
      'Spanish(spa)',
      '1 Sep 2019',
      '2021-01-24 14:33:26',
    ),
    createData('Arabic', 'Arabic(arb)', '2 Aug 2020', '2020-05-15 14:34:26'),
    createData('Tamil IRV', 'Tamil(tml)', '15 Aug 2018', '2018-04-21 8:33:26'),
  ];
  const filterList = ['name', 'language', 'date', 'view'];

  React.useEffect(() => {
    onfilerRequest1(starrtedData);
    onfilerRequest2(unstarrtedData);
  }, []);

  return (
    <div>
      <SearchForm
        contentList1={starrtedData}
        contentList2={unstarrtedData}
        filterList={filterList}
        onfilerRequest1={onfilerRequest1}
        onfilerRequest2={onfilerRequest2}
      />
    </div>
  );
};

export default SearchData;

SearchData.propTypes = {
  onfilerRequest1: PropTypes.func,
  onfilerRequest2: PropTypes.func,
};
