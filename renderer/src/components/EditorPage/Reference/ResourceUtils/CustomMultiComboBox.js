import React, { useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
// import { SelectorIcon } from '@heroicons/react/outline';
import PropTypes from 'prop-types';

function CustomMultiComboBox({
 selectedList, setSelectedList, customData, filterParams = 'name',
}) {
    let filteredData = [];
    const [query, setQuery] = useState('');
    const [isActive, setIsActive] = useState(false);
    // const [differenceArr, setDifferenceArr] = useState(customData);
    if (customData.length === 1) {
      setSelectedList(customData);
    } else if (customData.length > 1) {
      // eslint-disable-next-line no-nested-ternary
      filteredData = (query === '')
      ? customData.slice(0, 100).concat(selectedList.filter((item) => customData.slice(0, 100).indexOf(item) === -1))
      : (query.length >= 2)
      ? customData.filter((data) => data[filterParams].toLowerCase().includes(query.toLowerCase()))
      : [];
    }

    React.useState(() => {
      // const isSameUser = (a, b) => a.value === b.value && a.display === b.display;
    }, []);
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
                {customData.length > 1 ? (
                  <Combobox value={selectedList} onChange={setSelectedList} multiple>
                    {({ open }) => (
                      <div className="relative mt-1">
                        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                          <Combobox.Input
                            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                            displayValue=""
                            placeholder={`${selectedList.length > 0 ? `${selectedList[0][filterParams] }... click for more` : 'Select Language'}`}
                            onFocus={() => !open && setIsActive(true)}
                            onBlur={() => setIsActive(false)}
                            onChange={(event) => setQuery(event.target.value)}
                          />
                          {/* <Combobox.Button
                            className="absolute z-99 inset-y-0 right-0 flex items-center pr-2"
                            onClick={() => (open || isActive ? setIsActive(false) : setIsActive(true))}
                          > */}
                          {/* <SelectorIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            /> */}
                          {/* </Combobox.Button> */}
                        </div>
                        <Transition
                          show={open || isActive}
                          as={React.Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                          afterLeave={() => setQuery('')}
                        >
                          <Combobox.Options className="absolute w-full z-40 mt-1 max-h-48 scrollbars-width overflow-auto rounded-md bg-white py-1 px-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm cursor-pointer">
                            <div className="flex-col">
                              {selectedList.length > 0 && !query.length > 0 && (
                              <div className="pb-2 bg-gray-100">
                                <span className="text-xs font-medium">Selected Items</span>
                                <hr className="mb-1" />
                                {selectedList.map((selectedData) => (
                                  <Combobox.Option key={selectedData?.id || selectedData?.pk} className=" hover:bg-gray-300 p-1 italic" value={selectedData}>
                                    {selectedData[filterParams]}
                                  </Combobox.Option>
                                  ))}
                              </div>
                              )}
                              <div>
                                {selectedList.length > 0 && !query.length > 0 && <div className="mt-1 mb-2 h-[.1rem] w-full bg-secondary" />}
                                {filteredData.map((data) => (
                                  <Combobox.Option key={data?.id || data?.pk} className={`${selectedList.includes(data) ? 'bg-gray-400' : ''} hover:bg-gray-300 p-1`} value={data}>
                                    {/* // <Combobox.Option key={data?.id || data?.pk} className=" hover:bg-gray-300 p-1" value={data}> */}
                                    {data[filterParams]}
                                  </Combobox.Option>
                                ))}
                              </div>
                            </div>
                          </Combobox.Options>
                        </Transition>
                      </div>
                    )}
                  </Combobox>
                ) : (
                  // only one item in dropdown
                  <div className="relative mt-1">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lgtext-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                      <input
                        type="text"
                        value={customData[0][filterParams]}
                        disabled
                        className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 bg-gray-300 text-gray-900 focus:ring-0"
                      />
                    </div>
                  </div>
                )}
              </>
            );
}

CustomMultiComboBox.propTypes = {
    selectedList: PropTypes.array,
    customData: PropTypes.array,
    filterParams: PropTypes.string,
    setSelectedList: PropTypes.func,
  };

export default CustomMultiComboBox;
