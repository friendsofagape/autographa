import PropTypes from 'prop-types';
import {
    Fragment, useState, useEffect, useContext,
} from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import * as logger from '../../../../logger';
// import { getTa } from './getTa';

export default function TaNavigation({ languageId }) {
  const [selected, setSelected] = useState('');
  const [query, setQuery] = useState('');
  const [taList, setTaList] = useState([]);
  const BaseUrl = 'https://git.door43.org/api/v1/repos/';

  const {
    state: {
        owner,
        taNavigationPath,
    },
    actions: {
        setTaNavigationPath,
      },
  } = useContext(ReferenceContext);

  const filteredData = query === ''
      ? taList
      : taList.filter((taData) => taData.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, '')));

    useEffect(() => {
      fetch(`${BaseUrl}${owner}/${languageId}_ta/contents/translate/`)
      .then((response) => response.json())
      .then((actualData) => {
        setTaList(actualData);
        setSelected(actualData[0].name);
      })
      .catch((err) => {
        // console.log("error fetch TA : ", err.message);
        logger.debug('In Fetch TA Content.js', `Error in Fetch : ${err.message}`);
       });
     }, [languageId, owner]);

    useEffect(() => {
        setTaNavigationPath(selected);
        }, [selected, setTaNavigationPath]);
  return (
    <div className="flex fixed">
      <div className="bg-grey text-danger py-0 uppercase tracking-wider text-xs font-semibold">
        <div aria-label="resource-bookname" className="px-3">
          <div className="sm:w-8/12 lg:w-10/12">
            <Combobox value={selected} onChange={setSelected}>
              <div className="relative mt-1">
                <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                  <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    displayValue={taNavigationPath}
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
                      key={`${taData.name}}`}
                      className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'text-red-900' : 'text-gray-900'
                          }`}
                      value={taData.name}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate text-left ml-2 ${
                              selected ? 'font-medium' : 'font-normal'
                              }`}
                          >
                            {taData.name}
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
};
