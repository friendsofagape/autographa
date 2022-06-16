import { StarIcon } from '@heroicons/react/outline';
import React, {
  useEffect, useRef, useState, Fragment, useContext,
} from 'react';
import PropTypes from 'prop-types';

import * as localforage from 'localforage';
import { useTranslation } from 'react-i18next';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon, PlusCircleIcon } from '@heroicons/react/solid';
import { isElectron } from '@/core/handleElectron';
import { readRefMeta } from '@/core/reference/readRefMeta';
import { readRefBurrito } from '@/core/reference/readRefBurrito';
import { ProjectContext } from '@/components/context/ProjectContext';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import { writeCustomResources } from '@/core/reference/writeCustomResources';
import { readCustomResources } from '@/core/reference/readCustomResources';
import { SnackBar } from '@/components/SnackBar';
import LoadingScreen from '@/components/Loading/LoadingScreen';
import ResourceOption from './ResourceOption';
import ImportResource from './ImportResource';
import * as logger from '../../../logger';

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
const obsTranslationNotes = [
  createData('Spanish', 'es-419', 'Door43-catalog'),
  createData('English', 'en', 'Door43-catalog'),
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
  const [resourceName, setResourceName] = useState('');
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackText, setSnackText] = useState('');
  const [error, setError] = useState('');
  const [translationNote, setTranslationNote] = useState(translationNotes);
  const [translationQuestion, setTranslationQuestion] = useState(translationQuestions);
  const [translationWord, setTranslationWord] = useState(translationWords);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
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
      const projectsDir = path.join(newpath, 'autographa', 'users', username, 'resources');
      const parseData = [];
      readRefMeta({
        projectsDir,
      }).then((refs) => {
        refs.forEach((ref) => {
          const metaPath = path.join(newpath, 'autographa', 'users', username, 'resources', ref, 'metadata.json');
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
      const commonResourceDir = path.join(newpath, 'autographa', 'common', 'resources');

      readRefMeta({
        projectsDir: commonResourceDir,
      }).then((refs) => {
        refs.forEach((ref) => {
          const metaPath = path.join(newpath, 'autographa', 'common', 'resources', ref, 'metadata.json');
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
      owner,
    });
    // setOwner(owner);
    removeSection();
  };

  const openResourceDialogBox = () => {
    setOpenImportResourcePopUp(true);
    openResourceDialog();
  };

  function closeImportPopUp() {
    setOpenImportResourcePopUp(false);
  }

  function handleCustomInput(url, key, resourceName) {
    logger.debug('ResourcePopUp.js', 'Open handleCustomInput function to add write custom resource url');
    const resourceId = url.split('/');
    if (((resourceId[resourceId.length - 1].split('_')[1]) === (key === 'twlm' ? 'tw' : key)) && url && resourceName) {
      removeSection();
      writeCustomResources({ resourceUrl: { key, url, resourceName } }).then(() => {
        setOpenSnackBar(true);
        setError('success');
        setSnackText(t('dynamic-msg-resource-added'));
        setOpenResourcePopUp(true);
        setInputUrl('');
        setResourceName('');
        setSelectResource(key);
      });
      setShowInput(false);
    } else {
      logger.error('ResourcePopUp.js', 'Error in adding custom resource url');
      setOpenSnackBar(true);
      setInputUrl('');
      setResourceName('');
      setError('failure');
      setShowInput(false);
      setSnackText(t('dynamic-msg-resource-unable-fetch-url'));
    }
  }

  useEffect(() => {
    readCustomResources({ resourceId: 'tq', translationData: translationQuestion });
    readCustomResources({ resourceId: 'twlm', translationData: translationWord });
    readCustomResources({ resourceId: 'tn', translationData: translationNote });
    readCustomResources({ resourceId: 'obs-tn', translationData: obsTranslationNotes });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showInput]);
  const callResource = (resource) => {
    logger.debug('ResourcesPopUp.js', 'Displaying resource table');
    const resources = [
      { id: 'tn', title: t('label-resource-tn'), resource: translationNote },
      { id: 'twlm', title: t('label-resource-twlm'), resource: translationWord },
      { id: 'tq', title: t('label-resource-tq'), resource: translationQuestion },
      { id: 'obs-tn', title: 'OBS-tn', resource: obsTranslationNotes }];
    const reference = resources.find((r) => r.id === resource);
    return (
      reference
      && (
      <tbody className="bg-white divide-y divide-gray-200 ">
        {(reference.resource).map((notes) => (
          <tr className="hover:bg-gray-200" key={notes.name + notes.owner}>
            <td className="px-5 py-3 hidden">
              <StarIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
            </td>
            <td className="px-5 py-2.5 text-gray-600">
              <div
                className="focus:outline-none"
                onClick={(e) => handleRowSelect(e, notes.language, `${reference.title} ${notes.name}`, notes.owner)}
                role="button"
                tabIndex="0"
              >
                {`${notes.name} (${notes.owner})`}
              </div>
            </td>
            <td className="px-5 text-gray-600">
              <div
                className="focus:outline-none"
                onClick={(e) => handleRowSelect(e, notes.language, `${reference.title} ${notes.name}`, notes.owner)}
                role="button"
                tabIndex="0"
              >
                {notes.language}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      )
    );
  };
  const importResources = (resource) => {
    if (showInput) {
      return (
        <div className="bg-white grid grid-cols-4 gap-2 p-4 text-sm text-left tracking-wide">
          <div className="flex gap-5 col-span-2">
            <div>
              <input
                type="text"
                name={t('label-resource-name')}
                id=""
                value={resourceName}
                placeholder={t('placeholder-resource-name')}
                onChange={(e) => setResourceName(e.target.value)}
                className="bg-white w-52 ml-2 lg:w-80 block rounded shadow-sm sm:text-sm focus:border-primary border-gray-300"
              />
            </div>
            <div>
              <input
                type="text"
                name={t('label-location')}
                id=""
                value={inputUrl}
                placeholder={t('placeholder-door43-url')}
                onChange={(e) => setInputUrl(e.target.value)}
                className="bg-white w-52 ml-2 lg:w-80 block rounded shadow-sm sm:text-sm focus:border-primary border-gray-300"
              />
            </div>
            <div>
              <button
                type="button"
                onClick={() => handleCustomInput(inputUrl, resource, resourceName)}
                title={t('btn-load-tn')}
                className="py-2 m-1 px-6 bg-primary rounded shadow text-white uppercase text-xs tracking-widest font-semibold"
              >
                {t('btn-import')}
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <button type="button" className="flex gap-6 mx-5 absolute bottom-5 right-0 justify-end z-10 outline-none">
        <PlusCircleIcon title={t('label-upload')} className="h-10 w-10 m-5 text-primary" onClick={() => setShowInput(true)} aria-hidden="true" />
      </button>
    );
  };

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
                  aria-label="close-resources"
                  type="button"
                  onClick={removeSection}
                  className="p-2 focus:outline-none bg-black absolute z-10 b top-0 right-0"
                >
                  <XIcon className="h-4 w-4 text-white" />
                </button>
                <div>
                  <div aria-label="resources-title" className="uppercase bg-secondary text-white p-2 text-xs tracking-widest leading-snug rounded-tl text-center">
                    {t('label-resource')}
                  </div>
                  <div style={{ width: 'max-content' }} className="relative bg-gray-100 px-3 py-3 h-full overflow-auto scrollbars-width">
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
                        text={t('label-resource-bible')}
                        selectResource={selectResource}
                        setSelectResource={setSelectResource}
                        setTitle={setTitle}
                        setSubMenuItems={setSubMenuItems}
                        setShowInput={setShowInput}
                      />
                      <ResourceOption
                        imageUrl="/illustrations/dictionary-icon.svg"
                        id="tn"
                        text={t('label-resource-tn')}
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
                        text={t('label-resource-twlm')}
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
                        text={t('label-resource-tq')}
                        translationData={translationQuestions}
                        readCustomResources={readCustomResources}
                        selectResource={selectResource}
                        setSelectResource={setSelectResource}
                        setTitle={setTitle}
                        setSubMenuItems={setSubMenuItems}
                        setShowInput={setShowInput}
                      />
                      <ResourceOption
                        imageUrl="/illustrations/image-icon.svg"
                        id="obs"
                        text={t('label-resource-obs')}
                        selectResource={selectResource}
                        setSelectResource={setSelectResource}
                        setTitle={setTitle}
                        setSubMenuItems={setSubMenuItems}
                        setShowInput={setShowInput}
                      />
                      <ResourceOption
                        imageUrl="/illustrations/dictionary-icon.svg"
                        id="obs-tn"
                        text={t('label-resource-obs-tn')}
                        translationData={obsTranslationNotes}
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
                {loading
                  ? <LoadingScreen />
                  : (
                    <div className="relative flex align-top flex-row flex-wrap w-full max-h-sm scrollbars-width overflow-auto ">
                      <table className="divide-y divide-gray-200 w-full relative">
                        <thead className="bg-white sticky top-0">
                          <tr className="text-xs text-left">
                            <th className="px-5 py-3 font-medium text-gray-300 hidden">
                              <StarIcon className="h-5 w-5" aria-hidden="true" />
                            </th>
                            <th className="px-5 py-3.5 font-bold text-gray-700 uppercase tracking-wider">
                              {t('label-name')}
                            </th>
                            <th className="px-5 font-bold text-gray-700 uppercase tracking-wider">
                              {t('label-language')}
                            </th>
                          </tr>
                        </thead>
                        {selectResource === 'bible' ? (
                          <tbody className="bg-white divide-y divide-gray-200  mb-44 ">
                            {(subMenuItems) && (
                          subMenuItems.map((ref) => (ref.value.type.flavorType.name === 'scripture'
                          && (
                            <tr className="hover:bg-gray-200" key={ref.value.identification.name.en + ref.projectDir}>
                              <td className="px-5 py-3 hidden">
                                <StarIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                              </td>
                              <td className="px-5 py-2.5 text-gray-600">
                                <div
                                  className="focus:outline-none"
                                  onClick={(e) => handleRowSelect(
                                    e,
                                    ref.value.languages[0].name.en,
                                    ref.projectDir,
                                    )}
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
                                  onClick={(e) => handleRowSelect(
                                    e,
                                    ref.value.languages[0].name.en,
                                    ref.projectDir,
                                  )}
                                  role="button"
                                  tabIndex="0"
                                >
                                  {ref.value.languages[0].name.en}
                                </div>
                              </td>
                            </tr>
                          )
                          ))
                        )}
                          </tbody>
                    ) : callResource(selectResource)}
                        {selectResource === 'obs' && (
                          <tbody className="bg-white divide-y divide-gray-200  mb-44 ">
                            {(subMenuItems) && (
                          subMenuItems.map((ref) => (ref.value.type.flavorType.name === 'gloss'
                          && (
                          <tr className="hover:bg-gray-200" key={ref.value.identification.name.en + ref.projectDir}>
                            <td className="px-5 py-3 hidden">
                              <StarIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                            </td>
                            <td className="px-5 py-2.5 text-gray-600">
                              <div
                                className="focus:outline-none"
                                onClick={(e) => handleRowSelect(
                                    e,
                                    ref.value.languages[0].name.en,
                                    ref.projectDir,
                                    )}
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
                                onClick={(e) => handleRowSelect(
                                    e,
                                    ref.value.languages[0].name.en,
                                    ref.projectDir,
                                    )}
                                role="button"
                                tabIndex="0"
                              >
                                {ref.value.languages[0].name.en}
                              </div>
                            </td>
                          </tr>
                          )
                          ))
                        )}
                          </tbody>
                    ) }
                      </table>

                      {selectResource === 'bible' || selectResource === 'obs' ? (
                        <div className="flex gap-6 mx-5 absolute bottom-5 right-0 justify-end z-10">
                          <button type="button" className="background-transparent outline-none">
                            <PlusCircleIcon className="h-11 w-11 m-5 text-primary" onClick={() => openResourceDialogBox()} />
                          </button>
                          <ImportResource
                            open={openImportResourcePopUp}
                            closePopUp={closeImportPopUp}
                            openPopUp={setOpenImportResourcePopUp}
                            setOpenResourcePopUp={setOpenResourcePopUp}
                            setLoading={setLoading}
                          />
                        </div>
                  ) : importResources(selectResource)}
                    </div>
                  )}
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

ResourcesPopUp.propTypes = {
  header: PropTypes.string,
  openResourcePopUp: PropTypes.bool,
  setOpenResourcePopUp: PropTypes.func,
  selectedResource: PropTypes.string,
  setReferenceResources: PropTypes.func,

};
