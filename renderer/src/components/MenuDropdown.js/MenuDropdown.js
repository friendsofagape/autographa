/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
import {
 Fragment, useContext, useEffect, useState,
} from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import * as localforage from 'localforage';
import { isElectron } from '../../core/handleElectron';
import { ReferenceContext } from '../context/ReferenceContext';

export default function MenuDropdown() {
  const [fonts, setFonts] = useState([]);
  const {
    state: {
      selectedFont,
    },
    actions: {
      setSelectedFont,
    },
  } = useContext(ReferenceContext);

  useEffect(() => {
      async function getFonts() {
            const _fonts = await localforage.getItem('font-family');
            fonts.push(_fonts);
            setFonts(fonts);
        }
      if (isElectron()) {
        getFonts();
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ width: '150%' }} className="w-100">
      <Listbox value={selectedFont} onChange={setSelectedFont}>
        <div style={{ width: '100%' }} className="relative mt-1 z-50">
          <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
            <span className="block truncate">{selectedFont}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              { fonts[0] && (
                fonts[0].map((font, personIdx) => (
                  <Listbox.Option
                    key={personIdx}
                    className={({ active }) => `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'}
                          cursor-default select-none relative py-2 pl-10 pr-4`}
                    value={font}
                  >
                    {({ selectedFont, active }) => (
                      <>
                        <span
                          className={`${
                          selectedFont ? 'font-medium' : 'font-normal'
                        } block truncate`}
                        >
                          {font}
                        </span>
                        {selectedFont ? (
                          <span
                            className={`${
                            active ? 'text-amber-600' : 'text-amber-600'
                          }
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                          >
                            <CheckIcon className="w-5 h-5" aria-hidden="true" />
                          </span>
                      ) : null}
                      </>
                  )}
                  </Listbox.Option>
              ))
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
