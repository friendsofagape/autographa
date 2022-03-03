/* eslint-disable react/prop-types */
/* eslint-disable import/no-unresolved */
import React, {
  useRef, Fragment, useContext, useEffect,
} from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { DocumentTextIcon, FolderOpenIcon } from '@heroicons/react/outline';
import { SnackBar } from '@/components/SnackBar';
import { ProjectContext } from '@/components/context/ProjectContext';
import styles from './ImportPopUp.module.css';
import * as logger from '../../logger';
import CloseIcon from '@/illustrations/close-button-black.svg';

const grammar = require('usfm-grammar');

export default function ImportPopUp(props) {
  const {
    open,
    closePopUp,
  } = props;

  const cancelButtonRef = useRef(null);
  const [books, setBooks] = React.useState([]);
  const [folderPath, setFolderPath] = React.useState([]);
  const [valid, setValid] = React.useState(false);
  const [snackBar, setOpenSnackBar] = React.useState(false);
  const [snackText, setSnackText] = React.useState('');
  const [notify, setNotify] = React.useState();
  const [show, setShow] = React.useState(false);
  const {
    actions: {
      setImportedFiles,
    },
  } = useContext(ProjectContext);

  function close() {
    logger.debug('ImportPopUp.js', 'Closing the Import UI');
    setValid(false);
    setShow(false);
    closePopUp();
  }
  function clear() {
    logger.debug('ImportPopUp.js', 'Clearing the data from the path box');
    setFolderPath([]);
    setBooks([]);
  }
  const getBooks = (filePaths) => {
    logger.debug('ImportPopUp.js', 'In getBooks for displaying books name using the paths');
    const book = [];
    // regex to split path to two groups '(.*[\\\/])' for path and '(.*)' for file name
    // eslint-disable-next-line no-useless-escape
    const regexPath = /^(.*[\\\/])(.*)$/;
    // execute the match on the string filePath
    filePaths.forEach((filePath) => {
      const match = regexPath.exec(filePath);
      if (match !== null) {
        // we ignore the match[0] because it's the match for the hole path string
        const fileName = match[2];
        book.push(fileName);
      }
    });
    setBooks(book);
  };
  const openFileDialogSettingData = async () => {
    logger.debug('ImportPopUp.js', 'Inside openFileDialogSettingData');
    const options = {
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'usfm files', extensions: ['usfm', 'sfm', 'USFM', 'SFM'] }],
    };
    const { remote } = window.require('electron');
    const { dialog } = remote;
    const WIN = remote.getCurrentWindow();
    const chosenFolder = await dialog.showOpenDialog(WIN, options);
    if ((chosenFolder.filePaths).length > 0) {
      logger.debug('ImportPopUp.js', 'Selected the files');
      setShow(true);
    } else {
      logger.debug('ImportPopUp.js', 'Didn\'t select any file');
      close();
    }
    await getBooks(chosenFolder.filePaths);
    setFolderPath(chosenFolder.filePaths);
  };
  const importFiles = (folderPath) => {
    logger.debug('ImportPopUp.js', 'Inside importFiles');
    const fs = window.require('fs');
    const files = [];
    folderPath.forEach((filePath) => {
      const usfm = fs.readFileSync(filePath, 'utf8');
      const myUsfmParser = new grammar.USFMParser(usfm);
      const isJsonValid = myUsfmParser.validate();
      if (isJsonValid) {
        logger.debug('ImportPopUp.js', 'Valid USFM file.');
        const jsonOutput = myUsfmParser.toJSON();
        files.push({ id: jsonOutput.book.bookCode, content: usfm });
      } else {
        logger.warn('ImportPopUp.js', 'Invalid USFM file.');
        setNotify('failure');
        setSnackText('Invalid USFM file.');
        setOpenSnackBar(true);
      }
    });
    setImportedFiles(files);
    close();
  };
  const importProject = async () => {
    logger.debug('ImportPopUp.js', 'Inside importProject');
    if (folderPath.length > 0) {
      logger.debug('ImportPopUp.js', 'Importing the data');
      setValid(false);
      closePopUp(false);
      await importFiles(folderPath);
    } else {
      logger.debug('ImportPopUp.js', 'Invalid Path');
      setValid(true);
      setNotify('failure');
      setSnackText('Invalid Path');
      setOpenSnackBar(true);
    }
  };
  useEffect(() => {
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
          onClose={() => close}
        >
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="flex items-center justify-center h-screen">
            <div className="w-5/12 h-3/6 items-center justify-center m-auto z-50 shadow overflow-hidden rounded">

              <div className="relative h-full rounded shadow overflow-hidden bg-white">

                <div className="flex justify-between items-center bg-secondary">
                  <div className="uppercase bg-secondary text-white py-2 px-5 text-xs tracking-widest leading-snug rounded-tl text-center">
                    Import Book
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
                  <div className="p-8 overflow-auto w-full h-full no-scrollbars">
                    <div className="bg-white text-sm text-left tracking-wide">
                      <h4 className="text-xs font-base mb-2 text-primary  tracking-wide leading-4  font-light">Choose USFM files</h4>
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
                          className="px-5"
                          onClick={() => openFileDialogSettingData()}
                        >
                          <FolderOpenIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-red-500">{valid === true ? 'Enter location' : ''}</h4>
                    </div>
                    <div className="bg-white grid grid-cols-4 gap-2 p-4 pb-24 text-sm text-left tracking-wide">
                      {
                        books.map((book) => (
                          <div className={`${styles.select} group`}>
                            <DocumentTextIcon className="w-6 mr-2 group-hover:text-white" />
                            {book}
                          </div>
                        ))
                      }
                    </div>

                  </div>
                </div>

                <div className="absolute bottom-0 right-0 left-0 bg-white">
                  <div className="flex gap-6 mx-5 justify-end my-4">
                    <button
                      type="button"
                      onClick={close}
                      className="py-2 px-6 rounded shadow bg-error text-white uppercase text-xs tracking-widest font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={clear}
                      className="py-2 px-6 rounded shadow bg-primary text-white uppercase text-xs tracking-widest font-semibold"
                    >
                      Clear
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
