/* eslint-disable no-alert */
import React from 'react';
// import parseFetchProjects from '../../core/projects/parseFetchProjects';
import * as localForage from 'localforage';
import parseFileUpdate from '../../core/projects/parseFileUpdate';
import * as logger from '../../logger';
import { isUSFM, getId } from '../../core/Sync/handleSync';
import fetchProjectsMeta from '../../core/projects/fetchProjectsMeta';

function useSync() {
  const projectList = [];
  const [agProjects, setAgProjects] = React.useState([]);
  const [agProjectsMeta, setAgProjectsMeta] = React.useState([]);
  const [dragFromAg, setDragFromAg] = React.useState();
  const [dropToAg, setDropToAg] = React.useState();

  const [totalUploadedAg, setTotalUploadedAg] = React.useState(0);
  const [uploadStartAg, setUploadstartAg] = React.useState(false);
  const [totalFilesAg, settotalFilesAg] = React.useState(0);

  const fetchProjects = async () => {
    logger.debug('Dropzone.js', 'calling fetchProjects event');
    localForage.getItem('userProfile').then(async (user) => {
      await fetchProjectsMeta({ currentUser: user?.username })
      .then((value) => {
      // console.log("value :  " ,value.projects);
      setAgProjectsMeta(value.projects);
      value.projects.forEach((project) => {
        projectList.push(project.identification.name.en);
        // console.log("project name :  " ,project.identification.name.en);
      });
    }).finally(() => {
      logger.debug('Dropzone.js', 'Updating project List');
      setAgProjects(projectList);
      // console.log("value agproject :  " ,agProjects);
    });
    });

    // await parseFetchProjects(username)
    // .then((res) => {
    //   res.forEach((project) => {
    //     // eslint-disable-next-line prefer-const
    //     let file = [];
    //     project.get('canoncontent').forEach((val, i) => {
    //       file.push({ filename: val, meta: project.get(`file${i + 1}`) });
    //     });
    //     projectList.push(project.get('projectName'));
    //   });
    // }).finally(() => {
    //   logger.debug('Dropzone.js', 'Updating project List');
    //   setAgProjects(projectList);
    // });
  };
  const onDragEnd = async (result) => {
    logger.debug('Dropzone.js', 'calling onDragEnd event');
    await fetch(result.filedataURL)
    .then((url) => url.text())
    .then((usfmValue) => {
      logger.debug('Dropzone.js', 'sending dragged value');
      setDragFromAg({ result: { ...result, content: usfmValue, from: 'autographa' } });
    });
  };

  const onDragEndFolder = async (projectMeta) => {
    logger.debug('Dropzone.js', 'calling onDragEndFolder event');
    // console.log("dropped project name : ", projectMeta);
    setDragFromAg({ result: { projectMeta, from: 'autographa' } });
  };

  const handleDropToAg = (data) => {
    setDropToAg(data);
  };

  const handleDrop = async ({ index, username }) => {
    const data = dropToAg;
    logger.debug('Dropzone.js', 'calling dropHere event');
    if (data.result.from === 'gitea') {
      const checkFile = isUSFM(data.result.name);
      if (checkFile) {
        fetch(data.result.download_url)
        .then((url) => url.text())
        .then((usfmValue) => {
          const lines = usfmValue.trim().split(/\s*[\r\n]+\s*/g);
          const bookCode = getId(lines);
          parseFileUpdate({
            username,
            projectName: agProjects[index],
            filename: bookCode,
            data: usfmValue,
            filenameAlias: data.result.name,
          })
          .then((response) => {
            handleDropToAg();
            alert(response);
          });
        });
      } else {
        logger.debug('Dropzone.js', 'Not a USFM file.');
        handleDropToAg();
        alert('Not a USFM file.');
      }
    }
  };
  const response = {
    state: {
      agProjects,
      agProjectsMeta,
      dragFromAg,
      dropToAg,
      totalFilesAg,
      totalUploadedAg,
      uploadStartAg,
    },
    actions: {
      fetchProjects,
      onDragEnd,
      onDragEndFolder,
      setDragFromAg,
      handleDropToAg,
      handleDrop,
      setTotalUploadedAg,
      setUploadstartAg,
      settotalFilesAg,
    },
  };
  return response;
}
export default useSync;
