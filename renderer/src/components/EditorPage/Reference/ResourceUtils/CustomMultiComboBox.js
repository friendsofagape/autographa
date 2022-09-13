import React, { useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { SelectorIcon } from '@heroicons/react/outline';
import PropTypes from 'prop-types';

function CustomMultiComboBox({ selectedList, setSelectedList, customData }) {
    const [query, setQuery] = useState('');
    const filteredData = query === ''
        ? customData
        : customData.filter((data) => data.name.toLowerCase().includes(query.toLowerCase()));
            return (
              <>
                {/* {selectedList.length > 0 && (
                  <div className="absolute bg-white p-2 right-auto">
                    <ul>
                      {selectedList.map((person) => (
                        <li key={person.id}>{person.name}</li>
                          ))}
                    </ul>
                  </div>
                    )} */}
                <Combobox value={selectedList} onChange={setSelectedList} multiple>
                  <div className="relative mt-1">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                      <Combobox.Input
                        className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                        displayValue="Select one or Multiple"
                        placeholder="Select one or Multiple "
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
                      as={React.Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                      afterLeave={() => setQuery('')}
                    >
                      <Combobox.Options className="absolute w-full z-40 mt-1 max-h-48 scrollbars-width overflow-auto rounded-md bg-white py-1 px-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm cursor-pointer">
                        {filteredData.map((data) => (
                          <Combobox.Option className={selectedList.includes(data) ? 'bg-gray-400' : ''} key={data.id} value={data}>
                            {data.name}
                          </Combobox.Option>
                        ))}
                      </Combobox.Options>
                    </Transition>
                  </div>
                </Combobox>
              </>
            );
}

CustomMultiComboBox.propTypes = {
    selectedList: PropTypes.array,
    customData: PropTypes.array,
    setSelectedList: PropTypes.func,
  };

export default CustomMultiComboBox;
