/* eslint-disable react/prop-types */
/* eslint-disable import/no-unresolved */
import React, {
  useRef, Fragment,
} from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { DocumentTextIcon } from '@heroicons/react/outline';

import styles from './ImportProjectPopUp.module.css';

export default function ImportProjectPopUp(props) {
  const {
    open,
    closePopUp,
  } = props;

  const cancelButtonRef = useRef(null);

  function close() {
    closePopUp(false);
  }

  return (
    <Transition
      show={open}
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
        open={open}
        onClose={close}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="flex items-center justify-center h-screen">
          <div className="w-5/12 h-3/6 items-center justify-center m-auto z-50 shadow overflow-hidden rounded">

            <div className="relative h-full rounded shadow overflow-hidden bg-white">

              <div className="flex justify-between items-center bg-secondary">
                <div className="uppercase bg-secondary text-white py-2 px-2 text-xs tracking-widest leading-snug rounded-tl text-center">
                  Import Project
                </div>
                <button
                  onClick={close}
                  type="button"
                  className="focus:outline-none"
                >
                  <img
                    src="/illustrations/close-button-black.svg"
                    alt="/"
                  />
                </button>
              </div>

              <div className="relative w-full h-5/6">
                <div className="overflow-auto w-full h-full no-scrollbars flex flex-col justify-between">
                  <div className="bg-white grid grid-cols-4 gap-2 p-4 text-sm text-left tracking-wide">
                    <div className={`${styles.select} group`}>
                      <DocumentTextIcon className="w-6 mr-2 group-hover:text-white" />
                      Mathew.md
                    </div>
                    <div className={`${styles.select} group`}>
                      <DocumentTextIcon className="w-6 mr-2 group-hover:text-white" />
                      Mark.md
                    </div>
                    <div className={`${styles.select} group`}>
                      <DocumentTextIcon className="w-6 mr-2 group-hover:text-white" />
                      Luke.md
                    </div>
                    <div className={`${styles.select} group`}>
                      <DocumentTextIcon className="w-6 mr-2 group-hover:text-white" />
                      John.md
                    </div>
                    <div className={`${styles.select} group`}>
                      <DocumentTextIcon className="w-6 mr-2 group-hover:text-white" />
                      Acts.md
                    </div>
                    <div className={`${styles.select} group`}>
                      <DocumentTextIcon className="w-6 mr-2 group-hover:text-white" />
                    </div>
                    <div className={`${styles.select} group`}>
                      <DocumentTextIcon className="w-6 mr-2 group-hover:text-white" />
                    </div>
                    <div className={`${styles.select} group`}>
                      <DocumentTextIcon className="w-6 mr-2 group-hover:text-white" />
                    </div>
                    <div className={`${styles.select} group`}>
                      <DocumentTextIcon className="w-6 mr-2 group-hover:text-white" />
                    </div>
                    <div className={`${styles.select} group`}>
                      <DocumentTextIcon className="w-6 mr-2 group-hover:text-white" />
                    </div>
                    <div className={`${styles.select} group`}>
                      <DocumentTextIcon className="w-6 mr-2 group-hover:text-white" />
                    </div>
                  </div>
                  <div className="flex gap-6 mx-5 justify-end">
                    <button type="button" className="py-2 px-6 rounded shadow bg-error text-white uppercase text-xs tracking-widest font-semibold">Cancel</button>
                    <button type="button" className="py-2 px-6 bg-primary rounded shadow text-white uppercase text-xs tracking-widest font-semibold">Upload</button>
                    <button type="button" className="py-2 px-7 rounded shadow bg-success text-white uppercase text-xs tracking-widest font-semibold">Import</button>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </Dialog>
    </Transition>
  );
}
