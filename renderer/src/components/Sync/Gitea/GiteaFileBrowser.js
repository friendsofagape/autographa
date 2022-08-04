/* eslint-disable */
import React, { useContext } from 'react';
import {
  AuthenticationContext,
  RepositoryContext,
  createContent, readContent, get,
} from 'gitea-react-toolkit';
import { useTranslation } from 'react-i18next';
import { ChevronRightIcon } from '@heroicons/react/solid';
import * as localForage from 'localforage';
import Dropzone from '../Dropzone/Dropzone';
import * as logger from '../../../logger';
import { SyncContext } from '../SyncContextProvider';

const GiteaFileBrowser = ({ changeRepo }) => {
  const {
    states: { dragFromAg }, action: { setDragFromAg, handleDropToAg },
  } = React.useContext(SyncContext);
  const [projects, setProjects] = React.useState([]);
  const [files, setFiles] = React.useState([]);
  // eslint-disable-next-line no-unused-vars
  const [activeStep, setActiveStep] = React.useState();
  const [steps, setSteps] = React.useState([]);
  const { state: auth, component: authComponent } = useContext(
    AuthenticationContext,
  );
  const { state: repo, component: repoComponent } = useContext(
    RepositoryContext,
  );
  const fetchTree = async (treeUrl, projectName) => {
    logger.debug('Dropzone.js', 'calling fetchTree event');
    const step = steps;
    const found = steps.find((s) => s.url === treeUrl && s.name === projectName);
    if (found === undefined) {
      step.push({ url: treeUrl, name: projectName });
      setActiveStep(step.length);
      setSteps(step);
    }
    const url = treeUrl;
    const tree = [];
    const blob = [];
    const response = await get({ url, config: auth.config });
    response.tree?.forEach((list) => {
      if (list.type === 'blob') {
        blob.push(list);
      }
      if (list.type === 'tree') {
        tree.push(list);
      }
    });
    logger.debug('Dropzone.js', 'sending the list of Trees and Blobs');
    setProjects(tree);
    setFiles(blob);
  };
  const getPath = (filename) => {
    logger.debug('Dropzone.js', 'calling getPath event');
    const arr = [];
    if (steps.length > 1) {
      steps.forEach((s) => {
        arr.push(s.name);
      });
      arr.shift();
    }
    arr.push(filename);
    logger.debug('Dropzone.js', 'returning path with filename');
    return (arr.join('/'));
  };
  const readData = async (value) => {
    logger.debug('Dropzone.js', 'calling readData event');
    const filePath = getPath(value.path);
    await readContent(
      {
        config: auth.config,
        owner: auth.user.login,
        repo: repo.name,
        ref: 'master',
        filepath: filePath,
      },
    ).then((result) => {
      logger.debug('Dropzone.js', 'sending the data from Gitea with content');
      handleDropToAg({ result: { ...result, from: 'gitea' } });
    });
  };
  const { t } = useTranslation();

  const createFiletoServer = async (fileContent, filePath, username, created, repoName) => {
    await createContent({
      config: auth.config,
      owner: auth.user.login,
      repo: repo.name,
      branch: `${username}/${created}.1`,
      filepath: filePath,
      content: fileContent,
      message: `commit ${filePath}`,
      author: {
        email: auth.user.email,
        username: auth.user.username,
      },
    }).then(() => {
      logger.debug('Dropzone.js', `file uploaded to Gitea ${filePath}`);
      // console.log('RESPONSE :', res);
    })
    .catch((err) => {
      logger.debug('Dropzone.js', `failed to upload file to Gitea ${filePath} ${err}`);
      // console.log(filePath, ' : error : ', err);
    });
  };

  const handleDropFolder = async (data) => {
    logger.debug('Dropzone.js', 'calling handleDropFolder event');
    if (data?.result?.from === 'autographa') {
      logger.debug('Dropzone.js', 'data send from Autographa');
      const projectData = data.result.projectMeta[0];
      const projectId = Object.keys(projectData.identification.primary.ag)[0];
      const projectName = projectData.identification.name.en;
      const ingredientsObj = projectData.ingredients;
      const projectCreated = projectData.meta.dateCreated.split('T')[0];
      const repoName = `ag-${projectData.languages[0].tag}-${projectData.type.flavorType.flavor.name}-${projectName.replace(/\s+/g, '_')}`;

      localForage.getItem('userProfile').then(async (user) => {
        const newpath = localStorage.getItem('userPath');
        const fs = window.require('fs');
        const path = require('path');
        const projectsMetaPath = path.join(newpath, 'autographa', 'users', user?.username, 'projects', `${projectName}_${projectId}`);

        // console.log("start uploading");
        logger.debug('Dropzone.js', 'calling handleDropFolder event - syncing started');
        // read metadata
        const Metadata = fs.readFileSync(path.join(projectsMetaPath, 'metadata.json'), 'utf8');
        await createFiletoServer(Metadata, 'metadata.json', user.username, projectCreated, repoName.toLowerCase());
        // Read ingredients
        for (const key in ingredientsObj) {
          const Metadata1 = fs.readFileSync(path.join(projectsMetaPath, key), 'utf8');
          await createContent({
            config: auth.config,
            owner: auth.user.login,
            repo: repo.name,
            branch: `${user?.username}/${projectCreated}.1`,
            filepath: key,
            content: Metadata1,
            message: `commit ${key}`,
            author: {
              email: auth.user.email,
              username: auth.user.username,
            },
          }).then((res) => {
            logger.debug('Dropzone.js', `file uploaded to Gitea ${key}`);
            console.log('RESPONSE :', res);
          })
          .catch((err) => {
            logger.debug('Dropzone.js', `failed to upload file to Gitea ${key}`);
            console.log(key, ' : error : ', err);
          });
        }
        setDragFromAg();
        logger.debug('Dropzone.js', 'calling handleDropFolder event - syncing Finished');
        // console.log("Finish uploading");
      });
    }
  };

  const handleStep = (step) => () => {
    logger.debug('Dropzone.js', 'calling handleStep event');
    steps.splice(step + 1, steps.length);
    setSteps(steps);
    setActiveStep(step + 1);
    fetchTree(steps[step].url, steps[step].name);
  };
  const cleanRepo = () => {
    logger.debug('Dropzone.js', 'calling cleanRepo to change the Repo');
    setFiles([]);
    setProjects([]);
    setSteps([]);
    changeRepo();
  };
  React.useEffect(() => {
    if (files.length === 0 && projects.length === 0) {
      if (repo) {
        fetchTree(`${auth.config.server}/${repo?.tree_url}`, repo.name);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo?.tree_url]);

  const testingFileUpload = async () => {
    await handleDropFolder();
  };

  return (
    (!auth && authComponent)
    || (!repo && repoComponent)
    || (
    <>
      <div className="flex flex-row mx-5 my-3 border-b-1 border-primary">
        <span className="font-semibold" onClick={cleanRepo} role="button" tabIndex={-1}>
          {t('label-Gitea')}
          {' '}
          {t('label-project')}
        </span>
        {steps.map((label, index) => (
          (steps.length - 1 === index)
            ? (
              <span className="font-semibold tracking-wide text-primary " onClick={handleStep(index)} role="button" tabIndex={-1}>
                <ChevronRightIcon className="h-4 w-4 mx-2 inline-block fill-current text-gray-800" aria-hidden="true" />
                {label.name}
              </span>
            ) : (
              <span className="font-semibold" onClick={handleStep(index)} role="button" tabIndex={-1}>
                <ChevronRightIcon className="h-4 w-4 mx-2 inline-block fill-current text-gray-800" aria-hidden="true" />
                {label.name}
              </span>
            )
        ))}
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {t('label-name')}
            </th>
            {/* <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Created
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Last Viewed
              </th> */}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects.map((project) => (
            <tr key={project.name} onClick={() => fetchTree(project.url, project.path)}>
              <td
                className="px-6 py-4 whitespace-nowrap"
              >
                <div className="flex items-center">
                  <div className="ml-0">
                    <div className="text-sm text-gray-900">{project.path}</div>
                  </div>
                </div>
              </td>
              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.created}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.updated}</td> */}
            </tr>
                  ))}
        </tbody>
        <tbody className="bg-white divide-y divide-gray-200">
          {files.map((file) => (
            <tr key={file.name} draggable onDragStart={() => readData(file)}>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="ml-0">
                    <div className="text-sm text-gray-900">{file.path}</div>
                  </div>
                </div>
              </td>
              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.created}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.updated}</td> */}
            </tr>
                  ))}
        </tbody>
      </table>
      <Dropzone dropped={() => handleDropFolder(dragFromAg)} />
      <button type="button" onClick={() => handleDropFolder(dragFromAg)}>CLICK ME</button>
    </>
    )
  );
};
export default GiteaFileBrowser;
