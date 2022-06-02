/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import React, {
  useRef, Fragment,
} from 'react';
import PropTypes from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import { FolderOpenIcon } from '@heroicons/react/outline';
import * as localforage from 'localforage';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@/illustrations/close-button-black.svg';
import updateTranslationSB from '@/core/burrito/updateTranslationSB';
import { SnackBar } from '@/components/SnackBar';
import { validate } from '../../util/validate';
import * as logger from '../../logger';
import burrito from '../../lib/BurritoTemplete.json';
import ConfirmationModal from '../editor/ConfirmationModal';

export default function ExportProjectPopUp(props) {
  const {
    open,
    closePopUp,
    project,
  } = props;
  const { t } = useTranslation();
  const cancelButtonRef = useRef(null);
  const [folderPath, setFolderPath] = React.useState();
  const [valid, setValid] = React.useState(false);
  const [snackBar, setOpenSnackBar] = React.useState(false);
  const [snackText, setSnackText] = React.useState('');
  const [notify, setNotify] = React.useState();
  const [openModal, setOpenModal] = React.useState(false);
  const [metadata, setMetadata] = React.useState({});
  function close() {
    logger.debug('ExportProjectPopUp.js', 'Closing the Dialog Box');
    closePopUp(false);
    setValid(false);
  }
  const openFileDialogSettingData = async () => {
    logger.debug('ExportProjectPopUp.js', 'Inside openFileDialogSettingData');
    const options = { properties: ['openDirectory'] };
    const { remote } = window.require('electron');
    const { dialog } = remote;
    const WIN = remote.getCurrentWindow();
    const chosenFolder = await dialog.showOpenDialog(WIN, options);
    setFolderPath(chosenFolder.filePaths[0]);
  };
  const updateBurritoVersion = (username, fs, path, folder) => {
    const fse = window.require('fs-extra');
    updateTranslationSB(username, project, openModal)
        .then(() => {
          logger.debug('ExportProjectPopUp.js', 'Updated Scripture burrito');
          let data = fs.readFileSync(path.join(folder, 'metadata.json'), 'utf-8');
          const sb = JSON.parse(data);
          if (!sb.copyright?.shortStatements && sb.copyright?.licenses) {
            delete sb.copyright.publicDomain;
            data = JSON.stringify(sb);
          }
          const success = validate('metadata', path.join(folder, 'metadata.json'), data, sb.meta.version);
          if (success) {
            logger.debug('ExportProjectPopUp.js', 'Burrito validated successfully');
            fse.copy(folder, path.join(folderPath, project.name))
              .then(() => {
                logger.debug('ExportProjectPopUp.js', 'Exported Successfully');
                setNotify('success');
                setSnackText(t('dynamic-msg-export-success'));
                setOpenSnackBar(true);
                closePopUp(false);
              })
              .catch((err) => {
                logger.error('ExportProjectPopUp.js', `Failed to export ${err}`);
                setNotify('failure');
                setSnackText(t('dynamic-msg-export-fail'));
                setOpenSnackBar(true);
                closePopUp(false);
              });
          }
        });
    setOpenModal(false);
  };
  const exportBible = async () => {
    const fs = window.require('fs');
    if (folderPath && fs.existsSync(folderPath)) {
      setValid(false);
      logger.debug('ExportProjectPopUp.js', 'Inside exportBible');
      await localforage.getItem('userProfile').then((value) => {
        const path = require('path');
        const newpath = localStorage.getItem('userPath');
        const folder = path.join(newpath, 'autographa', 'users', value.username, 'projects', `${project.name}_${project.id[0]}`);
        const data = fs.readFileSync(path.join(folder, 'metadata.json'), 'utf-8');
        const metadata = JSON.parse(data);
        const { username } = value;
        setMetadata({
          metadata, folder, path, fs, username,
        });
        if (burrito?.meta?.version !== metadata?.meta?.version) {
          setOpenModal(true);
        } else {
          updateBurritoVersion(username, fs, path, folder);
        }
      });
    } else {
      logger.warn('ExportProjectPopUp.js', 'Invalid Path');
      setValid(true);
      setNotify('failure');
      setSnackText(t('dynamic-msg-invalid-path'));
      setOpenSnackBar(true);
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
            <div className="w-5/12 h-3/6 items-center justify-center m-auto z-50 shadow overflow-hidden rounded">
              <div className="relative h-full rounded shadow overflow-hidden bg-white">
                <div className="flex justify-between items-center bg-secondary">
                  <div className="uppercase bg-secondary text-white py-2 px-2 text-xs tracking-widest leading-snug rounded-tl text-center">
                    {t('label-export-project')}
                    :
                    {
                    `${project?.name}`
                    }
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
                <div className="relative w-full h-5/6">
                  <div className="p-8 overflow-auto w-full h-full no-scrollbars">
                    <div className="bg-white text-sm text-left tracking-wide">
                      <h4 className="text-xs font-base mb-2 text-primary  tracking-wide leading-4  font-light">Export file path</h4>
                      <div className="flex items-center mb-4">
                        <input
                          type="text"
                          name="location"
                          id=""
                          value={folderPath}
                          onChange={(e) => setFolderPath(e.target.value)}
                          className="bg-white w-52 lg:w-80 block rounded shadow-sm sm:text-sm focus:border-primary border-gray-300"
                        />
                        <button
                          type="button"
                          title={t('tooltip-import-open-file-location')}
                          className="px-5"
                          onClick={() => openFileDialogSettingData()}
                        >
                          <FolderOpenIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-red-500">{valid === true ? 'Enter valid location' : ''}</h4>
                    </div>
                    <div className="absolute bottom-0 right-0 left-0 bg-white">
                      <div className="flex gap-6 mx-5 justify-end">
                        <button type="button" className="py-2 px-6 rounded shadow bg-error text-white uppercase text-xs tracking-widest font-semibold" onClick={close}>{t('btn-cancel')}</button>
                        <button
                          onClick={() => exportBible()}
                          type="button"
                          className="py-2 px-7 rounded shadow bg-success text-white uppercase text-xs tracking-widest font-semibold"
                        >
                          {t('btn-export')}
                        </button>
                      </div>
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
        title={t('modal-title-update-burrito')}
        setOpenModal={setOpenModal}
        confirmMessage={t('dynamic-msg-update-burrito-version', { version1: metadata?.metadata?.meta?.version, version2: burrito?.meta?.version })}
        buttonName={t('btn-update')}
        closeModal={
          () => updateBurritoVersion(metadata.username, metadata.fs, metadata.path, metadata.folder)
        }
      />
    </>
  );
}
ExportProjectPopUp.propTypes = {
  open: PropTypes.bool,
  closePopUp: PropTypes.func,
  project: PropTypes.object,
};
