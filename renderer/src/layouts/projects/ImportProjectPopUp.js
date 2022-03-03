/* eslint-disable */
import React, {
  useRef, Fragment,
} from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FolderOpenIcon, InformationCircleIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { SnackBar } from '@/components/SnackBar';
import CloseIcon from '@/illustrations/close-button-black.svg';
import localforage from 'localforage';
import importBurrito, { viewBurrito } from '../../core/burrito/importBurrito';
import * as logger from '../../logger';
import ConfirmationModal from '../editor/ConfirmationModal';
import { AutographaContext } from '@/components/context/AutographaContext';

export default function ImportProjectPopUp(props) {
  const {
    open,
    closePopUp,
  } = props;
  const router = useRouter();
  const cancelButtonRef = useRef(null);
  const [folderPath, setFolderPath] = React.useState();
  const [valid, setValid] = React.useState(false);
  const [snackBar, setOpenSnackBar] = React.useState(false);
  const [snackText, setSnackText] = React.useState('');
  const [notify, setNotify] = React.useState();
  const [show, setShow] = React.useState(false);
  const [sbData, setSbData] = React.useState({});
  const [openModal, setOpenModal] = React.useState(false);
  const {action: {FetchProjects}} = React.useContext(AutographaContext);
  function close() {
    logger.debug('ImportProjectPopUp.js', 'Closing the Dialog box');
    setValid(false);
    closePopUp(false);
    setShow(false);
    setSbData({});
  }

  const openFileDialogSettingData = async () => {
    logger.debug('ImportProjectPopUp.js', 'Inside openFileDialogSettingData');
    const options = { properties: ['openDirectory'] };
    const { remote } = window.require('electron');
    const { dialog } = remote;
    const WIN = remote.getCurrentWindow();
    const chosenFolder = await dialog.showOpenDialog(WIN, options);
    if ((chosenFolder.filePaths).length > 0) {
      logger.debug('ImportProjectPopUp.js', 'Selected a directory');
      await localforage.getItem('userProfile').then(async (value) => {
        setShow(true);
        const result = await viewBurrito(chosenFolder.filePaths[0],value.username);
        setSbData(result);
      });
    } else {
      logger.debug('ImportProjectPopUp.js', 'Didn\'t select any project');
      close();
    }
    setFolderPath(chosenFolder.filePaths[0]);
  };
  const callImport = async() =>{
    logger.debug('ImportProjectPopUp.js', 'Inside callImport');
    await localforage.getItem('userProfile').then(async (value) => {
      const status = await importBurrito(folderPath, value.username);
      setOpenSnackBar(true);
      closePopUp(false);
      setNotify(status[0].type);
      setSnackText(status[0].value);
      if (status[0].type === 'success') {
        FetchProjects();
        router.push('/projects');
      }
    });
  }
  const importProject = async () => {
    logger.debug('ImportProjectPopUp.js', 'Inside importProject');
    if (folderPath) {
      setValid(false);
      if (sbData.duplicate===true){
        logger.warn('ImportProjectPopUp.js', 'Project already available');
        setOpenModal(true);
      } else {
        logger.debug('ImportProjectPopUp.js', 'Its a new project');
        callImport();
      }
    } else {
      logger.error('ImportProjectPopUp.js', 'Invalid Path');
      setValid(true);
      setNotify('failure');
      setSnackText('Invalid Path');
      setOpenSnackBar(true);
    }
  };
  React.useEffect(() => {
    if (open) {
      openFileDialogSettingData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  return (
    <>
      <Transition
        show={show}
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
          open={show}
          onClose={close}
        >
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="flex items-center justify-center h-screen">
            <div className="w-5/12 h-3/6 items-center justify-center m-auto z-50 shadow overflow-hidden rounded">
              <div className="relative h-full rounded shadow overflow-hidden bg-white">
                <div className="flex justify-between items-center bg-secondary">
                  <div className="uppercase bg-secondary text-white py-2 px-2 text-xs tracking-widest leading-snug rounded-tl text-center">
                    Import Project
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
                <div className="relative w-full h-full">
                  
                  <div className="p-8 overflow-auto w-full h-full scrollbars-width flex flex-col justify-between">

                    <div className="bg-white text-sm text-left tracking-wide">
                      <div className="flex gap-6">
                        <h4 className="text-sm font-base mb-2 text-primary  tracking-wide leading-4  font-light">Scripture burrito directory</h4>
                        <button title="Select a directory that is a Scripture Burrito for import. It should contain the metadata.json file." type="button" disabled>
                          <InformationCircleIcon className="h-6 w-6 text-primary" />
                        </button>
                      </div>
                      <div className="flex items-center mb-4">
                        <input
                          type="text"
                          name="location"
                          id=""
                          value={folderPath}
                          onChange={(e) => setFolderPath(e.target.value)}
                          className="bg-gray-200 w-full block rounded shadow-sm sm:text-sm focus:border-primary border-gray-300"
                        />
                        <button
                          type="button"
                          className="px-5"
                          onClick={() => openFileDialogSettingData()}
                        >
                          <FolderOpenIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                        </button>
                      </div>

                      <div>
                        <h4 className="text-red-500">{valid === true ? 'Enter location' : (sbData?.fileExist ? '' : 'Unable to find burrito file (metadata.json)')}</h4>
                      </div>

                    </div>

                    {sbData?.fileExist
                      && (
                        <div>
                          <h4 className="text-sm font-base mb-2 text-primary tracking-wide leading-4 font-light">Project</h4>
                          <input
                            className="w-full mb-4 bg-gray-200 block rounded shadow-sm sm:text-sm focus:border-primary border-gray-300"
                            type="text" value={sbData.projectName} disabled />
                          <h4 className="text-sm font-base mb-2 text-primary tracking-wide leading-4 font-light">Language</h4>
                          <input
                          className="w-full mb-4 bg-gray-200 block rounded shadow-sm sm:text-sm focus:border-primary border-gray-300"
                            type="text" value={sbData.language} disabled />
                          <h4 className="text-sm font-base mb-2 text-primary tracking-wide leading-4 font-light">Type</h4>
                          <input
                          className="w-full mb-4 bg-gray-200 block rounded shadow-sm sm:text-sm focus:border-primary border-gray-300"
                            type="text" value={sbData.burritoType} disabled />
                          <label className="inline-flex items-center">
                            <input type="checkbox" className="form-checkbox" checked={sbData?.validate} disabled/>
                            {(sbData?.validate)?
                            <span className="ml-2">Burrito validated Successfully</span>
                            :
                            <span className="ml-2 text-red-500">Burrito validation Failed</span>
                            }
                          </label>
                        </div>
                      )}
                    
                    <div className="flex gap-6 mb-5 justify-end">

                      <button
                        type="button"
                        onClick={close}
                        className="py-2 px-6 rounded shadow bg-error text-white uppercase text-xs tracking-widest font-semibold"
                      >
                        Cancel
                      </button>
                      {sbData?.validate
                        && (
                          <button
                            type="button"
                            className="py-2 px-7 rounded shadow bg-success text-white uppercase text-xs tracking-widest font-semibold"
                            onClick={() => importProject()}
                          >
                            Import
                          </button>
                        )}
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
        title='Replace Resource'
        setOpenModal={setOpenModal}
        confirmMessage="An existing project with the same name was found. Press 'Replace' if you want to replace it. This would overwrite any existing content in overlapping books. Otherwise, press 'Cancel' to go back."
        buttonName="Replace"
        closeModal={()=>callImport()}
      />
    </>
  );
}
