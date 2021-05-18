/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Disclosure, Transition } from '@headlessui/react';
import { useState } from 'react';

import PropTypes from 'prop-types';
import styles from './SelectReference.module.css';

export default function SelectBook(props) {
  const {
    children,
    selectBook,
  } = props;
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

  function clickBook(ev) {
    const book = ev.target.innerHTML;
    selectBook(book);
  }

  return (
    <>
      <div className="flex flex-row text-center bg-gray-800 text-white text-sm font-semibold tracking-wide uppercase">
        <div className="w-40 m-auto grid grid-cols-3 gap-0 bg-primary">
          <div onClick={toggle} className="p-2 bg-black hover:bg-primary backdrop-opacity-20 cursor-pointer">All</div>
          <div onClick={toggleNT} className="p-2 border-r-2 border-black hover:bg-black border-opacity-5 cursor-pointer">NT</div>
          <div onClick={toggleOT} className="p-2 hover:bg-black cursor-pointer">OT</div>
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
                <div className="bg-white grid grid-cols-4 p-4 text-xxs text-left font-bold tracking-wide uppercase">
                  <div onClick={clickBook} className={styles.select}>Matthew</div>
                  <div onClick={clickBook} className={styles.select}>Mark</div>
                  <div onClick={clickBook} className={styles.select}>Luke</div>
                  <div onClick={clickBook} className={styles.select}>John</div>
                  <div onClick={clickBook} className={styles.select}>Acts of the Apostles</div>
                  <div onClick={clickBook} className={styles.select}>Romans</div>
                  <div onClick={clickBook} className={styles.select}>1 Corinthians</div>
                  <div onClick={clickBook} className={styles.select}>2 Corinthians</div>
                  <div onClick={clickBook} className={styles.select}>Galatians</div>
                  <div onClick={clickBook} className={styles.select}>Ephesians</div>
                  <div onClick={clickBook} className={styles.select}>Phidivppians</div>
                  <div onClick={clickBook} className={styles.select}>Colossians</div>
                  <div onClick={clickBook} className={styles.select}>1 Thessalonians</div>
                  <div onClick={clickBook} className={styles.select}>2 Thessalonians</div>
                  <div onClick={clickBook} className={styles.select}>1 Timothy</div>
                  <div onClick={clickBook} className={styles.select}>2 Timothy</div>
                  <div onClick={clickBook} className={styles.select}>Titus</div>
                  <div onClick={clickBook} className={styles.select}>Philemon</div>
                  <div onClick={clickBook} className={styles.select}>Hebrews</div>
                  <div onClick={clickBook} className={styles.select}>James</div>
                  <div onClick={clickBook} className={styles.select}>1 Peter</div>
                  <div onClick={clickBook} className={styles.select}>2 Peter</div>
                  <div onClick={clickBook} className={styles.select}>1 John</div>
                  <div onClick={clickBook} className={styles.select}>2 John</div>
                  <div onClick={clickBook} className={styles.select}>3 John</div>
                  <div onClick={clickBook} className={styles.select}>Jude</div>
                  <div onClick={clickBook} className={styles.select}>Revelation</div>
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
                <div className="bg-white grid grid-cols-4 p-4 text-xxs text-left font-bold tracking-wide uppercase">
                  <div onClick={clickBook} className={styles.select}>Genesis</div>
                  <div onClick={clickBook} className={styles.select}>Exodus</div>
                  <div onClick={clickBook} className={styles.select}>Leviticus</div>
                  <div onClick={clickBook} className={styles.select}>Numbers</div>
                  <div onClick={clickBook} className={styles.select}>Deuteronomy</div>
                  <div onClick={clickBook} className={styles.select}>Joshua</div>
                  <div onClick={clickBook} className={styles.select}>Judges</div>
                  <div onClick={clickBook} className={styles.select}>Ruth</div>
                  <div onClick={clickBook} className={styles.select}>1 Samuel</div>
                  <div onClick={clickBook} className={styles.select}>2 Samuel</div>
                  <div onClick={clickBook} className={styles.select}>1 Kings</div>
                  <div onClick={clickBook} className={styles.select}>2 Kings</div>
                  <div onClick={clickBook} className={styles.select}>1 Chronicles</div>
                  <div onClick={clickBook} className={styles.select}>2 Chronicles</div>
                  <div onClick={clickBook} className={styles.select}>Ezra</div>
                  <div onClick={clickBook} className={styles.select}>Nehemiah</div>
                  <div onClick={clickBook} className={styles.select}>Esther</div>
                  <div onClick={clickBook} className={styles.select}>Job</div>
                  <div onClick={clickBook} className={styles.select}>Psalms</div>
                  <div onClick={clickBook} className={styles.select}>Proverbs</div>
                  <div onClick={clickBook} className={styles.select}>Ecclesiastes</div>
                  <div onClick={clickBook} className={styles.select}>Song of Songs</div>
                  <div onClick={clickBook} className={styles.select}>Isaiah</div>
                  <div onClick={clickBook} className={styles.select}>Jeremiah</div>
                  <div onClick={clickBook} className={styles.select}>Lamentations</div>
                  <div onClick={clickBook} className={styles.select}>Ezekiel</div>
                  <div onClick={clickBook} className={styles.select}>Daniel</div>
                  <div onClick={clickBook} className={styles.select}>Hosea</div>
                  <div onClick={clickBook} className={styles.select}>Joel</div>
                  <div onClick={clickBook} className={styles.select}>Amos</div>
                  <div onClick={clickBook} className={styles.select}>Obadiah</div>
                  <div onClick={clickBook} className={styles.select}>Jonah</div>
                  <div onClick={clickBook} className={styles.select}>Micah</div>
                  <div onClick={clickBook} className={styles.select}>Nahum</div>
                  <div onClick={clickBook} className={styles.select}>Habakkuk</div>
                  <div onClick={clickBook} className={styles.select}>Zephaniah</div>
                  <div onClick={clickBook} className={styles.select}>Haggai</div>
                  <div onClick={clickBook} className={styles.select}>Zechariah</div>
                  <div onClick={clickBook} className={styles.select}>Malachi</div>
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
};
