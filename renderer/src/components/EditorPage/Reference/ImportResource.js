import React, {
    useRef, Fragment, useContext,
} from 'react';
import PropTypes from 'prop-types';

import { Dialog, Transition } from '@headlessui/react';
import { FolderOpenIcon, InformationCircleIcon } from '@heroicons/react/outline';
import * as localforage from 'localforage';
import { useTranslation } from 'react-i18next';
import { SnackBar } from '@/components/SnackBar';
import { isElectron } from '@/core/handleElectron';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import ConfirmationModal from '@/layouts/editor/ConfirmationModal';
import * as logger from '../../../logger';
import { viewBurrito } from '../../../core/burrito/importBurrito';
import CloseIcon from '@/illustrations/close-button-black.svg';

export default function ImportResource({
 open, closePopUp, setOpenResourcePopUp, setLoading,
}) {
    const cancelButtonRef = useRef(null);
    const [valid, setValid] = React.useState(false);
    const [snackBar, setOpenSnackBar] = React.useState(false);
    const [snackText, setSnackText] = React.useState('');
    const [notify, setNotify] = React.useState();
    const [openModal, setOpenModal] = React.useState(false);
    const [dataForImport, setDataForImport] = React.useState();
    const { t } = useTranslation();
    const {
      state: {
        folderPath,
      },
      actions: {
        setFolderPath,
        openResourceDialog,
      },
    } = useContext(ReferenceContext);

    function close() {
      closePopUp(false);
      setValid(false);
    }
    const importReference = async (projectsDir, name) => {
      const fse = window.require('fs-extra');
      const path = require('path');
      await fse.copy(
folderPath,
path.join(projectsDir, name),
{ overwrite: true },
).then(() => {
        setOpenSnackBar(true);
        setNotify('success');
        setSnackText(t('dynamic-msg-import-resource-snack'));
      }).then(() => {
        close();
        setOpenResourcePopUp(false);
      }).then(() => {
        setOpenResourcePopUp(true);
      })
      .catch((err) => {
        logger.debug('ImportResource.js', 'error in uploading resource to specified location');
        setNotify(err);
      });
    };
    const uploadRefBible = async () => {
      if (isElectron()) {
        const fs = window.require('fs');
        const path = require('path');
        localforage.getItem('userProfile').then(async (user) => {
          const newpath = localStorage.getItem('userPath');
          fs.mkdirSync(path.join(newpath, 'autographa', 'users', user?.username, 'resources'), {
            recursive: true,
          });
          const projectsDir = path.join(newpath, 'autographa', 'users', user?.username, 'resources');
          // Adding 'resources' to check the duplication in the user reference list
          const result = await viewBurrito(folderPath, user?.username, 'resources');
          if (result.fileExist === false) {
            setOpenSnackBar(true);
            setNotify('error');
            setSnackText(t('dynamic-msg-unable-find-buritto-snack'));
            logger.warn('ImportResource.js', 'Unable to find burrito file (metadata.json).');
          } else if (result.validate) {
            // path.basename is not working for windows
            // const name = path.basename(folderPath);
            const name = (folderPath.split(/[(\\)?(/)?]/gm)).pop();
            setDataForImport({ projectsDir, name });
            if (fs.existsSync(path.join(projectsDir, result.projectName))) {
              logger.warn('ImportResource.js', 'Project already available');
              setOpenModal(true);
            } else {
              setLoading(true);
              logger.debug('ImportResource.js', 'Its a new project');
              importReference(projectsDir, name);
            }
          } else {
            setOpenSnackBar(true);
            setNotify('error');
            logger.error('ImportResource.js', 'Invalid burrito file (metadata.json).');
            setSnackText(t('dynamic-msg-unable-invalid-buritto-snack'));
          }
        }).catch((err) => {
            logger.debug('ImportResource.js', 'error in loading resource');
            setNotify(err);
        }).finally(() => {
          setLoading(false);
        });
      }
    };

    return (
      <>
        <Transition
          show={open}
          as={Fragment}
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            initialFocus={cancelButtonRef}
            static
            open={open}
            onClose={close}
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            <div className="flex items-center justify-center h-screen">
              <div className="w-5/12 h-2/6 items-center justify-center m-auto z-50 shadow overflow-hidden rounded">
                <div className="relative h-full rounded shadow overflow-hidden bg-white">
                  <div className="flex justify-between items-center bg-secondary">
                    <div className="uppercase bg-secondary text-white py-2 px-2 text-xs tracking-widest leading-snug rounded-tl text-center">
                      {t('label-import-resource')}
                    </div>
                    <button
                      onClick={close}
                      type="button"
                      className="focus:outline-none"
                    >
                      <CloseIcon
                        className="h-6 w-7"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                  <div className="relative h-5/6">
                    <div className="overflow-auto w-full h-full no-scrollbars flex flex-col justify-between">
                      <div className="bg-white grid grid-cols-4 gap-2 p-4 text-sm text-left tracking-wide">
                        <div className="flex gap-5 col-span-2">
                          <div>
                            <h4 className="text-xs font-base mb-2 text-primary  tracking-wide leading-4  font-light">
                              {t('label-burrito-resource-path')}
                              <button title="Select a directory/project that has a Scripture Burrito file i.e. metadata.json file." type="button" disabled>
                                <InformationCircleIcon className="h-6 w-6 text-primary" />
                              </button>
                            </h4>
                            <input
                              type="text"
                              name="location"
                              id=""
                              value={folderPath}
                              onChange={(e) => setFolderPath(e.target.value)}
                              className="bg-white w-52 lg:w-80 block rounded shadow-sm sm:text-sm focus:border-primary border-gray-300"
                            />
                            <h4 className="text-red-500">{valid === true ? 'Enter location' : ''}</h4>
                          </div>
                          <div>
                            <button
                              type="button"
                              title={t('tooltip-import-open-file-location')}
                              className="px-1 py-8"
                              onClick={() => openResourceDialog()}
                            >
                              <FolderOpenIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-6 mx-5 justify-end">
                        <button type="button" className="py-2 px-6 rounded shadow bg-error text-white uppercase text-xs tracking-widest font-semibold" onClick={close}>{t('btn-cancel')}</button>
                        <button
                          onClick={() => uploadRefBible()}
                          type="button"
                          className="py-2 px-7 rounded shadow bg-success text-white uppercase text-xs tracking-widest font-semibold"
                        >
                          {t('btn-upload')}
                        </button>
                      </div>
                    </div>
                  </div>
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
        <ConfirmationModal
          openModal={openModal}
          title={t('modal-title-replace-resource')}
          setOpenModal={setOpenModal}
          confirmMessage={t('dynamic-msg-confirm-replace-resource')}
          buttonName={t('btn-replace')}
          closeModal={() => importReference(dataForImport.projectsDir, dataForImport.name)}
        />
      </>
    );
  }

ImportResource.propTypes = {
  open: PropTypes.bool,
  closePopUp: PropTypes.func,
  setOpenResourcePopUp: PropTypes.func,
  setLoading: PropTypes.func,
};
