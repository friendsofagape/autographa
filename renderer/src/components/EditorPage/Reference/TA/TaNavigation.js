import PropTypes from 'prop-types';
import {
    Fragment, useState, useEffect, useContext,
} from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import localForage from 'localforage';
import * as logger from '../../../../logger';

const fs = window.require('fs');

export default function TaNavigation({ languageId, referenceResources }) {
  const [selected, setSelected] = useState('');
  // const [hovered, setHovered] = useState(null);
  const [query, setQuery] = useState('');
  const [taList, setTaList] = useState([]);
  const BaseUrl = 'https://git.door43.org/api/v1/repos/';

  // const setHover = (index) => {
  //   setHovered(index);
  // };

  // const unsetHover = () => {
  //   setHovered(null);
  // };

  const {
    state: {
        owner,
        // taNavigationPath,
    },
    actions: {
        setTaNavigationPath,
      },
  } = useContext(ReferenceContext);

  const filteredData = query === ''
      ? taList
      : taList.filter((taData) => taData.title
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, '')));

    useEffect(() => {
      if (referenceResources && referenceResources?.offlineResource?.offline) {
        // offline
        const taArrayOffline = [];
        const { offlineResource } = referenceResources;
        // console.log('offline data : ', { taList, offlineResource });
        localForage.getItem('userProfile').then(async (user) => {
          logger.debug('TaNavigation.js', 'reading offline helps ', offlineResource.data?.projectDir);
          const path = require('path');
          const newpath = localStorage.getItem('userPath');
          const currentUser = user?.username;
          const folder = path.join(newpath, 'autographa', 'users', `${currentUser}`, 'resources');
          const projectName = `${offlineResource?.data?.value?.meta?.name}_${offlineResource?.data?.value?.meta?.owner}_${offlineResource?.data?.value?.meta?.release?.tag_name}`;
          if (fs.existsSync(path.join(folder, projectName, 'translate'))) {
            fs.readdir(path.join(folder, projectName, 'translate'), async (err, folderNames) => {
              if (err) {
                // console.log(`Unable to scan directory: ${ err}`);
                logger.debug('TaNavigation.js', `Unable to scan directory: ${ err}`);
              }
              let foldersCount = 0;
              await folderNames.forEach(async (folderName) => {
                if (fs.lstatSync(path.join(folder, projectName, 'translate', folderName)).isDirectory()) {
                  foldersCount += 1;
                  const title = await fs.readFileSync(path.join(folder, projectName, 'translate', folderName, 'title.md'), 'utf8');
                  const subTitle = await fs.readFileSync(path.join(folder, projectName, 'translate', folderName, 'sub-title.md'), 'utf8');
                  taArrayOffline.push({ folder: folderName, title, subTitle });
                }
                if (taArrayOffline.length === foldersCount) {
                  setTaList(taArrayOffline);
                  setSelected(taArrayOffline[0]);
                }
              });
            });
          }
        });
      } else {
        // online
        const taArray = [];
      fetch(`${BaseUrl}${owner}/${languageId}_ta/contents/translate/`)
      .then((response) => response.json())
      .then((actualData) => {
        const fetchData = async (actualData) => {
          actualData.forEach((element) => {
            const pattern = /^.*\.(yml|yaml)/gm;
            if (!pattern.test(element.name.toLowerCase())) {
              const tempObj = {};
            tempObj.folder = element.name;
            fetch(`${BaseUrl}${owner}/${languageId}_ta/raw/translate/${element.name}/title.md`)
              .then((response) => response.text())
              .then((data) => {
                tempObj.title = data;
              });
            fetch(`${BaseUrl}${owner}/${languageId}_ta/raw/translate/${element.name}/sub-title.md`)
                .then((response) => response.text())
                .then((data) => {
                  tempObj.subTitle = data;
                });
                taArray.push(tempObj);
                // console.log("array : ", taArray);
            }
          });
        };

        const getData = async () => {
          await fetchData(actualData);
          setTaList(taArray);
          setSelected(taArray[0]);
        };

        getData();
      })
      .catch((err) => {
        logger.debug('In Fetch TA Content.js', `Error in Fetch : ${err.message}`);
       });
      }
     }, [languageId, owner, referenceResources]);

    useEffect(() => {
        setTaNavigationPath(selected.folder);
        }, [selected, setTaNavigationPath]);
  return (
    <div className="flex fixed">
      <div className="bg-grey text-danger py-0 uppercase tracking-wider text-xs font-semibold">
        <div aria-label="resource-bookname" className="px-1">
          <div className="sm:w-8/12 lg:w-10/12">
            <Combobox value={selected.title} onChange={setSelected}>
              <div className="relative mt-1">
                <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                  <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    displayValue={selected.title}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  <Combobox.Button className="absolute z-99 inset-y-0 right-0 flex items-center pr-2">
                    <SelectorIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                </div>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setQuery('')}
                >
                  <Combobox.Options className="absolute z-40 mt-1 max-h-48 scrollbars-width overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredData.length === 0 && query !== '' ? (
                      <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Nothing found.
                      </div>
                  ) : (
                  filteredData.map((taData) => (
                    <Combobox.Option
                      key={`${taData.folder}}`}
                      className={({ active }) => `relative cursor-default w-4/5 lg:w-96 select-none py-1.5 px-4 ${
                          active ? 'text-primary bg-gray-200' : 'text-gray-900'
                          }`}
                      value={taData}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate whitespace-normal text-left text-sm ml-2 ${
                              selected ? 'font-medium' : 'font-normal'
                              }`}
                            // onMouseEnter={() => setHover(index)}
                            // onMouseLeave={() => unsetHover()}
                            title={taData.subTitle}
                          >
                            {taData.title}
                            {/* {hovered === index ? taData.subTitle : taData.title} */}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? 'text-white' : 'text-teal-600'
                              }`}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                  )}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>
          </div>
        </div>

      </div>
    </div>
  );
}

TaNavigation.propTypes = {
  languageId: PropTypes.string,
  referenceResources: PropTypes.object,
};
