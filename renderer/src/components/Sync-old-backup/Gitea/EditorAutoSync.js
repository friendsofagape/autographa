import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import localforage, * as localForage from 'localforage';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { SnackBar } from '@/components/SnackBar';
import menuStyles from '@/layouts/editor/MenuBar.module.css';
import moment from 'moment';
import { AutographaContext } from '@/components/context/AutographaContext';
import * as logger from '../../../logger';
import fetchProjectsMeta from '../../../core/projects/fetchProjectsMeta';
import { handleCreateRepo, createFiletoServer, updateFiletoServer } from './GiteaUtils';
import CloudUploadIcon from '@/icons/basil/Outline/Files/Cloud-upload.svg';
import CloudCheckIcon from '@/icons/basil/Solid/Files/Cloud-check.svg';
import ProgressCircle from '../ProgressCircle';
import Door43Logo from '@/icons/door43.svg';

const path = require('path');

function AutoSync({ selectedProject }) {
    const [usersList, setUsersList] = React.useState([]);
    const [selectedUsername, setselectedUsername] = React.useState(null);
    const [lastSyncedUser, setlastSyncedUser] = React.useState(null);
    const [isOpen, setIsOpen] = React.useState(false);
    const { t } = useTranslation();
    const [snackBar, setOpenSnackBar] = React.useState(false);
    const [snackText, setSnackText] = React.useState('');
    const [notify, setNotify] = React.useState();
    const [totalUploaded, setTotalUploaded] = React.useState(0);
    const [uploadStart, setUploadstart] = React.useState(false);
    const [uploadDone, setUploadDone] = React.useState(false);
    const [totalFiles, settotalFiles] = React.useState(0);
    const [currentProjectBurrito, setcurrentProjectBurrito] = React.useState(null);

    const {
      action: {
        setNotifications,
        // setActiveNotificationCount,
      },
    } = useContext(AutographaContext);

    const addNewNotification = async (title, text, type) => {
      localforage.getItem('notification').then((value) => {
        const temp = [...value];
        temp.push({
            title,
            text,
            type,
            time: moment().format(),
            hidden: true,
        });
        setNotifications(temp);
      });
    };

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

    const agSettingsSyncAction = async (action, projectname, syncUsername) => {
      if (action) {
        const fs = window.require('fs');
        const path = require('path');
        const newpath = localStorage.getItem('userPath');
        localForage.getItem('userProfile').then(async (user) => {
          const currentUser = user?.username;

           // settings path from burrito igredients
           localforage.getItem('projectmeta').then((val) => {
            // eslint-disable-next-line array-callback-return
            const currentProjectMeta = val.projects.filter((project) => {
              const id = Object.keys(project?.identification?.primary?.ag);
              if (projectname === `${project?.identification?.name?.en}_${id}`) {
                return project;
              }
            });
            if (currentProjectMeta.length === 1) {
              setcurrentProjectBurrito(currentProjectMeta[0]);
            }
          // eslint-disable-next-line array-callback-return
          const settingsIngredientsPath = Object.keys(currentProjectMeta[0]?.ingredients).filter((path) => {
            if (path.includes('ag-settings.json')) {
              return path;
            }
          });
          // const settingsPath = path.join(newpath, 'autographa', 'users', currentUser, 'projects', projectname, 'ingredients', 'ag-settings.json');
          const settingsPath = path.join(newpath, 'autographa', 'users', currentUser, 'projects', projectname, settingsIngredientsPath[0]);

          let settings = fs.readFileSync(settingsPath);
          settings = JSON.parse(settings);
          if (action === 'get') {
            setlastSyncedUser(settings.sync?.services?.door43[0]?.username);
          } if (action === 'put') {
            if (!settings.sync && !settings.sync?.services) {
              // first time sync
              settings.sync = {
                services: {
                  door43: [
                    {
                      username: syncUsername,
                      dateCreated: moment().format(),
                      lastSynced: moment().format(),
                    },
                  ],
                },
              };
            }
            // eslint-disable-next-line array-callback-return
            settings.sync?.services?.door43?.filter((element) => {
              element.username = syncUsername;
              element.lastSynced = moment().format();
            });
            logger.debug('EditorAutoSync.js', 'Upadting the ag settings with sync data');
            fs.writeFileSync(settingsPath, JSON.stringify(settings));
          }
        });
      });
        }
      };

    const handleAutoSync = (selectedProject) => {
    logger.debug('EditorAutoSync.js', 'Inside auto sync Project : ', selectedProject);
    const projectName = (selectedProject.slice(0, selectedProject.lastIndexOf('_'))).toLowerCase();
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
                      try {
                        logger.debug('EditorAutoSync.js', 'Auto Sync New project - repo + upload started');
                        setUploadstart(true);
                        const Metadata = fs.readFileSync(path.join(projectsMetaPath, 'metadata.json'));
                        await createFiletoServer(JSON.stringify(Metadata), 'metadata.json', `${user?.username}/${projectCreated}.1`, result.name, authObj);
                        // .catch((err) => {
                        //     // console.log('error : ', err);
                        //     logger.debug('EditorAutoSync.js', 'Auto Sync  New project - repo + upload - error', err);
                        //     setUploadstart(false);
                        //     setTotalUploaded(0);
                        //     settotalFiles(0);
                        // });
                        setTotalUploaded((prev) => prev + 1);
                        // eslint-disable-next-line no-restricted-syntax
                        for (const key in ingredientsObj) {
                            if (Object.prototype.hasOwnProperty.call(ingredientsObj, key)) {
                                setTotalUploaded((prev) => prev + 1);
                                const Metadata1 = fs.readFileSync(path.join(projectsMetaPath, key), 'utf8');
                                // eslint-disable-next-line no-await-in-loop
                                await createFiletoServer(Metadata1, key, `${user?.username}/${projectCreated}.1`, result.name, authObj);
                            }
                        }
                        logger.debug('EditorAutoSync.js', 'Auto Sync finished create project and upload');
                        setUploadstart(false);
                        setUploadDone(true);
                        setTotalUploaded(0);
                        settotalFiles(0);
                        await agSettingsSyncAction('put', selectedProject, authObj?.user?.username);
                        setNotify('success');
                        setSnackText('Sync completed successfully !!');
                        await addNewNotification(
                          'Sync',
                          'Project Sync to Gitea successfull',
                          'success',
                        );
                        setOpenSnackBar(true);
                      } catch (err) {
                        // console.log('error in catch : ---------- ', err);
                        logger.debug('EditorAutoSync.js', 'Auto Sync create + upload project - error', err);
                        setUploadstart(false);
                        setTotalUploaded(0);
                        settotalFiles(0);
                        setNotify('error');
                        setSnackText(`sync failed - ${err}`);
                        await addNewNotification(
                          'Sync',
                          `Project Sync to Ag failed - ${err}`,
                          'failure',
                        );
                        setOpenSnackBar(true);
                      }
                    }
                },
                async (error) => {
                    if (error.message.includes('409')) {
                      try {
                        logger.debug('EditorAutoSync.js', 'Auto Sync existing project - update started');
                        setUploadstart(true);
                        const metadataContent = fs.readFileSync(path.join(projectsMetaPath, 'metadata.json'));
                        await updateFiletoServer(JSON.stringify(metadataContent), 'metadata.json', `${user?.username}/${projectCreated}.1`, repoName, authObj);
                        setTotalUploaded((prev) => prev + 1);
                        // Read ingredients and update
                        // eslint-disable-next-line no-restricted-syntax
                        for (const key in ingredientsObj) {
                            if (Object.prototype.hasOwnProperty.call(ingredientsObj, key)) {
                                setTotalUploaded((prev) => prev + 1);
                                const metadata1 = fs.readFileSync(path.join(projectsMetaPath, key), 'utf8');
                                // eslint-disable-next-line no-await-in-loop
                                await updateFiletoServer(metadata1, key, `${user?.username}/${projectCreated}.1`, repoName, authObj);
                            }
                        }
                        logger.debug('EditorAutoSync.js', 'Auto Sync existing project - update finished');
                        setUploadstart(false);
                        setUploadDone(true);
                        setTotalUploaded(0);
                        settotalFiles(0);
                        await agSettingsSyncAction('put', selectedProject, authObj?.user?.username);
                        setNotify('success');
                        setSnackText('Sync completed successfully !!');
                        await addNewNotification(
                          'Sync',
                          'Project Sync to Gitea successfull',
                          'success',
                        );
                        setOpenSnackBar(true);
                    } catch (err) {
                      logger.debug('EditorAutoSync.js', 'Auto Sync existing project - error', err);
                      setUploadstart(false);
                      setTotalUploaded(0);
                      settotalFiles(0);
                      setNotify('error');
                      setSnackText(`sync failed - ${err}`);
                      await addNewNotification(
                        'Sync',
                        `Project Sync to Ag failed - ${err}`,
                        'failure',
                      );
                      setOpenSnackBar(true);
                    }
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
                        await addNewNotification(
                          'Sync',
                          'Project Sync to Ag failed - Token Expired , Please login again in SYNC menu',
                          'failure',
                        );
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
        if (selectedUsername === null) {
          await getGiteaUsersList()
          .then((val) => {
            setUsersList(val);
          });
        }
    };

    React.useEffect(() => {
      if (uploadDone) {
        setTimeout(() => {
          setUploadDone(false);
        }, 3000);
      }
    }, [uploadDone]);

    React.useEffect(() => {
      (async () => {
        await getGiteaUsersList()
          .then(async (val) => {
            const usersArr = val;
            setUsersList(val);
            if (selectedProject) {
              await agSettingsSyncAction('get', selectedProject)
              .then(() => {
                const currentUserObj = usersArr.filter((element) => element.username === lastSyncedUser);
                // console.log('current user obj : ', currentUserObj);
                setselectedUsername(currentUserObj[0]);
              });
            }
          });
      })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProject, lastSyncedUser]);

    return (
      <>
        {uploadStart ? <ProgressCircle currentValue={totalUploaded} totalValue={totalFiles} />
        : (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <>
            {uploadDone ? (
              <CloudCheckIcon
                fill="green"
                className="h-9 w-9 mx-1"
                aria-hidden="true"
              />
            )
            : (
              <div
                aria-label="add-panels"
                title="Sync Project"
                type="div"
              // className={`group ${menuStyles.btn} `}
                className={`group ${menuStyles.btn}
              transition-all duration-[${uploadDone ? '0ms' : '2000ms' }]${
                uploadDone ? 'opacity-0' : 'opacity-100'}`}
              >
                <button type="button" onClick={() => autoSyncOperations()}>
                  <CloudUploadIcon
                    fill="currentColor"
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </button>
              </div>
            )}
          </>
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
                    <Dialog.Panel className="bg-gray-200  w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all">
                      <div className="flex mr-2 justify-between">
                        <div className="">
                          <Dialog.Title
                            as="h3"
                            className="text-lg font-bold leading-6 text-gray-900"
                          >
                            Sync
                          </Dialog.Title>
                          { usersList?.length !== 0
                            && (
                            <p className="text-sm pt-1 text-gray-900">
                              Select door43 username
                            </p>
                          )}
                        </div>
                        <div className="">
                          <a className="bg-secondary text-white inline-block rounded-t py-2 px-4 text-sm uppercase" href="#a">
                            {/* <img className="inline mr-2 w-6" src="/brands/door43.png" alt="Door 43 Logo" /> */}
                            {/* <img className="inline mr-2 w-6" src="/brands/door43.png" alt="" /> */}
                            <Door43Logo className="inline mr-2 w-4" fill="#9bc300" />
                            {t('label-door43')}
                          </a>
                        </div>
                      </div>

                      <div className="mt-3">
                        {/* audio project no sync */}
                        {currentProjectBurrito?.type?.flavorType?.flavor?.name === 'audioTranslation' ? (
                          <div className="mt-3">
                            <p className="px-2 text-sm">
                              Sorry, Currently Sync is not avaialbe for
                              {' '}
                              <b>Audio Translation</b>
                              {' '}
                              Projects
                            </p>
                          </div>
                        ) : (
                          <>
                            { usersList?.length !== 0
                            && (
                            <Listbox value={selectedUsername} onChange={setselectedUsername}>
                              <div className="relative mt-1 ">
                                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                  <span className="block truncate">{selectedUsername?.username ? selectedUsername?.username : 'choose..'}</span>
                                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon
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
                                    {usersList?.map((user, userIdx) => (
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
                        )}

                            { usersList?.length !== 0
                            ? (
                              <div className="mt-3">
                                <p className="px-2 text-sm">
                                  don&apos;t find username, please login on
                                  {' '}
                                  <b className="text-primary underline">
                                    <Link href="/sync">sync</Link>
                                  </b>
                                </p>
                              </div>
                            ) : (
                              <div className="mt-3">
                                <p className="px-2 text-sm">
                                  Sorry, No account found for you..
                                  <p>
                                    please login to start syncing project
                                  </p>
                                </p>
                              </div>
                            )}
                          </>
                        )}

                      </div>
                      <div className="mt-4 ">
                        <div className="bg-gray-200 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                          {usersList?.length !== 0 && currentProjectBurrito?.type?.flavorType?.flavor?.name !== 'audioTranslation'
                          ? (
                            <button
                              aria-label="confirm-sync"
                              type="button"
                              className="w-20 h-10 bg-success leading-loose rounded shadow text-xs font-base  text-white tracking-wide  font-light uppercase"
                              onClick={callFunction}
                            >
                              {t('label-sync')}
                            </button>
                          )
                          : currentProjectBurrito?.type?.flavorType?.flavor?.name !== 'audioTranslation' && (
                            <button
                              href="/sync"
                              type="button"
                              className="w-20 h-10 bg-success leading-loose rounded shadow text-xs font-base  text-white tracking-wide  font-light uppercase"
                            >
                              <Link href="/sync">Login</Link>
                            </button>
                          )}

                          <button
                            aria-label="close-sync"
                            type="button"
                            className="w-20 h-10 mx-2 bg-error leading-loose rounded shadow text-xs font-base  text-white tracking-wide  font-light uppercase"
                            onClick={modalClose}
                          >
                            {t('btn-cancel')}
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
