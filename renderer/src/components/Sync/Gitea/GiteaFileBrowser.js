import React, { useContext } from 'react';
import {
  AuthenticationContext,
  RepositoryContext,
  createContent, readContent, updateContent,
  get, createRepository,
} from 'gitea-react-toolkit';
import { useTranslation } from 'react-i18next';
import { ChevronRightIcon } from '@heroicons/react/solid';
import * as localForage from 'localforage';
import { SnackBar } from '@/components/SnackBar';
import { validate } from '@/util/validate';
import { checkDuplicate } from '@/core/burrito/importBurrito';
import ConfirmationModal from '@/layouts/editor/ConfirmationModal';
import { SyncContext } from '../SyncContextProvider';
import * as logger from '../../../logger';
import Dropzone from '../Dropzone/Dropzone';
import burrito from '../../../lib/BurritoTemplete.json';
import { importServerProject, createSyncProfile } from './GiteaUtils';
import ProgressBar from '../ProgressBar';

/* eslint-disable no-console */
// eslint-disable-next-line react/prop-types
const GiteaFileBrowser = ({ changeRepo }) => {
  const {
    states: { dragFromAg },
    action: {
      setDragFromAg, handleDropToAg, setTotalUploadedAg, settotalFilesAg, setUploadstartAg,
    },
  } = React.useContext(SyncContext);

  const { t } = useTranslation();
  const [totalUploaded, setTotalUploaded] = React.useState(0);
  const [uploadStart, setUploadstart] = React.useState(false);
  // const [uploadDone, setUploadDone] = React.useState(false);
  const [totalFiles, settotalFiles] = React.useState(0);

  // eslint-disable-next-line no-unused-vars
  const [advacnedOption, setAdvacnedOption] = React.useState(false);
  const [projects, setProjects] = React.useState([]);
  const [files, setFiles] = React.useState([]);
  // eslint-disable-next-line no-unused-vars
  const [activeStep, setActiveStep] = React.useState();
  const [sbData, setSbData] = React.useState({});
  const [userBranch, setUserBranch] = React.useState({});
  const [steps, setSteps] = React.useState([]);
  const [snackBar, setOpenSnackBar] = React.useState(false);
  const [snackText, setSnackText] = React.useState('');
  const [notify, setNotify] = React.useState();
  const [model, setModel] = React.useState({
    openModel: false,
    title: '',
    confirmMessage: '',
    buttonName: '',
    });
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

  const modelClose = () => {
    if (!model.buttonName === 'Replace') {
      settotalFiles(0);
      handleDropToAg(null);
    }
    setModel({
      openModel: false,
      title: '',
      confirmMessage: '',
      buttonName: '',
    });
  };

  const callImport = async (updateBurrito) => {
    modelClose();
    logger.debug('Dropzone.js', 'Inside callImport');
    // console.log('inside IMport function , all validation success : ');
    await importServerProject(
      updateBurrito,
      repo,
      sbData,
      auth,
      userBranch,
        {
          setUploadstart,
          setTotalUploaded,
        },
    ).finally(() => {
          setUploadstart(false);
          setTotalUploaded(0);
          settotalFiles(0);
          handleDropToAg(null);
        });
    };

  const checkBurritoVersion = () => {
    logger.debug('Dropzone.js', 'Checking the burrito version');
    // console.log("inside burrito version check :", burrito?.meta?.version, " : ", sbData?.meta?.version);
    if (burrito?.meta?.version !== sbData?.meta?.version) {
      setModel({
        openModel: true,
        title: t('modal-title-update-burrito'),
        confirmMessage: t('dynamic-msg-update-burrito-version', { version1: sbData?.meta?.version, version2: burrito?.meta?.version }),
        buttonName: t('btn-update'),
      });
    } else {
      callImport(false);
    }
  };

  const callFunction = () => {
    if (model.buttonName === 'Replace') {
      // console.log("replcae clicked");
      checkBurritoVersion();
    } else {
      // call with update true for burrito
      callImport(true);
    }
  };

  // Read gitea folder structure and data after drag
  const readGiteaFolderData = async (repo, from) => {
    logger.debug('Dropzone.js', 'calling read Gitea Folder Data event');
    // console.log("read folder data : ", from);
    // get all branch details
    if (from === 'gitea') {
      console.log('fetching branches', from);
      await fetch(`https://git.door43.org/api/v1/repos/${repo.owner.username}/${repo.name}/branches`)
        .then((resposne) => resposne.json())
        .then((branchData) => {
          localForage.getItem('userProfile').then(async (user) => {
            const regex = new RegExp(`${user.username }/\\d{4}-\\d{2}-\\d{2}.1`);
            const userProjectBranch = branchData.find((value) => regex.test(value.name));
            // const userBranch = 'mater';
            if (userProjectBranch) {
              setUserBranch(userProjectBranch);
              await readContent(
                {
                  config: auth.config,
                  owner: auth.user.login,
                  repo: repo.name,
                  ref: userProjectBranch?.name,
                  filepath: 'metadata.json',
                },
              ).then(async (result) => {
                logger.debug('Dropzone.js', 'sending the data from Gitea with content');
                await fetch(result.download_url)
                  .then((resposne) => resposne.json())
                  .then(async (metaContent) => {
                  // console.log('gitea meta : ', metaContent);
                  // Validate Burrito (check for metadata.json)
                  const sb = Buffer.from(metaContent.data);
                  const metaDataSb = JSON.parse(sb);
                  setSbData(metaDataSb);
                  const success = await validate('metadata', 'gitea/metadata.json', sb, metaDataSb.meta.version);

                    // testing validatio by folder

                    // const fs = window.require('fs');
                    // const newpath = localStorage.getItem('userPath');
                    // const projectsDir = path.join(newpath, 'autographa', 'users', user?.username, 'projects');
                    // console.log("dir : ", projectsDir);
                    // let sb = fs.readFileSync(path.join(projectsDir, 'Translation Test Import From Git _7333d0ef-d0a1-5734-8175-bb45d743f4f2' ,'metadata.json'));
                    // let sb = fs.readFileSync(path.join('C:\\Users\\SIJU MONCY\\AppData\\Roaming\\autographa\\users\\siju\\projects\\BIBLE PROJECT TRANSLATION_bcf3eebb-9581-5bea-b0df-d35053da752d' ,'metadata.json'));
                    // let sbjson = JSON.parse(sb)
                    // let sbconvertback = Buffer.from(JSON.stringify(sb));
                    // console.log("sb : ", sb);
                    // console.log("sb type : ", typeof sb);
                    // const success = await validate('metadata', 'gitea/metadata.json', sb, metaContent.meta.version);

                    /// ///////////////////////////////////////////////////////////////////////

                  console.log('success : ', success);
                  if (success) {
                    // get total file count to fetch
                    settotalFiles(Object.keys(metaDataSb?.ingredients).length);
                    // check project exist
                    const duplicate = await checkDuplicate(metaDataSb, user.username, 'projects');
                    console.log('duplicate : ', duplicate);
                    if (duplicate) {
                      logger.warn('ImportProjectPopUp.js', 'Project already available');
                      setModel({
                        openModel: true,
                        title: t('modal-title-replace-resource'),
                        confirmMessage: t('dynamic-msg-confirm-replace-resource'),
                        buttonName: t('btn-replace'),
                      });
                    } else {
                      callImport(false);
                    }
                  } else {
                    logger.debug('Dropzone.js', 'Burrito Validation Failed');
                    console.log('Burrito Validation Failed');
                    setNotify('failure');
                    setSnackText('Burrito Validation Failed');
                    setOpenSnackBar(true);
                  }
                  });
              }).catch((err) => {
                logger.debug('Dropzone.js', 'Invalid Project , Burrito not found', err);
                // console.log(" Error burrito not found", err);
                setNotify('failure');
                setSnackText('Invalid Project , Burrito not found');
                setOpenSnackBar(true);
              });
          } else {
            logger.debug('Dropzone.js', 'Invalid Project , No Valid Branch');
            // console.log("Invalid Project directory no valid Branch Found");
            setNotify('failure');
            setSnackText('Invalid Project directory no valid Branch Found');
            setOpenSnackBar(true);
          }
          });
        });
      // Validate Burrito (check for metadata.json)
      // handleDropToAg({ result: { ...result, from: 'gitea' } });

      // const filePath = getPath(value.path);
      // await readContent(
      //   {
      //     config: auth.config,
      //     owner: auth.user.login,
      //     repo: repo.name,
      //     ref: 'master',
      //     filepath: filePath,
      //   },
      // ).then((result) => {
      //   logger.debug('Dropzone.js', 'sending the data from Gitea with content');
      //   handleDropToAg({ result: { ...result, from: 'gitea' } });
      // });
    } else {
      handleDropToAg(null);
      setDragFromAg(null);
    }
  };

  const createFiletoServer = async (fileContent, filePath, username, created, repoName) => {
    await createContent({
      config: auth.config,
      owner: auth.user.login,
      // repo: repo.name,
      repo: repoName,
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
      console.log(filePath, ' : error : ', err);
    });
  };

  const updateFiletoServer = async (fileContent, filePath, username, created, repoName) => {
    await readContent(
      {
        config: auth.config,
        owner: auth.user.login,
        repo: repoName.toLowerCase(),
        ref: `${username}/${created}.1`,
        filepath: filePath,
      },
    ).then(async (result) => {
      logger.debug('Dropzone.js', 'sending the data from Gitea with content');
      await updateContent({
        config: auth.config,
        owner: auth.user.login,
        repo: repoName.toLowerCase(),
        branch: `${username}/${created}.1`,
        filepath: result.path,
        content: fileContent,
        message: `updated ${filePath}`,
        author: {
          email: auth.user.email,
          username: auth.user.username,
        },
        sha: result.sha,
      // eslint-disable-next-line no-unused-vars
      }).then((res) => {
        logger.debug('Dropzone.js', 'file uploaded to Gitea \'metadata.json\'');
        // console.log('RESPONSE :', res);
      })
      .catch((err) => {
        logger.debug('Dropzone.js', 'failed to upload file to Gitea \'metadata.json\'', err);
        console.log(filePath, ' : error : ', err);
      });
    });
  };

  const handleCreateRepo = async (repoName, description) => {
    const settings = {
      name: repoName,
      description: description || `${repoName}`,
      private: false,
    };
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      await createRepository(
        {
          config: auth.config,
          repo: settings?.name,
          settings,
        },
      ).then((result) => {
        logger.debug('Dropzone.js', 'call to create repo from Gitea');
        // console.log("create repo : ", result);
        resolve(result);
      }).catch((err) => {
        logger.debug('Dropzone.js', 'call to create repo from Gitea Error : ', err);
        // console.log("create repo : ", result);
        reject(err);
      });
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
      const repoName = `ag-${projectData.languages[0].tag}-${projectData.type.flavorType.flavor.name}-${projectName.replace(/[\s+ -]/g, '_')}`;

      localForage.getItem('userProfile').then(async (user) => {
        const newpath = localStorage.getItem('userPath');
        const fs = window.require('fs');
        const path = require('path');
        const projectsMetaPath = path.join(newpath, 'autographa', 'users', user?.username, 'projects', `${projectName}_${projectId}`);
        settotalFilesAg(Object.keys(ingredientsObj).length);
        // Create A REPO for the project
        await handleCreateRepo(repoName.toLowerCase()).then(
          async (result) => {
          if (result.id) {
            setUploadstartAg(true);
            // Successfully created , upload new files to repo
            // console.log("inside success creation", result.name);
            console.log('start uploading');
            logger.debug('Dropzone.js', 'calling handleDropFolder event - Repo created : syncing started');
            // read metadata
            // const Metadata = fs.readFileSync(path.join(projectsMetaPath, 'metadata.json'), 'utf8');
            const Metadata = fs.readFileSync(path.join(projectsMetaPath, 'metadata.json'));
            await createFiletoServer(JSON.stringify(Metadata), 'metadata.json', user.username, projectCreated, result.name);
            // Read ingredients
            /* eslint-disable no-await-in-loop */
            /* eslint-disable no-restricted-syntax */
            for (const key in ingredientsObj) {
              if (Object.prototype.hasOwnProperty.call(ingredientsObj, key)) {
                setTotalUploadedAg((prev) => prev + 1);
                const Metadata1 = fs.readFileSync(path.join(projectsMetaPath, key), 'utf8');
                await createContent({
                  config: auth.config,
                  owner: auth.user.login,
                  repo: result.name,
                  branch: `${user?.username}/${projectCreated}.1`,
                  filepath: key,
                  content: Metadata1,
                  message: `commit ${key}`,
                  author: {
                    email: auth?.user?.email,
                    username: auth?.user?.username,
                  },
                // eslint-disable-next-line no-unused-vars
                }).then((res) => {
                  logger.debug('Dropzone.js', `file uploaded to Gitea ${key}`);
                  // console.log('RESPONSE :', res);
                })
                // eslint-disable-next-line no-unused-vars
                .catch((err) => {
                  logger.debug('Dropzone.js', `failed to upload file to Gitea ${key}`);
                  setUploadstartAg(false);
                  // console.log(key, ' : error : ', err);
                });
            }
          }
            setDragFromAg(null);
            setUploadstartAg(false);
            settotalFilesAg(0);
            setTotalUploadedAg(0);
            handleDropToAg(null);
            logger.debug('Dropzone.js', 'calling handleDropFolder event - syncing Finished');
            console.log('Finish uploading');
            }
          },

          async (error) => {
            // error creation , conflict already exist 409, update content if there.
            logger.debug('Dropzone.js', 'calling handleDropFolder event - Repo already exist : ', error.message);
            logger.debug('Dropzone.js', 'calling handleDropFolder event - started update project : ');
            if (error.message.includes('409')) {
              console.log('started update project ');
              setUploadstartAg(true);
              const metadataContent = fs.readFileSync(path.join(projectsMetaPath, 'metadata.json'));
              await updateFiletoServer(JSON.stringify(metadataContent), 'metadata.json', user.username, projectCreated, repoName);
              // Read ingredients and update
              for (const key in ingredientsObj) {
                if (Object.prototype.hasOwnProperty.call(ingredientsObj, key)) {
                  const metadata1 = fs.readFileSync(path.join(projectsMetaPath, key), 'utf8');
                  setTotalUploadedAg((prev) => prev + 1);
                  await updateFiletoServer(metadata1, key, user.username, projectCreated, repoName);
              }
            }
              setDragFromAg(null);
              setUploadstartAg(false);
              settotalFilesAg(0);
              setTotalUploadedAg(0);
              logger.debug('Dropzone.js', 'calling handleDropFolder event - update syncing Finished');
              console.log('Finish updating project');
            } else {
              logger.debug('Dropzone.js', 'calling handleDropFolder event - Repo Updation Error : ', error.message);
              setUploadstartAg(false);
            }
          },
          );
          setUploadstartAg(false);
      });
    } else {
      handleDropToAg(null);
      setDragFromAg(null);
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

  // const testingButtonClick = async () => {
  //   console.log('clicked');
  // };

  React.useEffect(() => {
    (async () => {
      if (auth !== undefined) {
        await createSyncProfile(auth);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  return (
    (!auth && authComponent)
    || (!repo && (
      <div className="grid grid-rows-2">
        <div>{repoComponent}</div>
        <div className="row-span-6">
          <Dropzone dropped={() => handleDropFolder(dragFromAg)} />
        </div>
      </div>
))
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
              <span key={label} className="font-semibold tracking-wide text-primary " onClick={handleStep(label)} role="button" tabIndex={-1}>
                <ChevronRightIcon className="h-4 w-4 mx-2 inline-block fill-current text-gray-800" aria-hidden="true" />
                {label.name}
              </span>
            ) : (
              <span key={label} className="font-semibold" onClick={handleStep(index)} role="button" tabIndex={-1}>
                <ChevronRightIcon className="h-4 w-4 mx-2 inline-block fill-current text-gray-800" aria-hidden="true" />
                {label.name}
              </span>
            )
        ))}
      </div>
      {uploadStart
        && <ProgressBar currentValue={totalUploaded} totalValue={totalFiles} />}

      {!advacnedOption
        && (
        <table className="min-w-full divide-y divide-gray-200" data-testid="table">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                data-testid="th-name"
              >
                {t('label-name')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* <tr key={repo.name} draggable onDragStart={() => readGiteaFolderData(repo)}> */}
            <tr key={repo.name} draggable onDragStart={() => handleDropToAg({ result: { repo, from: 'gitea', readGiteaFolderData } })}>
              <td className="px-6 py-4 whitespace-nowrap cursor-pointer">
                <div className="flex items-center">
                  {/* <svg viewBox="0 0 14 16" fill="none" className="mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.09182 1.00903H3.95833C2.3696 1.00903 1 2.29684 1 3.88635V12.1526C1 13.8316 2.28009 15.1703 3.95833 15.1703H10.1227C11.7122 15.1703 13 13.7428 13 12.1526V5.08002L9.09182 1.00903Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8.88916 1V3.2446C8.88916 4.34028 9.77573 5.22917 10.8706 5.23148C11.8868 5.2338 12.9262 5.23457 12.9964 5.22994" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path opacity="0.4" d="M8.74248 10.8824H4.57812" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path opacity="0.4" d="M7.16739 7.06128H4.57788" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg> */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="25px" height="25px">
                    <path fill="#D8D4EA" d="M100.2,104H19c-5.5,0-10-4.5-10-10V29h98.7c6,0,10.7,5.3,9.9,11.2l-7.5,55C109.5,100.2,105.2,104,100.2,104 z" />
                    <path fill="#FFF" d="M104,104H19c-5.5,0-10-4.5-10-10V24h24.6c3.3,0,6.5,1.7,8.3,4.5l4.1,6.1c1.9,2.8,5,4.5,8.3,4.5H89 c5.5,0,10,4.5,10,10v41v1.9C99,96.5,100.8,100.8,104,104L104,104z" />
                    <path fill="#454B54" d="M100.2,107H19c-7.2,0-13-5.8-13-13V24c0-1.7,1.3-3,3-3h24.6c4.4,0,8.4,2.2,10.8,5.8l4.1,6.1 c1.3,2,3.5,3.1,5.8,3.1H89c7.2,0,13,5.8,13,13v35c0,1.7-1.3,3-3,3s-3-1.3-3-3V49c0-3.9-3.1-7-7-7H54.4c-4.4,0-8.4-2.2-10.8-5.8 l-4.1-6.1c-1.3-2-3.5-3.1-5.8-3.1H12v67c0,3.9,3.1,7,7,7h81.2c3.5,0,6.5-2.6,6.9-6.1l7.5-55c0.2-2-0.4-4-1.7-5.5 c-1.3-1.5-3.2-2.4-5.2-2.4c-1.7,0-3-1.3-3-3s1.3-3,3-3c3.7,0,7.3,1.6,9.7,4.4c2.5,2.8,3.6,6.5,3.2,10.2l-7.5,55 C112.3,102.1,106.7,107,100.2,107z" />
                    <path fill="#454B54" d="M107.7,32H43c-1.7,0-3-1.3-3-3s1.3-3,3-3h64.7c1.7,0,3,1.3,3,3S109.3,32,107.7,32z" />
                  </svg>
                  <span className="text-sm text-gray-900">
                    {/* {console.log(repo.name.split('-').pop().replaceAll('_', " "))} */}
                    {repo?.name}
                    {' '}
                    <span className="font-bold">
                      {' '}
                      (
                      {repo.name.split('-').pop().replaceAll('_', ' ')}
                      )
                      {' '}
                    </span>
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
)}

      {advacnedOption
      && (
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
              {/* <tr key={project.name}> */}
              {/* {console.log("project : ", projects)} */}
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
)}
      {/* <Dropzone dropped={() => handleDropFolder(dragFromAg)} /> */}
      <SnackBar
        openSnackBar={snackBar}
        snackText={snackText}
        setOpenSnackBar={setOpenSnackBar}
        setSnackText={setSnackText}
        error={notify}
      />
      <ConfirmationModal
        openModal={model.openModel}
        title={model.title}
        setOpenModal={() => modelClose()}
        confirmMessage={model.confirmMessage}
        buttonName={model.buttonName}
        closeModal={() => callFunction()}
      />
    </>
    )
  );
};
export default GiteaFileBrowser;
