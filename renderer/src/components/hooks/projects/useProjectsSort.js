import React, { useEffect } from 'react';
import * as localForage from 'localforage';
import parseProjectMetaUpdate from '../../../core/projects/parseProjectMetaUpdate';
import metaFileReplace from '../../../core/projects/metaFileReplace';
import { isElectron } from '../../../core/handleElectron';
import fetchProjectsMeta from '../../../core/projects/fetchProjectsMeta';
import parseFetchProjects from '../../../core/projects/parseFetchProjects';
// import parseFileUpdate from '../../../core/projects/parseFileUpdate';
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
  const [selectedProject, setSelectedProject] = React.useState('');
  const starrtedData = [];
  const unstarrtedData = [];
  const username = 'Michael';

  const handleClickStarred = (event, name, property) => {
    logger.debug('project.js', 'converting starred to be unstarred and viceversa');
    property === 'starred' ? setactive('starred') : setactive('unstarred');
    const selectedIndex = property === 'starred'
      ? starredrow.findIndex((x) => x.name === name)
      : unstarredrow.findIndex((x) => x.name === name);
    const copy = property === 'starred'
      ? starredrow.splice(selectedIndex, 1)
      : unstarredrow.splice(selectedIndex, 1);
      const projectArrayTemp = [];
      if (isElectron()) {
      const projects = localForage.getItem('projectmeta');
      projects.then((value) => {
        if (value) {
          projectArrayTemp.push(value);
        }
      }).then(() => {
        projectArrayTemp[0].projects.forEach((project) => {
          if (project.identification.name.en === name) {
            const status = project.starred;
            const selectedProject = project;
            selectedProject.starred = !status;
          }
        });
      }).finally(() => {
        localForage.setItem('projectmeta', projectArrayTemp[0])
        .then(() => {
            metaFileReplace({ userData: projectArrayTemp[0] });
        });
      });
    } else {
      parseProjectMetaUpdate({
        username,
        projectName: name,
      });
    }
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

    const createData = (name, language, date, view, description) => ({
      name, language, date, view, description,
    });

    const FetchStarred = (ProjectName, Language, createdAt, LastView, ProjectDescription) => {
      starrtedData.push(createData(
        ProjectName,
        Language,
        createdAt,
        LastView,
        ProjectDescription,
      ));
    };

    const FetchUnstarred = (ProjectName, Language, createdAt, LastView, ProjectDescription) => {
      unstarrtedData.push(createData(
        ProjectName,
        Language,
        createdAt,
        LastView,
        ProjectDescription,
      ));
    };

    const FetchProjects = async () => {
      if (isElectron()) {
        const projectsData = fetchProjectsMeta();
        projectsData.then((value) => {
          if (value) {
            localForage.setItem('projectmeta', value)
            .then(() => {
              localForage.getItem('projectmeta')
              .then((value) => {
                if (value) {
                  value.projects.forEach((project) => {
                    const created = Object.keys(project.identification.primary.ag);
                    if (project.Editor?.starred === true) {
                      // FetchStarred(projectName,language, createdAt, updatedAt);
                      FetchStarred(project.identification.name.en, project.languages[0].name.en,
                        project.identification.primary.ag[created].timestamp,
                        project.Editor.LastSeen, project.Editor.Description);
                    } else {
                      FetchUnstarred(project.identification.name.en, project.languages[0].name.en,
                        project.identification.primary.ag[created].timestamp,
                        project.Editor?.LastSeen, project.Editor?.Description);
                    }
                  });
                }
              }).then(() => {
                setStarredRow(starrtedData);
                setStarredProjets(starrtedData);
                setUnStarredRow(unstarrtedData);
                setUnStarredProjets(unstarrtedData);
              });
            })
            .catch((err) => {
              // we got an error
              throw err;
            });
          }
        });
      } else {
        // const projectName = 'Newcanon based Pro';
        parseFetchProjects(username).then((res) => {
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
        selectedProject,
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
        setSelectedProject,
      },
    };
  return response;
}
export default useProjectsSort;
