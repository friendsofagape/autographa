/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Disclosure, Transition } from '@headlessui/react';
import { useState } from 'react';

import PropTypes from 'prop-types';
import styles from './SelectReference.module.css';

export default function SelectVerse(props) {
  const {
    children,
    selectChapter,
    selectVerse,
  } = props;

  const [openChapter, setOpenChapter] = useState(true);
  const [openVerse, setOpenVerse] = useState(false);
  const [chapter, setChapter] = useState(1);
  const [verse, setVerse] = useState(1);

  function clickChapter(ev) {
    const chapter = ev.target.innerHTML;
    setChapter(chapter);
    // Pass to Parent
    selectChapter(chapter);

    setOpenChapter(false);
    setOpenVerse(true);
  }

  function clickVerse(ev) {
    const verse = ev.target.innerHTML;
    setVerse(verse);
    // Pass to Parent
    selectVerse(verse);
  }

  const chapters = [];

  for (let i = 1; i <= 70; i += 1) {
      chapters.push(i);
  }

  const verses = [];

  for (let i = 1; i <= 100; i += 1) {
    verses.push(i);
  }

  return (
    <>

      <div className="flex flex-row justify-between text-center bg-gray-800 font-semibold text-xs tracking-wider uppercase">
        <div className="grid grid-cols-3 gap-0 bg-gray-700">
          <div className={`px-3 pt-2 ${openVerse ? 'bg-black border-black' : 'bg-primary border-primary'} hover:bg-primary hover:border-primary border-b-4 cursor-pointer`}>
            Matthew
          </div>
          <div className={`px-3 pt-2 ${openVerse ? 'hover:bg-gray-600 border-gray-600' : 'bg-primary border-primary'} border-b-4 cursor-pointer`}>
            Chapter : &nbsp;
            {chapter}
          </div>
          <div className={`px-3 pt-2 ${openVerse ? 'bg-primary border-primary' : 'hover:bg-gray-600 border-gray-600'} border-b-4 cursor-pointer`}>
            Verse : &nbsp;
            {verse}
          </div>
        </div>
        <div className="flex justify-end">
          {children}
        </div>
      </div>
      <p className="p-8 text-sm leading-relaxed tracking-wide">
        18 Then Jesus came to them and said, “All authority in heaven and on earth has
        been given to me. 19 Therefore go and make disciples of all nations, baptizing
        them in the name of the Father and of the Son and of the Holy Spirit, 20 and
        teaching them to obey everything I have commanded you.
        And surely I am with you always, to the very end of the age.”
      </p>

      <Disclosure>
        {openChapter && (
        <Transition
          show={openChapter}
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Disclosure.Panel className="grid pb-5 grid-cols-10 text-center bg-black text-white text-xs font-medium tracking-wide uppercase" static>
            {chapters.map((ch) => (
              <div onClick={clickChapter} className={styles.select}>{ch}</div>
              ))}
          </Disclosure.Panel>
        </Transition>

        )}
      </Disclosure>

      <Disclosure>
        {openVerse && (
          <Transition
            show={openVerse}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className="grid pb-5 grid-cols-10 text-center bg-black text-white text-xs font-medium tracking-wide uppercase">
              {verses.map((v) => (
                <div onClick={clickVerse} className={styles.select}>{v}</div>
              ))}
            </Disclosure.Panel>

          </Transition>
        )}
      </Disclosure>

    </>

  );
}

SelectVerse.propTypes = {
  children: PropTypes.any,
  selectChapter: PropTypes.func,
  selectVerse: PropTypes.func,

};
