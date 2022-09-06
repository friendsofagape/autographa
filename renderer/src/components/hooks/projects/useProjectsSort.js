import React, { useEffect } from 'react';
import * as localForage from 'localforage';
import moment from 'moment';
import router from 'next/router';
import { updateAgSettings } from '../../../core/projects/updateAgSettings';
import parseProjectMetaUpdate from '../../../core/projects/parseProjectMetaUpdate';
// import metaFileReplace from '../../../core/projects/metaFileReplace';
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
  const [notifications, setNotifications] = React.useState([]);
  const [activeNotificationCount, setActiveNotificationCount] = React.useState(0);

  const starrtedData = [];
  const unstarrtedData = [];
  const username = 'Michael';

  useEffect(() => {
    if (notifications.length !== 0) {
      localForage.setItem('notification', notifications);
    }
    localForage.getItem('notification').then((val) => {
      if (val === null) {
        localForage.setItem('notification', []);
      }
    });
  }, [notifications]);

  const handleClickStarred = async (event, name, property) => {
    logger.debug('useProjectsSort.js', 'converting starred to be unstarred and viceversa');
    property === 'starred' ? setactive('starred') : setactive('unstarred');
    const selectedIndex = property === 'starred'
      ? starredrow.findIndex((x) => x.name === name)
      : unstarredrow.findIndex((x) => x.name === name);
    const copy = property === 'starred'
      ? starredrow.splice(selectedIndex, 1)
      : unstarredrow.splice(selectedIndex, 1);
      const projectArrayTemp = [];
    if (isElectron()) {
      let currentUser;
      await localForage.getItem('userProfile').then((value) => {
        currentUser = value?.username;
      });
      const projects = localForage.getItem('projectmeta');
      projects.then((value) => {
        if (value) {
          projectArrayTemp.push(value);
        }
      }).then(() => {
        projectArrayTemp[0].projects.forEach((_project) => {
          if (_project.identification.name.en === name) {
            let dirName;
            switch (_project.type.flavorType.flavor.name) {
              case 'textTranslation':
                dirName = 'textTranslation';
                break;
              case 'textStories':
                dirName = 'textStories';
                break;
              default:
                break;
            }
            const status = _project.project[dirName].starred;
            const selectedProject = _project;
            selectedProject.project[dirName].starred = !status;
            selectedProject.project[dirName].lastSeen = moment().format();
          }
        });
      }).finally(() => {
        localForage.setItem('projectmeta', projectArrayTemp[0])
        .then(() => {
          projectArrayTemp[0].projects.forEach((_project) => {
            if (_project.identification.name.en === name) {
              const id = Object.keys(_project.identification.primary.ag);
              const projectName = `${name}_${id}`;
              logger.debug('useProjectsSort.js', `Updating star/unstar in AG settings for ${name}`);
              updateAgSettings(currentUser, projectName, _project);
            }
          });
          // metaFileReplace({ userData: projectArrayTemp[0] });
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
      'useProjectsSort.js',
      `calling unstarred stable sort with value of orderBy=${property}`,
    );
    const isAsc = orderByUnstarred === property && orderUnstarred === 'asc';
    setOrderUnstarred(isAsc ? 'desc' : 'asc');
    setOrderByUnstarred(property);
  };

  const handleDelete = (event, name, property) => {
    logger.debug('useProjectsSort.js', 'calling handleDelete event');
    const selectedIndex = property === 'starred'
      ? starredrow.findIndex((x) => x.name === name)
      : unstarredrow.findIndex((x) => x.name === name);
    logger.debug('useProjectsSort.js', `removing the element with name=${name}`);
    /* eslint no-unused-expressions: ["error", { "allowTernary": true }] */
    property === 'starred'
      ? (starredrow.splice(selectedIndex, 1))
      : (unstarredrow.splice(selectedIndex, 1));
    handleRequestSortUnstarred('asc', 'view');
  };

  const archiveProject = async (project, name) => {
    const projectList = await localForage.getItem('projectmeta');
    // eslint-disable-next-line array-callback-return
    projectList.projects.map((proj) => {
      if (proj.identification.name.en === project.name) {
        project.isArchived = !project.isArchived;
      }
    });

    const projectArrayTemp = [];
    if (isElectron()) {
      let currentUser;
      await localForage.getItem('userProfile').then((value) => {
        currentUser = value?.username;
      });
      const projects = localForage.getItem('projectmeta');
      projects.then((value) => {
        if (value) {
          projectArrayTemp.push(value);
        }
      }).then(() => {
        projectArrayTemp[0].projects.forEach((_project) => {
          if (_project.identification.name.en === name) {
            let dirName;
            switch (_project.type.flavorType.flavor.name) {
              case 'textTranslation':
                dirName = 'textTranslation';
                break;
              case 'textStories':
                dirName = 'textStories';
                break;
              default:
                break;
            }
            const status = _project.project[dirName].isArchived;
            const selectedProject = _project;
            selectedProject.project[dirName].isArchived = !status;
            selectedProject.project[dirName].lastSeen = moment().format();
          }
        });
      }).finally(() => {
        localForage.setItem('projectmeta', projectArrayTemp[0])
          .then(() => {
            projectArrayTemp[0].projects.forEach((_project) => {
              if (_project.identification.name.en === name) {
                const id = Object.keys(_project.identification.primary.ag);
                const projectName = `${name}_${id}`;
                logger.debug('useProjectsSort.js', `Updating archive/restore in AG settings for ${name}`);
                updateAgSettings(currentUser, projectName, _project);
              }
            });
          });
      });
    }
  };

  // eslint-disable-next-line
    useEffect(() => {
    if (temparray) {
      active === 'starred'
        ? unstarredrow.push(temparray)
        : starredrow.push(temparray);

      settemparray(null);
      setactive('');
    }
    handleRequestSortUnstarred('asc', 'view');
    // eslint-disable-next-line
      }, [temparray, active]);

    const createData = (name, language, date, view, description, id, type, isArchived) => ({
      name, language, date, view, description, id, type, isArchived,
    });

    const FetchStarred = (ProjectName, Language, createdAt, LastView, ProjectDescription, id, type, isArchived) => {
      starrtedData.push(createData(
        ProjectName,
        Language,
        createdAt,
        LastView,
        ProjectDescription,
        id,
        type,
        isArchived,
      ));
    };

    const FetchUnstarred = (ProjectName, Language, createdAt, LastView, ProjectDescription, id, type, isArchived) => {
      unstarrtedData.push(createData(
        ProjectName,
        Language,
        createdAt,
        LastView,
        ProjectDescription,
        id,
        type,
        isArchived,
      ));
    };

    const FetchProjects = async () => {
      if (isElectron()) {
        localForage.getItem('userProfile').then((user) => {
            if (user === null) {
              router.push('/projects');
        } else {
          logger.debug('useProjectsSort.js', 'Fetching the projects');
            const projectsData = fetchProjectsMeta({ currentUser: user?.username });
            projectsData.then((value) => {
              if (value) {
                localForage.setItem('projectmeta', value)
                .then(() => {
                  localForage.getItem('projectmeta')
                  .then((value) => {
                    if (value) {
                      value.projects.forEach((_project) => {
                        const created = Object.keys(_project.identification.primary.ag);
                        let lastSeen;
                        let description;
                        let flavorType;
                        let isArchived;
                        switch (_project.type.flavorType.flavor.name) {
                          case 'textTranslation':
                            lastSeen = _project.project?.textTranslation?.lastSeen;
                            description = _project.project?.textTranslation?.description;
                            isArchived = _project.project.textTranslation.isArchived;
                            flavorType = 'Text Translation';
                            break;
                          case 'textStories':
                            lastSeen = _project.project?.textStories?.lastSeen;
                            description = _project.project?.textStories?.description;
                            isArchived = _project.project?.textStories?.isArchived;
                            flavorType = 'OBS';
                            break;
                          default:
                            break;
                        }
                        if (_project.project?.textTranslation?.starred === true || _project.project?.textStories?.starred === true) {
                          // FetchStarred(projectName,language, createdAt, updatedAt);
                          FetchStarred(
                            _project.identification.name.en,
                            _project.languages[0].name.en,
                            _project.identification.primary.ag[created].timestamp,
                            lastSeen,
                            description,
                            created,
                            flavorType,
                            isArchived,
                            );
                        } else {
                          FetchUnstarred(
                            _project.identification.name.en,
                            _project.languages[0].name.en,
                            _project.identification.primary.ag[created].timestamp,
                            lastSeen,
                            description,
                            created,
                            flavorType,
                            isArchived,
                            );
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
                  logger.error('useProjectsSort.js', 'Failed to fetch project list');
                  // we got an error
                  throw err;
                });
              }
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
                projects.get('isArchived'),
                );
              } else {
                  FetchUnstarred(
                    projects.get('projectName'),
                    projects.get('language'),
                    projects.get('date'),
                    projects.get('lastview'),
                    projects.get('isArchived'),
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
        notifications,
        activeNotificationCount,
      },
      actions: {
        handleClickStarred,
        handleDelete,
        handleRequestSortUnstarred,
        archiveProject,
        setStarredRow,
        setUnStarredRow,
        settemparray,
        setactive,
        setOrderUnstarred,
        setOrderByUnstarred,
        FetchProjects,
        setSelectedProject,
        setNotifications,
        setActiveNotificationCount,
      },
    };
  return response;
}
export default useProjectsSort;
