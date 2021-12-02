/* eslint-disable react/prop-types */
/* eslint-disable import/no-unresolved */
import { StarIcon } from '@heroicons/react/outline';
import React, {
  useEffect, useRef, useState, Fragment, useContext,
} from 'react';
import * as localforage from 'localforage';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';
import { isElectron } from '@/core/handleElectron';
import { readRefMeta } from '@/core/reference/readRefMeta';
import { readRefBurrito } from '@/core/reference/readRefBurrito';
import { ProjectContext } from '@/components/context/ProjectContext';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import ResourceOption from './ResourceOption';
import ImportResource from './ImportResource';

function createData(name, language, date) {
  return {
    name, language, date,
  };
}
const translationNotes = [
  createData('Translation Notes English', 'en', '2021-02-05'),
  createData('Translation Notes Spanish', 'es-419', '2020-12-29'),
  createData('Translation Notes Hindi', 'hi', '2021-02-11'),
  createData('Translation Notes Bengali', 'bn', '2021-02-25'),
  createData('Translation Notes Malayalam', 'ml', '2020-12-31'),
  createData('Translation Notes Gujarati', 'gu', '2020-12-29'),
];
const translationWords = [
  createData('Translation Words English', 'en', '2021-02-05'),
  createData('Translation Words Spanish', 'es-419', '2021-02-05'),
];
const translationQuestions = [
  createData('Transaltion Questions English', 'en', '2021-02-05'),
  createData('Transaltion Questions Spanish', 'es-419', '2021-02-05'),
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
  };

  const handleRowSelect = (e, row, name) => {
    setReferenceResources({
      selectedResource: selectResource,
      languageId: row,
      refName: name,
      header: title,
    });
    if (name.split(' ')[2] === 'Spanish') {
      setOwner('es-419_gl');
    } else {
      setOwner('Door43-catalog');
    }
    removeSection();
  };

  const openResourceDialogBox = () => {
    setOpenImportResourcePopUp(true);
    openResourceDialog();
  };

  function closeImportPopUp() {
    setOpenImportResourcePopUp(false);
  }

  return (
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
                    />
                    <ResourceOption
                      imageUrl="/illustrations/dictionary-icon.svg"
                      id="tn"
                      text="Translation Notes"
                      selectResource={selectResource}
                      setSelectResource={setSelectResource}
                      setTitle={setTitle}
                      setSubMenuItems={setSubMenuItems}
                    />
                    <ResourceOption
                      imageUrl="/illustrations/image-icon.svg"
                      id="twlm"
                      text="Translation Words"
                      selectResource={selectResource}
                      setSelectResource={setSelectResource}
                      setTitle={setTitle}
                      setSubMenuItems={setSubMenuItems}
                    />
                    <ResourceOption
                      imageUrl="/illustrations/dialogue-icon.svg"
                      id="tq"
                      text="Translation Questions"
                      selectResource={selectResource}
                      setSelectResource={setSelectResource}
                      setTitle={setTitle}
                      setSubMenuItems={setSubMenuItems}
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
                        {translationNotes.map((notes) => (
                          <tr className="hover:bg-gray-200" key={notes.name}>
                            <td className="px-5 py-3">
                              <StarIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                            </td>
                            <td className="px-5 text-gray-600">
                              <div
                                className="focus:outline-none"
                                onClick={(e) => handleRowSelect(e, notes.language, notes.name)}
                                role="button"
                                tabIndex="0"
                              >
                                {notes.name.split(' ')[2]}
                              </div>
                            </td>
                            <td className="px-5 text-gray-600">
                              <div
                                className="focus:outline-none"
                                onClick={(e) => handleRowSelect(e, notes.language, notes.name)}
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
                        {translationWords.map((notes) => (
                          <tr className="hover:bg-gray-200" key={notes.name}>
                            <td className="px-5 py-3">
                              <StarIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                            </td>
                            <td className="px-5 text-gray-600">
                              <div
                                className="focus:outline-none"
                                onClick={(e) => handleRowSelect(e, notes.language, notes.name)}
                                role="button"
                                tabIndex="0"
                              >
                                {notes.name.split(' ')[2]}
                              </div>
                            </td>
                            <td className="px-5 text-gray-600">
                              <div
                                className="focus:outline-none"
                                onClick={(e) => handleRowSelect(e, notes.language, notes.name)}
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
                        {translationQuestions.map((notes) => (
                          <tr className="hover:bg-gray-200" key={notes.name}>
                            <td className="px-5 py-3">
                              <StarIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                            </td>
                            <td className="px-5 text-gray-600">
                              <div
                                className="focus:outline-none"
                                onClick={(e) => handleRowSelect(e, notes.language, notes.name)}
                                role="button"
                                tabIndex="0"
                              >
                                {notes.name.split(' ')[2]}
                              </div>
                            </td>
                            <td className="px-5 text-gray-600">
                              <div
                                className="focus:outline-none"
                                onClick={(e) => handleRowSelect(e, notes.language, notes.name)}
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

  );
};

export default ResourcesPopUp;
