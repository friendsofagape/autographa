/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-unresolved */
import { StarIcon } from '@heroicons/react/outline';
import React, {
  useEffect, useRef, useState, Fragment, useContext,
} from 'react';
import * as localforage from 'localforage';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon, PlusCircleIcon } from '@heroicons/react/solid';
import { isElectron } from '@/core/handleElectron';
import { readRefMeta } from '@/core/reference/readRefMeta';
import { readRefBurrito } from '@/core/reference/readRefBurrito';
import { ProjectContext } from '@/components/context/ProjectContext';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import { writeCustomResources } from '@/core/reference/writeCustomResources';
import ResourceOption from './ResourceOption';
import ImportResource from './ImportResource';
import { readCustomResources } from '@/core/reference/readCustomResources';
import { SnackBar } from '@/components/SnackBar';

function createData(name, language, owner) {
  return {
    name, language, owner,
  };
}
const translationNotes = [
  createData('English', 'en', 'Door43-catalog'),
  createData('Spanish', 'es-419', 'Es-419_gl'),
  createData('Hindi', 'hi', 'Door43-catalog'),
  createData('Bengali', 'bn', 'Door43-catalog'),
  createData('Malayalam', 'ml', 'Door43-catalog'),
  createData('Gujarati', 'gu', 'Door43-catalog'),
];
const translationWords = [
  createData('English', 'en', 'Door43-catalog'),
  createData('Spanish', 'es-419', 'es-419_gl'),
];
const translationQuestions = [
  createData('English', 'en', 'Door43-catalog'),
  createData('Spanish', 'es-419', 'es-419_gl'),
];

