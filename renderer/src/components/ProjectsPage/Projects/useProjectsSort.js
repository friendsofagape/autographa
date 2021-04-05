import React, { useEffect } from 'react';
import { isElectron } from '../../../core/handleElectron';
import fetchProjectsMeta from '../../../core/projects/fetchProjectsMeta';
import parseFetchProjects from '../../../core/projects/parseFetchProjects';
import * as logger from '../../../logger';

function useProjectsSort() {
  const [starredrow, setStarredRow] = React.useState('');
  const [unstarredrow, setUnStarredRow] = React.useState('');
  const [temparray, settemparray] = React.useState(null);
  const [active, setactive] = React.useState('');
  const [orderUnstarred, setOrderUnstarred] = React.useState('asc');
  const [orderByUnstarred, setOrderByUnstarred] = React.useState('name');
  const [starredProjects, setStarredProjets] = React.useState();
  const [unstarredProjects, setUnStarredProjets] = React.useState();
  const starrtedData = [];
  const unstarrtedData = [];

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

    const createData = (name, language, date, view) => ({
          name, language, date, view,
    });

    const FetchStarred = (ProjectName, Language, createdAt, LastView) => {
      starrtedData.push(createData(
        ProjectName,
        Language,
        createdAt,
        LastView,
      ));
    };

    const FetchUnstarred = (ProjectName, Language, createdAt, LastView) => {
      unstarrtedData.push(createData(
        ProjectName,
        Language,
        createdAt,
        LastView,
      ));
    };

    const FetchProjects = () => {
      if (isElectron()) {
        const projectsData = fetchProjectsMeta();
        if (projectsData) {
          projectsData.then((value) => {
          value.projects.forEach((project) => {
            if (project.starred === true) {
                FetchStarred(project.projectName,
                  project.language, project.createdAt, project.updatedAt);
            } else {
              FetchUnstarred(project.projectName,
                project.language, project.createdAt, project.updatedAt);
            }
          });
        }).finally(() => {
          setStarredRow(starrtedData);
          setStarredProjets(starrtedData);
          setUnStarredRow(unstarrtedData);
          setUnStarredProjets(unstarrtedData);
        });
      }
      } else {
        parseFetchProjects().then((res) => {
          res.forEach((projects) => {
              if (projects.get('starred') === true) {
                FetchStarred(
                projects.get('projectName'),
                projects.get('language'),
                projects.get('date'),
                projects.get('lastview'),
                );
              } else {
                FetchUnstarred(
                    projects.get('projectName'),
                    projects.get('language'),
                    projects.get('date'),
                    projects.get('lastview'),
                );
              }
          });
        }).finally(() => {
            setStarredRow(starrtedData);
            setStarredProjets(starrtedData);
            setUnStarredRow(unstarrtedData);
            setUnStarredProjets(unstarrtedData);
        });
       }
    };

    React.useEffect(() => {
      FetchProjects();
      // eslint-disable-next-line
    }, []);

    const response = {
      state: {
        starredrow,
        unstarredrow,
        orderUnstarred,
        orderByUnstarred,
        starredProjects,
        unstarredProjects,
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
        FetchProjects,
      },
    };
  return response;
}
export default useProjectsSort;
