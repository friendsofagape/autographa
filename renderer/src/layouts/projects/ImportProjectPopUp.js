/* eslint-disable react/prop-types */
import React, {
  useRef, Fragment,
} from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FolderOpenIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { SnackBar } from '@/components/SnackBar';
import CloseIcon from '@/illustrations/close-button-black.svg';
import importBurrito from '../../core/burrito/importBurrito';
import * as logger from '../../logger';

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

  function close() {
    setValid(false);
    closePopUp(false);
  }

  const openFileDialogSettingData = async () => {
    logger.debug('ImportProjectPopUp.js', 'Inside openFileDialogSettingData');
    const options = { properties: ['openDirectory'] };
    const { remote } = window.require('electron');
    const { dialog } = remote;
    const WIN = remote.getCurrentWindow();
    const chosenFolder = await dialog.showOpenDialog(WIN, options);
    setFolderPath(chosenFolder.filePaths[0]);
  };
  const importProject = async () => {
    if (folderPath) {
      setValid(false);
      const status = await importBurrito(folderPath);
      if (status[0].type === 'success') {
        router.push('/projects');
        setNotify('success');
        setSnackText('Imported Successfully');
        setOpenSnackBar(true);
        closePopUp(false);
      } else {
        setNotify('failure');
        setSnackText('Import Failed');
        setOpenSnackBar(true);
        closePopUp(false);
      }
    } else {
      setValid(true);
      setNotify('failure');
      setSnackText('Invalid Path');
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
                <div className="relative w-full h-5/6">
                  <div className="overflow-auto w-full h-full no-scrollbars flex flex-col justify-between">
                    <div className="bg-white grid grid-cols-4 gap-2 p-4 text-sm text-left tracking-wide">
                      <div className="flex gap-5 col-span-2">
                        <div>
                          <h4 className="text-xs font-base mb-2 text-primary  tracking-wide leading-4  font-light">Import Location</h4>
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
                            className="px-5"
                            onClick={() => openFileDialogSettingData()}
                          >
                            <FolderOpenIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-6 mx-5 justify-end">

                      <button
                        type="button"
                        onClick={close}
                        className="py-2 px-6 rounded shadow bg-error text-white uppercase text-xs tracking-widest font-semibold"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        className="py-2 px-7 rounded shadow bg-success text-white uppercase text-xs tracking-widest font-semibold"
                        onClick={() => importProject()}
                      >
                        Import
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

    </>
  );
}
