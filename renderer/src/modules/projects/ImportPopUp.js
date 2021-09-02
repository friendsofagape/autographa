/* eslint-disable react/prop-types */
/* eslint-disable import/no-unresolved */
import React, {
  useRef, Fragment,
} from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { DocumentTextIcon } from '@heroicons/react/outline';

import styles from './ImportPopUp.module.css';

export default function ImportProjectPopUp(props) {
  const {
    open,
    closePopUp,
  } = props;

  const cancelButtonRef = useRef(null);

  function close() {
    closePopUp(false);
  }

  const books = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'];

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
                <div className="uppercase bg-secondary text-white py-2 px-5 text-xs tracking-widest leading-snug rounded-tl text-center">
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

              <div className="relative w-full h-full">
                <div className="overflow-auto w-full h-full no-scrollbars flex flex-col justify-between relative">
                  <div className="bg-white grid grid-cols-4 gap-2 p-4 pb-24 text-sm text-left tracking-wide">
                    {
                      books.map((book) => (
                        <div className={`${styles.select} group`}>
                          <DocumentTextIcon className="w-6 mr-2 group-hover:text-white" />
                          {book}
                          .md
                        </div>
                      ))
                    }
                  </div>

                </div>
              </div>

              <div className="absolute bottom-0 right-0 left-0 bg-white">
                <div className="flex gap-6 mx-5 justify-end my-4">
                  <button type="button" className="py-2 px-6 rounded shadow bg-error text-white uppercase text-xs tracking-widest font-semibold">Delete</button>
                  <button type="button" className="py-2 px-6 bg-primary rounded shadow text-white uppercase text-xs tracking-widest font-semibold">Upload</button>
                  <button type="button" className="py-2 px-7 rounded shadow bg-success text-white uppercase text-xs tracking-widest font-semibold">Import</button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </Dialog>
    </Transition>
  );
}
