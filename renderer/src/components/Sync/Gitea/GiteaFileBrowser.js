/* eslint-disable */ 
import React, { useContext } from 'react';
import {
  AuthenticationContext,
  RepositoryContext,
  createContent, readContent, get, createRepository,
} from 'gitea-react-toolkit';
import { useTranslation } from 'react-i18next';
import { ChevronRightIcon } from '@heroicons/react/solid';
import * as localForage from 'localforage';
import Dropzone from '../Dropzone/Dropzone';
import { SnackBar } from '@/components/SnackBar';
import * as logger from '../../../logger';
import { SyncContext } from '../SyncContextProvider';
import { validate } from '@/util/validate';
import { checkDuplicate } from '@/core/burrito/importBurrito';
import ConfirmationModal from '@/layouts/editor/ConfirmationModal';
import burrito from '../../../lib/BurritoTemplete.json';
import { importServerProject } from './GiteaUtils';
import path from 'path';

// eslint-disable-next-line react/prop-types
const GiteaFileBrowser = ({ changeRepo }) => {
  const {
    states: { dragFromAg }, action: { setDragFromAg, handleDropToAg },
  } = React.useContext(SyncContext);
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

  const callImport = async (updateBurrito) => {
    modelClose();
    logger.debug('Dropzone.js', 'Inside callImport');
    console.log("inside IMport function , all validation success : ");
    await importServerProject(updateBurrito, repo, sbData, auth, userBranch);

    // await localForage.getItem('userProfile').then(async (value) => {
    //   const status = await importBurrito(folderPath, value.username,updateBurriot);
    //   setOpenSnackBar(true);
    //   closePopUp(false);
    //   setNotify(status[0].type);
    //   setSnackText(status[0].value);
    //   if (status[0].type === 'success') {
    //     close();
    //     FetchProjects();
    //     router.push('/projects');
    //   }
    // });
  };

  const checkBurritoVersion = () => {
    logger.debug('Dropzone.js', 'Checking the burrito version');
    // console.log("inside burrito version check :", burrito?.meta?.version, " : ", sbData?.meta?.version);
    if (burrito?.meta?.version !== sbData?.meta?.version) {
      setModel({
        openModel: true,
        title: t('modal-title-update-burrito'),
        confirmMessage: t('dynamic-msg-update-burrito-version',{version1:sbData?.meta?.version, version2:burrito?.meta?.version}),
        buttonName: t('btn-update'),
      });
    } else {
      callImport(false);
    }
  };

  const callFunction = () =>{
    if (model.buttonName==='Replace'){
      // console.log("replcae clicked");
      checkBurritoVersion();
    } else {
      // call with update true for burrito
      callImport(true);
    }
  }

  const modelClose = () => {
    setModel({
      openModel: false,
      title: '',
      confirmMessage: '',
      buttonName: '',
    });
  };

  // Read gitea folder structure and data after drag
  const readGiteaFolderData = async (repo) => {
    logger.debug('Dropzone.js', 'calling read Gitea Folder Data event');
    // console.log("read folder data : ", repo);
    // get all branch details
    console.log("fetching branches");
    await fetch(`https://git.door43.org/api/v1/repos/${repo.owner.username}/${repo.name}/branches`)
      .then((resposne) => resposne.json())
      .then((branchData) => {
        localForage.getItem('userProfile').then(async (user) => {
          const regex = new RegExp(user.username + "\/\\d{4}-\\d{2}-\\d{2}.1");
          const userProjectBranch = branchData.find(value => regex.test(value.name));
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
            ).then(async(result) => {
              logger.debug('Dropzone.js', 'sending the data from Gitea with content');
              await fetch(result.download_url)
                .then((resposne) => resposne.json())
                .then( async(metaContent) => {
                console.log("gitea meta : ", metaContent);
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

                  //////////////////////////////////////////////////////////////////////////

                console.log("success : ", success);
                if(success) {
                  // check project exist
                  const duplicate = await checkDuplicate(metaDataSb, user.username, 'projects');
                  console.log("duplicate : ", duplicate);
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
                  console.log("Burrito Validation Failed");
                  setNotify('failure');
                  setSnackText("Burrito Validation Failed");
                  setOpenSnackBar(true);
                }
                });
            }).catch((err)=>{
              logger.debug('Dropzone.js', 'Invalid Project , Burrito not found', err);
              console.log(" Error burrito not found", err);
            });
        } else {
          logger.debug('Dropzone.js', 'Invalid Project , No Valid Branch');
          console.log("Invalid Project directory no valid Branch Found");
        }

        })
      })
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
  };

  const { t } = useTranslation();

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

  const handleCreateRepo = async (repoName, description) => {
    const settings = {
      name: repoName,
      description: description || `${repoName}`,
      private: false,
    };
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
      const repoName = `ag-${projectData.languages[0].tag}-${projectData.type.flavorType.flavor.name}-${projectName.replace(/\s+/g, '_')}`;

      localForage.getItem('userProfile').then(async (user) => {
        const newpath = localStorage.getItem('userPath');
        const fs = window.require('fs');
        const path = require('path');
        const projectsMetaPath = path.join(newpath, 'autographa', 'users', user?.username, 'projects', `${projectName}_${projectId}`);

        // Create A REPO for the project
        // const repoResponse = await handleCreateRepo(repoName.toLowerCase()).then((res) => {
        await handleCreateRepo(repoName.toLowerCase()).then(
          async (result) => {
          if (result.id) {
            // Successfully created , upload new files to repo
            // console.log("inside success creation", result.name);
            console.log("start uploading");
            logger.debug('Dropzone.js', 'calling handleDropFolder event - Repo created : syncing started');
            // read metadata
            // const Metadata = fs.readFileSync(path.join(projectsMetaPath, 'metadata.json'), 'utf8');
            const Metadata = fs.readFileSync(path.join(projectsMetaPath, 'metadata.json'));
            await createFiletoServer(JSON.stringify(Metadata), 'metadata.json', user.username, projectCreated, result.name);
            // Read ingredients
            for (const key in ingredientsObj) {
              const Metadata1 = fs.readFileSync(path.join(projectsMetaPath, key), 'utf8');
              await createContent({
                config: auth.config,
                owner: auth.user.login,
                // repo: repo.name,
                repo: result.name,
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
                // console.log('RESPONSE :', res);
              })
              .catch((err) => {
                logger.debug('Dropzone.js', `failed to upload file to Gitea ${key}`);
                // console.log(key, ' : error : ', err);
              });
            }
            setDragFromAg();
            logger.debug('Dropzone.js', 'calling handleDropFolder event - syncing Finished');
            console.log("Finish uploading");
            }
          },
          (error) => {
            // error creation , conflict already exist 409, update content if there.
            logger.debug('Dropzone.js', 'calling handleDropFolder event - Repo already exist : ', error);
            // console.log('inside error : ', error);
          },
        );
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
    console.log('clicked');
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

      {!advacnedOption && 
        <>
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
                  <tr key={repo.name} draggable onDragStart={() => readGiteaFolderData(repo)}>
                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer">
                      <div className="flex items-center">
                        <svg viewBox="0 0 14 16" fill="none" className="mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M9.09182 1.00903H3.95833C2.3696 1.00903 1 2.29684 1 3.88635V12.1526C1 13.8316 2.28009 15.1703 3.95833 15.1703H10.1227C11.7122 15.1703 13 13.7428 13 12.1526V5.08002L9.09182 1.00903Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M8.88916 1V3.2446C8.88916 4.34028 9.77573 5.22917 10.8706 5.23148C11.8868 5.2338 12.9262 5.23457 12.9964 5.22994" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path opacity="0.4" d="M8.74248 10.8824H4.57812" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path opacity="0.4" d="M7.16739 7.06128H4.57788" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                        <span className="text-sm text-gray-900">
                         {repo?.name}
                        </span>
                      </div>
                    </td>
                  </tr>
              </tbody>
          </table>
        </>
      }
      
      {advacnedOption && 
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
      }
      <Dropzone dropped={() => handleDropFolder(dragFromAg)} />
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
        closeModal={()=>callFunction()}
      />
    </>
    )
  );
};
export default GiteaFileBrowser;
