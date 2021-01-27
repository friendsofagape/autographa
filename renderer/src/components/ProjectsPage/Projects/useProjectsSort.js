import React, { useEffect } from 'react';
import * as logger from '../../../logger';

function useProjectsSort() {
  const [starredrow, setStarredRow] = React.useState();
  const [unstarredrow, setUnStarredRow] = React.useState();
  const [temparray, settemparray] = React.useState(null);
  const [active, setactive] = React.useState('');
  const [orderUnstarred, setOrderUnstarred] = React.useState('asc');
  const [orderByUnstarred, setOrderByUnstarred] = React.useState('name');

  const handleClickStarred = (event, name, property) => {
    logger.debug('project.js', 'calling starred to be unstarred and viceversa');
    property === 'starred' ? setactive('starred') : setactive('unstarred');
    const selectedIndex = property === 'starred'
      ? starredrow.findIndex((x) => x.name === name)
      : unstarredrow.findIndex((x) => x.name === name);
    const copy = property === 'starred'
      ? starredrow.splice(selectedIndex, 1)
      : unstarredrow.splice(selectedIndex, 1);
    settemparray(copy[0]);
  };

  const handleRequestSortUnstarred = (event, property) => {
    logger.debug(
      'project.js',
      `calling unstarred stable sort with value of orderBy=${property}`,
    );
    const isAsc = orderByUnstarred === property && orderUnstarred === 'asc';
    setOrderUnstarred(isAsc ? 'desc' : 'asc');
    setOrderByUnstarred(property);
  };

  const handleDelete = (event, name, property) => {
    logger.debug('project.js', 'calling handleDelete event');
    const selectedIndex = property === 'starred'
      ? starredrow.findIndex((x) => x.name === name)
      : unstarredrow.findIndex((x) => x.name === name);
    logger.debug('project.js', `removing the element with name=${name}`);
    /* eslint no-unused-expressions: ["error", { "allowTernary": true }] */
    property === 'starred'
      ? (starredrow.splice(selectedIndex, 1))
      : (unstarredrow.splice(selectedIndex, 1));
    handleRequestSortUnstarred('asc', 'view');
  };

  // eslint-disable-next-line
    useEffect(() => {
    if (temparray) {
      active === 'starred'
        ? unstarredrow.push(temparray)
        : starredrow.push(temparray);
    }
    handleRequestSortUnstarred('asc', 'view');
    // eslint-disable-next-line
      }, [temparray, active]);

  const response = {
    state: {
      starredrow,
      unstarredrow,
      orderUnstarred,
      orderByUnstarred,
    },
    actions: {
      handleClickStarred,
      handleDelete,
      handleRequestSortUnstarred,
      setStarredRow,
      setUnStarredRow,
      settemparray,
      setactive,
      setOrderUnstarred,
      setOrderByUnstarred,
    },
  };
  return response;
}
export default useProjectsSort;
