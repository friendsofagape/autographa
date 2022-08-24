import React from 'react';
import PropTypes from 'prop-types';
import * as localForage from 'localforage';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { SnackBar } from '@/components/SnackBar';
import menuStyles from '@/layouts/editor/MenuBar.module.css';
import * as logger from '../../../logger';
import fetchProjectsMeta from '../../../core/projects/fetchProjectsMeta';
import { handleCreateRepo, createFiletoServer, updateFiletoServer } from './GiteaUtils';
import CloudUploadIcon from '@/icons/basil/Outline/Files/Cloud-upload.svg';
import ProgressCircle from '../ProgressCircle';

const path = require('path');

function AutoSync({ selectedProject }) {
    const [usersList, setUsersList] = React.useState([]);
    const [selectedUsername, setselectedUsername] = React.useState(null);
    const [isOpen, setIsOpen] = React.useState(false);
    const { t } = useTranslation();
    const [snackBar, setOpenSnackBar] = React.useState(false);
    const [snackText, setSnackText] = React.useState('');
    const [notify, setNotify] = React.useState();
    const [totalUploaded, setTotalUploaded] = React.useState(0);
    const [uploadStart, setUploadstart] = React.useState(false);
    // const [uploadDone, setUploadDone] = React.useState(false);
    const [totalFiles, settotalFiles] = React.useState(0);

    // eslint-disable-next-line no-async-promise-executor
    const getGiteaUsersList = async () => new Promise(async (resolve, reject) => {
            localForage.getItem('userProfile').then(async (user) => {
                const fs = window.require('fs');
                const newpath = localStorage.getItem('userPath');
                const file = path.join(newpath, 'autographa', 'users', user?.username, 'ag-user-settings.json');
                if (fs.existsSync(file)) {
                    fs.readFile(file, async (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        logger.debug('ProjectContext.js', 'Successfully read the data from file , user : ', user?.username);
                        const json = JSON.parse(data);
                        // console.log('user json : ', json.sync?.services?.door43);
                        resolve(json.sync?.services?.door43);
                    }
                    });
                }
            });
          });

    const handleAutoSync = (selectedProject) => {
    logger.debug('EditorAutoSync.js', 'Inside auto sync Project : ', selectedProject);
    const projectName = (selectedProject.slice(0, selectedProject.lastIndexOf('_'))).toLowerCase();
    // console.log('project: ', projectName);
    localForage.getItem('userProfile').then(async (user) => {
        const userProjects = await fetchProjectsMeta({ currentUser: user?.username });
        const currentProject = userProjects.projects.filter((project) => project.identification.name.en.toLowerCase() === projectName);
        // auth params
        const fs = window.require('fs');
        const newpath = localStorage.getItem('userPath');
        const file = path.join(newpath, 'autographa', 'users', user?.username, 'ag-user-settings.json');
        if (fs.existsSync(file)) {
            fs.readFile(file, async (err, data) => {
            logger.debug('ProjectContext.js', 'Successfully read the data from file , user : ', user?.username);
            const json = JSON.parse(data);
            // setting default username for testing
            const auth = json?.sync?.services?.door43.filter((item) => item.username === selectedUsername.username);
            const authObj = auth[0].token;
            const projectData = currentProject[0];
            // const projectId = Object.keys(projectData.identification.primary.ag)[0];
            const projectName = projectData.identification.name.en;
            const ingredientsObj = projectData.ingredients;
            const projectCreated = projectData.meta.dateCreated.split('T')[0];
            const repoName = `ag-${projectData.languages[0].tag}-${projectData.type.flavorType.flavor.name}-${projectName.replace(/[\s+ -]/g, '_')}`;
            const projectsMetaPath = path.join(newpath, 'autographa', 'users', user?.username, 'projects', selectedProject);
            settotalFiles((Object.keys(ingredientsObj).length) + 1);

            await handleCreateRepo(repoName.toLowerCase(), authObj).then(
                async (result) => {
                    if (result.id) {
                        console.log('sync auto -- create repo + upload started');
                        logger.debug('EditorAutoSync.js', 'Auto Sync New project - repo + upload started');
                        setUploadstart(true);
                        const Metadata = fs.readFileSync(path.join(projectsMetaPath, 'metadata.json'));
                        await createFiletoServer(JSON.stringify(Metadata), 'metadata.json', user?.username, projectCreated, result.name, authObj)
                        .catch((err) => {
                            // console.log('error : ', err);
                            logger.debug('EditorAutoSync.js', 'Auto Sync  New project - repo + upload - error', err);
                            setUploadstart(false);
                            setTotalUploaded(0);
                            settotalFiles(0);
                        });
                        setTotalUploaded((prev) => prev + 1);
                        // eslint-disable-next-line no-restricted-syntax
                        for (const key in ingredientsObj) {
                            if (Object.prototype.hasOwnProperty.call(ingredientsObj, key)) {
                                setTotalUploaded((prev) => prev + 1);
                                const Metadata1 = fs.readFileSync(path.join(projectsMetaPath, key), 'utf8');
                                // eslint-disable-next-line no-await-in-loop
                                await createFiletoServer(Metadata1, key, user?.username, projectCreated, result.name, authObj)
                                .catch((err) => {
                                    // console.log('error : ', err);
                                    logger.debug('EditorAutoSync.js', 'Auto Sync  New project - repo + upload - error', err);
                                    setUploadstart(false);
                                    setTotalUploaded(0);
                                    settotalFiles(0);
                                });
                            }
                        }
                        logger.debug('EditorAutoSync.js', 'Auto Sync finished create project and upload');
                        console.log('finished create project and upload');
                        setUploadstart(false);
                        setTotalUploaded(0);
                        settotalFiles(0);
                        // setNotify('success');
                        // setSnackText('Sync completed successfully !!');
                        // setOpenSnackBar(true);
                    }
                },
                async (error) => {
                    if (error.message.includes('409')) {
                        console.log('started update project ');
                        logger.debug('EditorAutoSync.js', 'Auto Sync existing project - update started');
                        setUploadstart(true);
                        const metadataContent = fs.readFileSync(path.join(projectsMetaPath, 'metadata.json'));
                        await updateFiletoServer(JSON.stringify(metadataContent), 'metadata.json', user.username, projectCreated, repoName, authObj)
                        .catch((err) => {
                            // console.log('error : ', err);
                            logger.debug('EditorAutoSync.js', 'Auto Sync existing project - error', err);
                            setUploadstart(false);
                            setTotalUploaded(0);
                            settotalFiles(0);
                        });
                        setTotalUploaded((prev) => prev + 1);
                        // Read ingredients and update
                        // eslint-disable-next-line no-restricted-syntax
                        for (const key in ingredientsObj) {
                            if (Object.prototype.hasOwnProperty.call(ingredientsObj, key)) {
                                setTotalUploaded((prev) => prev + 1);
                                const metadata1 = fs.readFileSync(path.join(projectsMetaPath, key), 'utf8');
                                // eslint-disable-next-line no-await-in-loop
                                await updateFiletoServer(metadata1, key, user.username, projectCreated, repoName, authObj)
                                .catch((err) => {
                                    // console.log('error : ', err);
                                    logger.debug('EditorAutoSync.js', 'Auto Sync existing project - error', err);
                                    setUploadstart(false);
                                    setTotalUploaded(0);
                                    settotalFiles(0);
                                });
                            }
                        }
                        logger.debug('EditorAutoSync.js', 'Auto Sync existing project - update finished');
                        console.log('Finish updating project');
                        setUploadstart(false);
                        setTotalUploaded(0);
                        settotalFiles(0);
                        // setNotify('success');
                        // setSnackText('Sync completed successfully !!');
                        // setOpenSnackBar(true);
                    } else {
                        // token expiry or auth error
                        setUploadstart(false);
                        setTotalUploaded(0);
                        settotalFiles(0);
                        if (error.message.includes('401')) {
                            setNotify('failure');
                            setSnackText('Token Expired , Please login again in SYNC menu');
                            setOpenSnackBar(true);
                        }
                        logger.debug('EditorAutoSync.js', 'calling autosync event - Repo Updation Error : ', error.message);
                        }
                    },
                );
            });
        }
    });
    };

    const modalClose = () => {
        setIsOpen(false);
      };

    const callFunction = () => {
        setIsOpen(false);
        if (selectedUsername) {
            handleAutoSync(selectedProject);
        } else {
            setNotify('failure');
            setSnackText('Please select a valid account to sync..');
            setOpenSnackBar(true);
        }
    };

    const autoSyncOperations = async () => {
        setIsOpen(true);
        await getGiteaUsersList()
        .then((val) => {
            setUsersList(val);
        });
    };

    return (
      <>
        {uploadStart ? <ProgressCircle currentValue={totalUploaded} totalValue={totalFiles} />
        : (
          <div aria-label="add-panels" title="Sync Project" type="div" className={`group ${menuStyles.btn}`}>
            <button type="button" onClick={() => autoSyncOperations()}>
              <CloudUploadIcon fill="currentColor" className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        )}

        <Transition appear show={isOpen} as={React.Fragment}>
          <Dialog as="div" className="relative z-10" onClose={modalClose}>
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-30 pointer-events-none" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="bg-gray-200 w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Select Account
                      </Dialog.Title>

                      <div className="mt-2 ">

                        <Listbox value={selectedUsername} onChange={setselectedUsername}>
                          <div className="relative mt-1">
                            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                              <span className="block truncate">{selectedUsername?.username ? selectedUsername?.username : 'choose..'}</span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <SelectorIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </span>
                            </Listbox.Button>
                            <Transition
                              as={React.Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {usersList.map((user, userIdx) => (
                                  <Listbox.Option
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={userIdx}
                                    className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'}`}
                                    value={user}
                                  >
                                    {({ selected }) => (
                                      <>
                                        <span
                                          className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                                        >
                                          {user.username}
                                        </span>
                                        {selected ? (
                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                          </span>
                                    ) : null}
                                      </>
                                )}
                                  </Listbox.Option>
                            ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                        <p className="mt-2 px-2 text-sm text-red-500">
                          Please select an account where you want to sync project.
                          <p>
                            Can not find account..? , please login in
                            {' '}
                            <b className="text-primary underline">
                              <Link href="/sync">sync</Link>
                            </b>
                          </p>
                        </p>
                      </div>
                      <div className="mt-4 ">
                        <div className="bg-gray-200 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                          <button
                            aria-label="confirm-sync"
                            type="button"
                            className=" mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={callFunction}
                          >
                            {/* {t('btn-confirm')} */}
                            Confirm
                          </button>

                          <button
                            aria-label="close-sync"
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={modalClose}
                          >
                            {t('btn-close')}
                          </button>
                        </div>
                      </div>

                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </div>
          </Dialog>
        </Transition>

        <SnackBar
          openSnackBar={snackBar}
          snackText={snackText}
          setOpenSnackBar={setOpenSnackBar}
          setSnackText={setSnackText}
          error={notify}
        />

      </>
    );
}

AutoSync.propTypes = {
    selectedProject: PropTypes.string,
  };

export default AutoSync;
