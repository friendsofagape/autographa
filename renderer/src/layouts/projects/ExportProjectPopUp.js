/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-unresolved */
import React, {
  useRef, Fragment,
} from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FolderOpenIcon } from '@heroicons/react/outline';
import updateTranslationSB from '@/core/burrito/updateTranslationSB';
import * as localforage from 'localforage';
import { validate } from '../../util/validate';

export default function ExportProjectPopUp(props) {
  const {
    open,
    closePopUp,
    projectName,
  } = props;

  const cancelButtonRef = useRef(null);
  const [folderPath, setFolderPath] = React.useState();
  function close() {
    closePopUp(false);
  }
  const openFileDialogSettingData = async () => {
    const options = { properties: ['openDirectory'] };
    const { remote } = window.require('electron');
    const { dialog } = remote;
    const WIN = remote.getCurrentWindow();
    const chosenFolder = await dialog.showOpenDialog(WIN, options);
    setFolderPath(chosenFolder.filePaths[0]);
  };
  const exportBible = async () => {
    await localforage.getItem('userProfile').then((value) => {
      const path = require('path');
      const fs = window.require('fs');
      const fse = window.require('fs-extra');
      const newpath = localStorage.getItem('userPath');
      const folder = path.join(newpath, 'autographa', 'users', value.username, 'projects', projectName);
      updateTranslationSB(value.username, projectName)
      .then((updated) => {
        console.log(updated);
        const data = fs.readFileSync(path.join(folder, 'metadata.json'), 'utf-8');
        const success = validate('metadata', path.join(folder, 'metadata.json'), data);
        if (success) {
          fse.copy(folder, path.join(folderPath, projectName))
            .then(() => console.log('success!'))
            .catch((err) => console.error(err));
        }
      });
    });
  };
  return (
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
                  Export Project (
                  {projectName}
                  )
                </div>
                <button
                  onClick={close}
                  type="button"
                  className="focus:outline-none"
                >
                  <img
                    src="/illustrations/close-button-black.svg"
                    alt="/"
                  />
                </button>
              </div>
              <div className="relative w-full h-5/6">
                <div className="overflow-auto w-full h-full no-scrollbars flex flex-col justify-between">
                  <div className="bg-white grid grid-cols-4 gap-2 p-4 text-sm text-left tracking-wide">
                    <div className="flex gap-5 col-span-2">
                      <div>
                        <h4 className="text-xs font-base mb-2 text-primary  tracking-wide leading-4  font-light">Export Location</h4>
                        <input
                          type="text"
                          name="location"
                          id=""
                          value={folderPath}
                          onChange={(e) => setFolderPath(e.target.value)}
                          className="bg-white w-52 lg:w-80 block rounded shadow-sm sm:text-sm focus:border-primary border-gray-300"
                        />
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
                    <button type="button" className="py-2 px-6 rounded shadow bg-error text-white uppercase text-xs tracking-widest font-semibold" onClick={close}>Cancel</button>
                    <button
                      onClick={() => exportBible()}
                      type="button"
                      className="py-2 px-7 rounded shadow bg-success text-white uppercase text-xs tracking-widest font-semibold"
                    >
                      Export
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