const ResourcesPopUp = ({
  header,
  // languageId,
  openResourcePopUp,
  setOpenResourcePopUp,
  selectedResource,
  setReferenceResources,
}) => {
  const cancelButtonRef = useRef(null);
  const [subMenuItems, setSubMenuItems] = useState();
  const [title, setTitle] = useState(header);
  const [selectResource, setSelectResource] = useState(selectedResource);
  const [showInput, setShowInput] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackText, setSnackText] = useState('');
  const [error, setError] = useState('');
  const [translationNote, setTranslationNote] = useState(translationNotes);
  const [translationQuestion, setTranslationQuestion] = useState(translationQuestions);
  const [translationWord, setTranslationWord] = useState(translationWords);
  const {
    states: {
      username,
    },
  } = useContext(ProjectContext);

  const {
    state: {
      openImportResourcePopUp,
    },
    actions: {
      openResourceDialog,
      setOpenImportResourcePopUp,
      setOwner,
    },
  } = useContext(ReferenceContext);

  useEffect(() => {
    if (isElectron()) {
      const fs = window.require('fs');
      const path = require('path');
      const newpath = localStorage.getItem('userPath');
      fs.mkdirSync(path.join(newpath, 'autographa', 'users', username, 'resources'), {
        recursive: true,
      });
      const projectsDir = path.join(
        newpath, 'autographa', 'users', username, 'resources',
      );
      const parseData = [];
      readRefMeta({
        projectsDir,
      }).then((refs) => {
        refs.forEach((ref) => {
          const metaPath = path.join(
            newpath, 'autographa', 'users', username, 'resources', ref, 'metadata.json',
          );
          readRefBurrito({
            metaPath,
          }).then((data) => {
            if (data) {
              const burrito = {};
              burrito.projectDir = ref;
              burrito.value = JSON.parse(data);
              parseData.push(burrito);
              localforage.setItem('resources', parseData).then(
                () => localforage.getItem('resources'),
              ).then((res) => {
                setSubMenuItems(res);
              }).catch((err) => {
                // we got an error
                throw err;
              });
            }
          });
        });
      });

      fs.mkdirSync(path.join(newpath, 'autographa', 'common', 'resources'), {
        recursive: true,
      });
      const commonResourceDir = path.join(
        newpath, 'autographa', 'common', 'resources',
      );

      readRefMeta({
        projectsDir: commonResourceDir,
      }).then((refs) => {
        refs.forEach((ref) => {
          const metaPath = path.join(
            newpath, 'autographa', 'common', 'resources', ref, 'metadata.json',
          );
          readRefBurrito({
            metaPath,
          }).then((data) => {
            if (data) {
              const burrito = {};
              burrito.projectDir = ref;
              burrito.value = JSON.parse(data);
              parseData.push(burrito);
              localforage.setItem('resources', parseData).then(
                () => localforage.getItem('resources'),
              ).then((res) => {
                setSubMenuItems(res);
              }).catch((err) => {
                // we got an error
                throw err;
              });
            }
          });
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeSection = () => {
    setOpenResourcePopUp(false);
    setTranslationNote('');
    setTranslationQuestion('');
    setTranslationWord('');
  };

  const handleRowSelect = (e, row, name, owner) => {
    setReferenceResources({
      selectedResource: selectResource,
      languageId: row,
      refName: name,
      header: title,
    });
    setOwner(owner);
    removeSection();
  };

  const openResourceDialogBox = () => {
    setOpenImportResourcePopUp(true);
    openResourceDialog();
  };

  function closeImportPopUp() {
    setOpenImportResourcePopUp(false);
  }

  function handleCustomInput(url, key) {
    removeSection();
    const resourceId = url.split('/');
    if (((resourceId[resourceId.length - 1].split('_')[1]) === (key === 'twlm' ? 'tw' : key)) && url) {
      writeCustomResources({ resourceUrl: { key, url } }).then(() => {
        setOpenResourcePopUp(true);
      });
      setShowInput(false);
    } else {
      setError('error');
      setOpenSnackBar(true);
      setShowInput(false);
      setSnackText('unable to fetch selected resource from the given url');
    }
  }

  useEffect(() => {
    readCustomResources({ resourceId: 'tq', translationData: translationQuestion });
    readCustomResources({ resourceId: 'twlm', translationData: translationWord });
    readCustomResources({ resourceId: 'tn', translationData: translationNote });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showInput]);

  return (
    <>
      <Transition
        show={openResourcePopUp}
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
          open={openResourcePopUp}
          onClose={removeSection}
        >

          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="flex items-center justify-center h-screen">

            <div className="w-8/12 h-4/6 items-center justify-center m-auto z-50 shadow overflow-hidden rounded">
              <div className="h-full flex relative rounded shadow overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={removeSection}
                  className="p-2 focus:outline-none bg-black absolute z-10 b top-0 right-0"
                >
                  <XIcon className="h-4 w-4 text-white" />
                </button>
                <div>
                  <div className="uppercase bg-secondary text-white p-2 text-xs tracking-widest leading-snug rounded-tl text-center">
                    Resources
                  </div>
                  <div style={{ width: 'max-content' }} className="bg-gray-100 px-3 py-3 h-full">
                    {/* <input
                    className="rounded h-8 bg-gray-200 border-none uppercase pr-6 text-xs
                      tracking-widest leading-snug font-bold"
                    placeholder="Search"
                    type="search"
                    id="gsearch"
                    name="gsearch"
                  /> */}
                    <div className="grid grid-rows-5 py-5 gap-4">
                      <ResourceOption
                        imageUrl="/illustrations/bible-icon.svg"
                        id="bible"
                        text="Bible"
                        selectResource={selectResource}
                        setSelectResource={setSelectResource}
                        setTitle={setTitle}
                        setSubMenuItems={setSubMenuItems}
                        setShowInput={setShowInput}
                      />
                      <ResourceOption
                        imageUrl="/illustrations/dictionary-icon.svg"
                        id="tn"
                        text="Translation Notes"
                        translationData={translationNotes}
                        readCustomResources={readCustomResources}
                        selectResource={selectResource}
                        setSelectResource={setSelectResource}
                        setTitle={setTitle}
                        setSubMenuItems={setSubMenuItems}
                        setShowInput={setShowInput}
                      />
                      <ResourceOption
                        imageUrl="/illustrations/image-icon.svg"
                        id="twlm"
                        text="Translation Words"
                        translationData={translationWords}
                        readCustomResources={readCustomResources}
                        selectResource={selectResource}
                        setSelectResource={setSelectResource}
                        setTitle={setTitle}
                        setSubMenuItems={setSubMenuItems}
                        setShowInput={setShowInput}
                      />
                      <ResourceOption
                        imageUrl="/illustrations/dialogue-icon.svg"
                        id="tq"
                        text="Translation Questions"
                        translationData={translationQuestions}
                        readCustomResources={readCustomResources}
                        selectResource={selectResource}
                        setSelectResource={setSelectResource}
                        setTitle={setTitle}
                        setSubMenuItems={setSubMenuItems}
                        setShowInput={setShowInput}
                      />
                      {/* <ResourceOption
                      imageUrl="/illustrations/location-icon.svg"
                      id="map"
                      text="Map"
                      setSelectResource={setSelectResource}
                      setTitle={setTitle}
                      setSubMenuItems={setSubMenuItems}
                    />
                    <ResourceOption
                      imageUrl="/illustrations/dialogue-icon.svg"
                      id="cmtry"
                      text="Commentary"
                      setSelectResource={setSelectResource}
                      setTitle={setTitle}
                      setSubMenuItems={setSubMenuItems}
                    /> */}
                    </div>
                  </div>
                </div>

                <div className="relative w-full">

                  <div className="overflow-auto w-full h-5/6 no-scrollbars">
                    <table className="divide-y divide-gray-200 w-full relative">
                      <thead className="bg-white sticky top-0">
                        <tr className="text-xs text-left">
                          <th className="px-5 py-3 font-medium text-gray-300">
                            <StarIcon className="h-5 w-5" aria-hidden="true" />
                          </th>
                          <th className="px-5 font-bold text-gray-700 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-5 font-bold text-gray-700 uppercase tracking-wider">
                            Language
                          </th>
                        </tr>
                      </thead>
                      {selectResource === 'tn' && (
                      <tbody className="bg-white divide-y divide-gray-200 ">
                        {translationNote.map((notes) => (
                          <tr className="hover:bg-gray-200" key={notes.name}>
                            <td className="px-5 py-3">
                              <StarIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                            </td>
                            <td className="px-5 text-gray-600">
                              <div
                                className="focus:outline-none"
                                onClick={(e) => handleRowSelect(e, notes.language, `Translation Notes ${notes.name}`, notes.owner)}
                                role="button"
                                tabIndex="0"
                              >
                                {notes.name}
                              </div>
                            </td>
                            <td className="px-5 text-gray-600">
                              <div
                                className="focus:outline-none"
                                onClick={(e) => handleRowSelect(e, notes.language, `Translation Notes ${notes.name}`, notes.owner)}
                                role="button"
                                tabIndex="0"
                              >
                                {notes.language}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    )}
                      {selectResource === 'twlm' && (
                      <tbody className="bg-white divide-y divide-gray-200  mb-44 ">
                        {translationWord.map((notes) => (
                          <tr className="hover:bg-gray-200" key={notes.name}>
                            <td className="px-5 py-3">
                              <StarIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                            </td>
                            <td className="px-5 text-gray-600">
                              <div
                                className="focus:outline-none"
                                onClick={(e) => handleRowSelect(e, notes.language, `Translation Words ${notes.name}`, notes.owner)}
                                role="button"
                                tabIndex="0"
                              >
                                {notes.name}
                              </div>
                            </td>
                            <td className="px-5 text-gray-600">
                              <div
                                className="focus:outline-none"
                                onClick={(e) => handleRowSelect(e, notes.language, `Translation Words ${notes.name}`, notes.owner)}
                                role="button"
                                tabIndex="0"
                              >
                                {notes.language}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    )}
                      {selectResource === 'tq' && (
                      <tbody className="bg-white divide-y divide-gray-200  mb-44 ">
                        {translationQuestion.map((notes) => (
                          <tr className="hover:bg-gray-200" key={notes.name}>
                            <td className="px-5 py-3">
                              <StarIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                            </td>
                            <td className="px-5 text-gray-600">
                              <div
                                className="focus:outline-none"
                                onClick={(e) => handleRowSelect(e, notes.language, `Translation Questions ${notes.name}`, notes.owner)}
                                role="button"
                                tabIndex="0"
                              >
                                {notes.name}
                              </div>
                            </td>
                            <td className="px-5 text-gray-600">
                              <div
                                className="focus:outline-none"
                                onClick={(e) => handleRowSelect(e, notes.language, `Translation Questions ${notes.name}`, notes.owner)}
                                role="button"
                                tabIndex="0"
                              >
                                {notes.language}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    )}
                      {selectResource === 'bible' && (
                      <tbody className="bg-white divide-y divide-gray-200  mb-44 ">
                        {(subMenuItems) && (
                          subMenuItems.map((ref) => (
                            <tr className="hover:bg-gray-200" key={ref.value.identification.name.en + ref.projectDir}>
                              <td className="px-5 py-3">
                                <StarIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                              </td>
                              <td className="px-5 text-gray-600">
                                <div
                                  className="focus:outline-none"
                                  onClick={(e) => handleRowSelect(e,
                                    ref.value.languages[0].name.en, ref.projectDir)}
                                  role="button"
                                  tabIndex="0"
                                >
                                  {ref.value.identification.name.en}
                                  {' '}
                                  (
                                  {ref.projectDir}
                                  )
                                </div>
                              </td>
                              <td className="px-5 text-gray-600">
                                <div
                                  className="focus:outline-none"
                                  onClick={(e) => handleRowSelect(e,
                                    ref.value.languages[0].name.en,
                                    ref.projectDir)}
                                  role="button"
                                  tabIndex="0"
                                >
                                  {ref.value.languages[0].name.en}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    )}
                    </table>
                    {selectResource === 'tn' && (
                          showInput ? (
                            <div className="bg-white grid grid-cols-4 gap-2 p-4 text-sm text-left tracking-wide">
                              <div className="flex gap-5 col-span-2">
                                <div>
                                  <input
                                    type="text"
                                    name="location"
                                    id=""
                                    value={inputUrl}
                                    placeholder="Enter door43 url"
                                    onChange={(e) => setInputUrl(e.target.value)}
                                    className="bg-white w-52 ml-2 lg:w-80 block rounded shadow-sm sm:text-sm focus:border-primary border-gray-300"
                                  />
                                </div>
                                <div>
                                  <button
                                    type="button"
                                    onClick={() => handleCustomInput(inputUrl, 'tn')}
                                    title="load translation noted"
                                    className="py-2 m-1 px-6 bg-primary rounded shadow text-white uppercase text-xs tracking-widest font-semibold"
                                  >
                                    Import
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <PlusCircleIcon className="h-5 w-5 m-5 text-primary" onClick={() => setShowInput(true)} aria-hidden="true" />
                          )

                  )}
                    {selectResource === 'tq' && (
                          showInput ? (
                            <div className="bg-white grid grid-cols-4 gap-2 p-4 text-sm text-left tracking-wide">
                              <div className="flex gap-5 col-span-2">
                                <div>
                                  <input
                                    type="text"
                                    name="location"
                                    id=""
                                    value={inputUrl}
                                    placeholder="Enter door43 url"
                                    onChange={(e) => setInputUrl(e.target.value)}
                                    className="bg-white w-52 ml-2 lg:w-80 block rounded shadow-sm sm:text-sm focus:border-primary border-gray-300"
                                  />
                                </div>
                                <div>
                                  <button
                                    type="button"
                                    onClick={() => handleCustomInput(inputUrl, 'tq')}
                                    title="load translation questions"
                                    className="py-2 m-1 px-6 bg-primary rounded shadow text-white uppercase text-xs tracking-widest font-semibold"
                                  >
                                    Import
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <PlusCircleIcon className="h-5 w-5 m-5 text-primary" onClick={() => setShowInput(true)} aria-hidden="true" />
                          )

                  )}
                    {selectResource === 'twlm' && (
                          showInput ? (
                            <div className="bg-white grid grid-cols-4 gap-2 p-4 text-sm text-left tracking-wide">
                              <div className="flex gap-5 col-span-2">
                                <div>
                                  <input
                                    type="text"
                                    name="location"
                                    id=""
                                    value={inputUrl}
                                    placeholder="Enter door43 url"
                                    onChange={(e) => setInputUrl(e.target.value)}
                                    className="bg-white w-52 ml-2 lg:w-80 block rounded shadow-sm sm:text-sm focus:border-primary border-gray-300"
                                  />
                                </div>
                                <div>
                                  <button
                                    type="button"
                                    onClick={() => handleCustomInput(inputUrl, 'twlm')}
                                    title="load translation words"
                                    className="py-2 m-1 px-6 bg-primary rounded shadow text-white uppercase text-xs tracking-widest font-semibold"
                                  >
                                    Import
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <PlusCircleIcon className="h-5 w-5 m-5 text-primary" onClick={() => setShowInput(true)} aria-hidden="true" />
                          )

                  )}
                    {selectResource === 'bible' && (
                    <div className="flex gap-6 mx-5 absolute bottom-5 right-0 justify-end z-10">
                      <button
                        type="button"
                        onClick={() => openResourceDialogBox()}
                        className="py-2 px-6 bg-primary rounded shadow text-white uppercase text-xs tracking-widest font-semibold"
                      >
                        Upload
                      </button>
                      {/* <button type="button"
                      className="py-2 px-6 rounded shadow
                       bg-error text-white uppercase text-xs
                       tracking-widest font-semibold">Cancel</button> */}
                      {/* <button
                        type="button"
                        onClick={() => uploadRefBible()}
                        className="py-2 px-7 rounded shadow
                        bg-success text-white uppercase text-xs tracking-widest font-semibold"
                      >
                        Open
                      </button> */}
                      <ImportResource
                        open={openImportResourcePopUp}
                        closePopUp={closeImportPopUp}
                        openPopUp={setOpenImportResourcePopUp}
                        setOpenResourcePopUp={setOpenResourcePopUp}
                      />
                    </div>
                  )}
                  </div>

                </div>
              </div>

            </div>

          </div>
        </Dialog>
      </Transition>
      <SnackBar
        openSnackBar={openSnackBar}
        setOpenSnackBar={setOpenSnackBar}
        snackText={snackText}
        setSnackText={setSnackText}
        error={error}
      />
    </>
  );
};

export default ResourcesPopUp;
