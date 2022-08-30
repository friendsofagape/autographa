import { Dialog, Transition } from '@headlessui/react';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ConfirmationModal from '@/layouts/editor/ConfirmationModal';
import { SnackBar } from '@/components/SnackBar';
import { importServerProject, uploadProjectToBranchRepoExist } from './GiteaUtils';
import * as logger from '../../../logger';
import burrito from '../../../lib/BurritoTemplete.json';
import { environment } from '../../../../environment';
import { VerticalLinearStepper } from '../VerticalStepperProgress';

function ProjectMergePop({ setMerge, projectObj }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const { t } = useTranslation();
    const [stepCount, setStepCount] = React.useState(0);
    // eslint-disable-next-line no-unused-vars
    const [mergeStarted, setMergeStarted] = React.useState(false);
    const [mergeError, setMergeError] = React.useState(false);
    const [mergeErrorTxt, setMergeErrorTxt] = React.useState('');
    const [mergeConflict, setMergeConflict] = React.useState(false);
    const [mergeDone, setMergeDone] = React.useState(false);
    const [snackBar, setOpenSnackBar] = React.useState(false);
    const [snackText, setSnackText] = React.useState('');
    const [notify, setNotify] = React.useState();

    const [model, setModel] = React.useState({
        openModel: false,
        title: '',
        confirmMessage: '',
        buttonName: '',
        });

    const modalClose = () => {
      if (mergeDone || mergeError) {
        setIsOpen(false);
        setMerge(false);
        setModel({
          openModel: false,
          title: '',
          confirmMessage: '',
          buttonName: '',
        });
      }
      };

    const mergeSuccessMsg = 'Merge Successfull';

    const mergeProgressSteps = [
      {
        label: 'Setting up project',
        description: '',
      },
      {
        label: 'Processing and Validating Project and Upstream',
        description: '',
      },
      {
        label: 'Check for Merging',
        description: '',
      },
      {
        label: 'Backing Up Project',
        description: '',
      },
      {
        label: 'Updating Ag Project',
        description: '',
      },
      {
        label: 'Finishing Up Merge',
        description: '',
      },
    ];

    const ignoreFilesPaths = ['ingredients/ag-settings.json', 'metadata.json'];

    const undoMergeOrDeleteOldBackup = async () => {
      logger.debug('projectMergePop.js', 'in undo merge or delete old backup');
      const newpath = localStorage.getItem('userPath');
      const fs = window.require('fs');
      const path = require('path');
      const projectBackupPath = path.join(newpath, 'autographa', 'users', projectObj?.agUsername, 'sync-projects-backups');
      // Sorted files in directory on creation date
      const backupFileList = await fs.readdirSync(projectBackupPath);
      const files = backupFileList.filter((filename) => fs.statSync(`${projectBackupPath}/${filename}`).isDirectory());
      const backupFileListSorted = files.sort((a, b) => {
          const aStat = fs.statSync(`${projectBackupPath}/${a}`);
          const bStat = fs.statSync(`${projectBackupPath}/${b}`);
          return new Date(bStat.birthtime).getTime() - new Date(aStat.birthtime).getTime();
      });
      // prune older backup
      if (backupFileListSorted.length > environment.SYNC_BACKUP_COUNT) {
        await fs.rmdir(path.join(projectBackupPath, backupFileListSorted.pop()), { recursive: true }, (err) => {
          if (err) {
            throw err;
          } else {
            console.log('deleted!');
          }
        });
      }
    };

    const backupProjectLocal = async () => {
      setStepCount((prevStepCount) => prevStepCount + 1);
      const projectId = Object.keys(projectObj?.metaDataSbRemote?.identification.primary.ag)[0];
      const projectName = projectObj?.metaDataSbRemote?.identification.name.en;
      logger.debug('projectMergePop.js', 'Stated Backing up the project', projectName);
      const newpath = localStorage.getItem('userPath');
      const fse = window.require('fs-extra');
      const fs = window.require('fs');
      const path = require('path');
      const projectsMetaPath = path.join(newpath, 'autographa', 'users', projectObj?.agUsername, 'projects', `${projectName}_${projectId}`);
      const projectBackupPath = path.join(newpath, 'autographa', 'users', projectObj?.agUsername, 'sync-projects-backups');
      fs.mkdirSync(path.join(projectBackupPath), { recursive: true });
      logger.debug('ProjectMergePop.js', 'Creating backup directory if not exists.');
      const backupProjectName = `${projectName}_${projectId}_${new Date().getTime()}`;
      await fse.copy(projectsMetaPath, path.join(projectBackupPath, backupProjectName));
      logger.debug('projectMergePop.js', 'Finished Backing up the project', projectName);
      // test delete old
      console.log('delete old backups started');
      await undoMergeOrDeleteOldBackup();
      console.log('delete old backups finished');
    };

    const callFunction = async () => {
        let updateBurrito = null;
        if (model.buttonName === t('btn-update')) {
            updateBurrito = true;
        } else {
            // with update false
            updateBurrito = false;
        }
        // backing up project
        await backupProjectLocal()
        .then(async () => {
            // import merged project
            setStepCount((prevStepCount) => prevStepCount + 1);
            await importServerProject(
                updateBurrito,
                projectObj?.repo,
                projectObj?.metaDataSbRemote,
                projectObj?.auth,
                projectObj?.userProjectBranch,
                null,
                ignoreFilesPaths,
                ).catch((err) => {
                    // delete current the backedup project
                    setMergeErrorTxt(err);
                })
                .finally(() => {
                    setStepCount((prevStepCount) => prevStepCount + 1);
                    console.log('import project successfull');
                });
        });
        };

    const checkBurritoVersion = async () => {
        logger.debug('Dropzone.js', 'Checking the burrito version');
        if (burrito?.meta?.version !== projectObj?.metaDataSbRemote?.meta?.version) {
            setModel({
            openModel: true,
            title: t('modal-title-update-burrito'),
            confirmMessage: t('dynamic-msg-update-burrito-version', { version1: projectObj?.metaDataSbRemote?.meta?.version, version2: burrito?.meta?.version }),
            buttonName: t('btn-update'),
            });
        } else {
            await callFunction();
        }
        };

    const MergeStart = async () => {
        // upload exisitng ptoject to temp branch
        logger.debug('projectMergePop.js', 'Merge Project started');
        try {
            console.log('upload local project to temp :', stepCount);
            logger.debug('projectMergePop.js', 'Merge Project ignored files ', ignoreFilesPaths);
            projectObj.ignoreFilesPaths = ignoreFilesPaths;
            await uploadProjectToBranchRepoExist(projectObj)
        .then(async () => {
            // send PR
            logger.debug('projectMergePop.js', 'sending PR');
            setStepCount((prevStepCount) => prevStepCount + 1);
            console.log('sending PR and merge req : ', stepCount);
            const urlPr = `https://git.door43.org/api/v1/repos/${projectObj?.repo?.owner?.username}/${projectObj?.repo?.name}/pulls`;
            const myHeaders = new Headers();
            myHeaders.append('Authorization', `Bearer ${projectObj.auth.token.sha1}`);
            myHeaders.append('Content-Type', 'application/json');
            const payloadPr = JSON.stringify({
                base: `${projectObj.userProjectBranch.name}-merge`,
                head: projectObj.userProjectBranch.name,
                title: `Merge ${projectObj.userProjectBranch.name} to ${projectObj.userProjectBranch.name}-merge`,
            });
            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: payloadPr,
                redirect: 'follow',
            };
            await fetch(urlPr, requestOptions)
            .then((response) => response.json().then((data) => ({ resposne: response, body: data })))
            .then(async (result) => {
                if (result.resposne.ok) {
                    if (result.body.mergeable) {
                        // mergeable
                        logger.debug('projectMergePop.js', 'PR success - continue Merge operations');
                        console.log('continue merge is possible ---------- : ', stepCount);
                        // Do Merge
                        setStepCount((prevStepCount) => prevStepCount + 1);
                        const mergePayload = JSON.stringify({
                            Do: 'merge',
                            delete_branch_after_merge: false,
                          });
                        requestOptions.body = mergePayload;
                        const urlMerge = `https://git.door43.org/api/v1/repos/${projectObj?.repo?.owner?.username}/${projectObj?.repo?.name}/pulls/${result.body.number}/merge`;
                        await fetch(urlMerge, requestOptions)
                        .then((response) => response)
                        .then(async (mergeResult) => {
                            if (mergeResult.status === 200) {
                                console.log('finished Merge Project ***********');
                                logger.debug('projectMergePop.js', 'Successfully Merged');
                                // import temp branch project to local
                                await checkBurritoVersion();
                            } else if (mergeResult.status === 405) {
                                logger.debug('projectMergePop.js', 'Can not merge - nothing to merge or error ', mergeResult.statusText);
                                console.log('merge PR error 405 : NOTHING TO MERGE SAME ^^^^ ', mergeResult.statusText);
                                setMergeError(true);
                                setMergeDone(false);
                                setMergeStarted(false);
                                throw mergeResult.resposne.statusText;
                            }
                        });
                    } else {
                        // conflict section
                        logger.debug('projectMergePop.js', 'PR success - Can not Merge - Conflict Exist');
                        setNotify('Warning');
                        setSnackText('Can not perform Merge - Conflict Exist');
                        setOpenSnackBar(true);
                        console.log('can not perform merge : conflict exist xxxxxxxxxxx');
                    }
                } else {
                    throw result.resposne.statusText;
                }
            });
        });
        } catch (err) {
            logger.debug('projectMergePop.js', 'Project Merge Error - ', err);
            console.log('ERROR MERGE -------------> : ', err);
            setMergeErrorTxt(err);
            setNotify('error');
            setSnackText(`Merge Failed - ${mergeErrorTxt}`);
            setOpenSnackBar(true);
            setMergeError(true);
            setMergeDone(false);
            setMergeStarted(false);
        }
    };

    React.useEffect(() => {
        setIsOpen(true);
        setMergeStarted(true);
        setStepCount(0);
        MergeStart().finally(async () => {
            console.log('finally in react useeffect');
            // setStepCount((prevStepCount) => prevStepCount + 1);
            const myHeaders = new Headers();
            myHeaders.append('Authorization', `Bearer ${projectObj.auth.token.sha1}`);
            myHeaders.append('Content-Type', 'application/json');
            const requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                body: '',
                redirect: 'follow',
            };
            const urlDeleteBranch = `https://git.door43.org/api/v1/repos/${projectObj?.repo?.owner?.username}/${projectObj?.repo?.name}/branches/${projectObj.userProjectBranch.name}-merge`;
            await fetch(urlDeleteBranch, requestOptions)
            .then((response) => response)
            .then((result) => {
                if (result.ok) {
                  setMergeDone(true);
                  setMergeStarted(false);
                  setMergeError(false);
                  setMergeConflict(false);
                  setMergeErrorTxt('');
                  setStepCount((prevStepCount) => prevStepCount + 1);
                  console.log('deleted temp branch---------------------');
                  logger.debug('projectMergePop.js', 'Deleted Temp Branch Successfully');
                } else {
                  setMergeError(result.statusText);
                  throw result.statusText;
                }
            })
            .catch((error) => logger.debug('projectMergePop.js', 'Project Temporary branch deletion Error - ', error));
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // React.useEffect(() => {
    //   console.log('current step count useEffect : ', stepCount);
    // }, [stepCount]);

  return (
    <>
      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={modalClose}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 pointer-events-none" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Project Merging
                  </Dialog.Title>

                  {mergeError ? (
                    <div className="mt-2 ">
                      <p>Error on Merge Process</p>
                    </div>
                  ) : (
                    <div className="mt-2 ">
                      <VerticalLinearStepper
                        steps={mergeProgressSteps}
                        stepCount={stepCount}
                        successMsg={mergeSuccessMsg}
                      />
                    </div>
                  )}
                  <div className="mt-4">
                    <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        aria-label="merge=ok"
                        disabled={!((mergeDone || mergeError))}
                        type="button"
                        className={`w-20 h-10 ${!((mergeDone || mergeError)) ? 'bg-gray-500' : 'bg-success'} leading-loose rounded shadow text-xs font-base  text-white tracking-wide  font-light uppercase`}
                        onClick={modalClose}
                      >
                        {t('btn-ok')}
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <ConfirmationModal
        openModal={model.openModel}
        title={model.title}
        setOpenModal={() => modalClose()}
        confirmMessage={model.confirmMessage}
        buttonName={model.buttonName}
        closeModal={() => callFunction()}
      />
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
ProjectMergePop.propTypes = {
    setMerge: PropTypes.func,
    projectObj: PropTypes.object,
  };
export default ProjectMergePop;
