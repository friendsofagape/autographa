/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Disclosure, Transition } from '@headlessui/react';
import React, { useState } from 'react';

import PropTypes from 'prop-types';
import styles from './SelectReference.module.css';

export default function SelectBook({
  children,
  bookList,
  selectBook,
  onChangeBook,
  multiSelectBook,
  selectedBooks,
  setSelectedBooks,
 }) {
  const [openNT, setOpenNT] = useState(true);
  const [openOT, setOpenOT] = useState(true);

  function toggleNT() {
    setOpenNT(true);
    setOpenOT(false);
  }

  function toggleOT() {
    setOpenOT(true);
    setOpenNT(false);
  }

  function toggle() {
    setOpenNT(true);
    setOpenOT(true);
  }

  function bookSelect(e, bookId) {
    e.preventDefault();
    onChangeBook(bookId);
    if (multiSelectBook === false) { selectBook(); }
  }

  function selectMultipleBooks(e, bookID) {
    if (selectedBooks.includes(bookID.toUpperCase()) === false) {
      const _selectedBooks = [...selectedBooks];
      _selectedBooks.push(bookID.toUpperCase());
      setSelectedBooks(_selectedBooks);
    } else {
      const _selectedBooks = [...selectedBooks];
      const selectedIndex = _selectedBooks.indexOf(bookID.toUpperCase());
      _selectedBooks.splice(selectedIndex, 1);
      setSelectedBooks(_selectedBooks);
    }
  }
  React.useEffect(() => {
    if (selectedBooks.length === 39) {
      toggleOT();
    } else if (selectedBooks.length === 27) {
      toggleNT();
    } else {
      toggle();
    }
  }, [selectedBooks]);
  return (
    <>
      <div className="flex flex-row text-center bg-gray-800 text-white text-sm font-bold tracking-wide uppercase">
        <div className="w-40 m-auto grid grid-cols-3 gap-0 bg-primary">
          <div onClick={toggle} className="p-2 bg-black hover:bg-primary backdrop-opacity-20 cursor-pointer">All</div>
          <div onClick={toggleNT} className={openNT === false ? 'p-2 bg-black hover:bg-primary backdrop-opacity-20 cursor-pointer' : 'p-2 border-r-2 border-black hover:bg-black border-opacity-5 cursor-pointer'}>NT</div>
          <div onClick={toggleOT} className={openOT === false ? 'p-2 bg-black hover:bg-primary backdrop-opacity-20 cursor-pointer' : 'p-2 border-r-2 border-black hover:bg-black border-opacity-5 cursor-pointer'}>OT</div>
        </div>
        <div className="flex justify-end">
          {children}
        </div>
      </div>

      <Disclosure>
        {openNT && (
          <>
            <div className="p-2 text-center bg-gray-200 text-gray-700 text-xs font-semibold tracking-wide uppercase cursor-pointer">
              new testament
            </div>
            <Transition
              show={openNT}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel static>
                <div className="bg-white grid grid-cols-4 gap-1 p-4 text-xxs text-left font-bold tracking-wide uppercase">
                  {bookList.map((book, index) => (index > 38 && (
                  <div
                    key={book.name}
                    onClick={(e) => (multiSelectBook
                    ? selectMultipleBooks(e, book.key, book.name)
                    : bookSelect(e, book.key, book.name))}
                    className={`${styles.select} ${selectedBooks.includes((book.key).toUpperCase()) ? styles.active : ''}`}
                  >
                    {book.name}
                  </div>
                    )
                  ))}
                </div>
              </Disclosure.Panel>
            </Transition>
          </>
        )}

      </Disclosure>

      <Disclosure>
        {openOT && (
          <>
            <div className="p-2 text-center bg-gray-200 text-gray-700 text-xs font-semibold tracking-wide uppercase cursor-pointer">
              old testament
            </div>
            <Transition
              show={openOT}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel static>
                <div className="bg-white grid grid-cols-4 gap-1 p-4 text-xxs text-left font-bold tracking-wide uppercase">
                  {bookList.map((book, index) => (
                      index <= 38 && (
                        <div
                          key={book.name}
                          onClick={(e) => (
                          multiSelectBook
                          ? selectMultipleBooks(e, book.key, book.name)
                          : bookSelect(e, book.key, book.name))}
                          className={`${styles.select} ${selectedBooks.includes((book.key).toUpperCase()) ? styles.active : ''}`}
                        >
                          {book.name}
                        </div>
                    )
                  ))}
                </div>
              </Disclosure.Panel>
            </Transition>
          </>
        )}

      </Disclosure>
    </>
  );
}

SelectBook.propTypes = {
  children: PropTypes.any,
  selectBook: PropTypes.func,
  onChangeBook: PropTypes.func,
  bookList: PropTypes.array,
  selectedBooks: PropTypes.array,
  multiSelectBook: PropTypes.bool,
  setSelectedBooks: PropTypes.func,
};
