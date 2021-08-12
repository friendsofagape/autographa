/* eslint-disable react/prop-types */
/* eslint-disable import/no-unresolved */
import { StarIcon } from '@heroicons/react/outline';
import React, {
  useEffect, useRef, useState, Fragment,
} from 'react';
import * as localforage from 'localforage';
import { isElectron } from '@/core/handleElectron';
import { readRefMeta } from '@/core/reference/readRefMeta';
import { readRefBurrito } from '@/core/reference/readRefBurrito';
import { Dialog, Transition } from '@headlessui/react';
import ResourceOption from './ResourceOption';

function createData(name, language, date) {
  return {
    name, language, date,
  };
}
const translationNotes = [
  createData('English Notes', 'en', '2021-02-05'),
  createData('Hindi Translation Notes', 'hi', '2021-02-11'),
  createData('Bengali', 'bn', '2021-02-25'),
  createData('Malayalam', 'ml', '2020-12-31'),
  createData('Gujrati Notes', 'gu', '2020-12-29'),
  createData('Gujrati Notes', 'gu', '2020-12-29'),
  createData('Gujrati Notes', 'gu', '2020-12-29'),
  createData('Gujrati Notes', 'gu', '2020-12-29'),
  createData('Gujrati Notes', 'gu', '2020-12-29'),

];
const translationWords = [
  createData('Translation Words', 'en', '2021-02-05'),
];
const translationQuestions = [
  createData('Transaltion Questions', 'en', '2021-02-05'),
];

const ResourcesPopUp = ({
  header,
  languageId,
  openResourcePopUp,
  setOpenResourcePopUp,
  selectedResource,
  setReferenceResources,
}) => {
  const cancelButtonRef = useRef(null);
  const [subMenuItems, setSubMenuItems] = useState();
  const [title, setTitle] = useState(header);
  const [selectResource, setSelectResource] = useState(selectedResource);
  useEffect(() => {
    setReferenceResources({
      selectedResource: selectResource,
      header,
      languageId,
    });
    if (isElectron()) {
      const parseData = [];
      readRefMeta({
        projectname: 'newprodir',
      }).then((refs) => {
        refs.forEach((ref) => {
          readRefBurrito({
            projectname: 'newprodir',
            filename: ref,
          }).then((data) => {
            if (data) {
              parseData.push(JSON.parse(data));
              localforage.setItem('refBibleBurrito', parseData).then(
                () => localforage.getItem('refBibleBurrito'),
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
    removeSection();
  };

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
          <div className="w-5/12 h-3/6 items-center justify-center m-auto z-50 shadow overflow-hidden rounded">

            <div className="flex relative rounded shadow overflow-hidden bg-white">
              <button
                onClick={removeSection}
                type="button"
                className="focus:outline-none absolute z-10 top-0 right-0"
              >
                <img
                  src="/illustrations/close-button-black.svg"
                  alt="/"
                />
              </button>
              <div>
                <div className="uppercase bg-secondary text-white py-2 px-2 text-xs tracking-widest leading-snug rounded-tl text-center">
                  Resources
                </div>
                <div className="bg-gray-100 px-3 py-3 h-full">
                  <input
                    className="rounded h-8 bg-gray-200 border-none uppercase pr-6 text-xs
                      tracking-widest leading-snug font-bold"
                    placeholder="Search"
                    type="search"
                    id="gsearch"
                    name="gsearch"
                  />
                  <div className="grid grid-rows-5 py-5 gap-4">

                    <ResourceOption
                      imageUrl="/illustrations/dictionary-icon.svg"
                      id="tn"
                      text="Notes"
                      setSelectResource={setSelectResource}
                      setTitle={setTitle}
                      setSubMenuItems={setSubMenuItems}
                    />
                    <ResourceOption
                      imageUrl="/illustrations/bible-icon.svg"
                      id="bible"
                      text="Bible"
                      setSelectResource={setSelectResource}
                      setTitle={setTitle}
                      setSubMenuItems={setSubMenuItems}
                    />
                    <ResourceOption
                      imageUrl="/illustrations/image-icon.svg"
                      id="twlm"
                      text="TraslationWords"
                      setSelectResource={setSelectResource}
                      setTitle={setTitle}
                      setSubMenuItems={setSubMenuItems}
                    />
                    <ResourceOption
                      imageUrl="/illustrations/dialogue-icon.svg"
                      id="tq"
                      text="Questions"
                      setSelectResource={setSelectResource}
                      setTitle={setTitle}
                      setSubMenuItems={setSubMenuItems}
                    />
                    <ResourceOption
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
                    />
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
                                onClick={(e) => handleRowSelect(e, notes.language)}
                                role="button"
                                tabIndex="0"
                              >
                                {notes.name}
                              </div>
                            </td>
                            <td className="px-5 text-gray-600">
                              <div
                                className="focus:outline-none"
                                onClick={(e) => handleRowSelect(e, notes.language)}
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
                                onClick={(e) => handleRowSelect(e, notes.language)}
                                role="button"
                                tabIndex="0"
                              >
                                {notes.name}
                              </div>
                            </td>
                            <td className="px-5 text-gray-600">
                              <div
                                className="focus:outline-none"
                                onClick={(e) => handleRowSelect(e, notes.language)}
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
                                onClick={(e) => handleRowSelect(e, notes.language)}
                                role="button"
                                tabIndex="0"
                              >
                                {notes.name}
                              </div>
                            </td>
                            <td className="px-5 text-gray-600">
                              <div
                                className="focus:outline-none"
                                onClick={(e) => handleRowSelect(e, notes.language)}
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
                            <tr className="hover:bg-gray-200" key={ref.identification.name.en}>
                              <td className="px-5 py-3">
                                <StarIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                              </td>
                              <td className="px-5 text-gray-600">
                                <div
                                  className="focus:outline-none"
                                  onClick={(e) => handleRowSelect(e,
                                    ref.languages[0].tag, ref.identification.abbreviation.en)}
                                  role="button"
                                  tabIndex="0"
                                >
                                  {ref.identification.name.en}
                                </div>
                              </td>
                              <td className="px-5 text-gray-600">
                                <div
                                  className="focus:outline-none"
                                  onClick={(e) => handleRowSelect(e,
                                    ref.languages[0].tag, ref.identification.abbreviation.en)}
                                  role="button"
                                  tabIndex="0"
                                >
                                  {ref.languages[0].name.en}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    )}
                  </table>

                  <div className="flex gap-6 mx-5 absolute bottom-5 right-0 justify-end z-10">
                    <button type="button" className="py-2 px-6 bg-primary rounded shadow text-white uppercase text-xs tracking-widest font-semibold">Upload</button>
                    <button type="button" className="py-2 px-6 rounded shadow bg-error text-white uppercase text-xs tracking-widest font-semibold">Cancel</button>
                    <button type="button" className="py-2 px-7 rounded shadow bg-success text-white uppercase text-xs tracking-widest font-semibold">Open</button>
                  </div>
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
