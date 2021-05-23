/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Disclosure, Transition } from '@headlessui/react';
import { useState } from 'react';

import PropTypes from 'prop-types';
import styles from './SelectReference.module.css';

export default function SelectVerse({
  children,
  bookName,
  chapter,
  verse,
  chapterList,
  verseList,
  onChangeChapter,
  onChangeVerse,
  closeBooks,
  closeVerses,
}) {
  const [openChapter, setOpenChapter] = useState(true);
  const [openVerse, setOpenVerse] = useState(false);

  const onChapterSelect = (e, chapterNum) => {
    e.preventDefault();
    onChangeChapter(chapterNum);
    setOpenChapter(false);
    setOpenVerse(true);
  };

  const onVerseSelect = (e, verseNum) => {
    e.preventDefault();
    onChangeVerse(verseNum);
    closeBooks();
    closeVerses();
  };

  return (
    <>

      <div className="flex flex-row justify-between text-center bg-gray-800 font-semibold text-xs tracking-wider uppercase">
        <div className="grid grid-cols-3 gap-0 bg-gray-700">
          <div className={`px-3 pt-2 ${openVerse ? 'bg-black border-black' : 'bg-primary border-primary'} hover:bg-primary hover:border-primary border-b-4 cursor-pointer`}>
            {bookName}
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
              {chapterList.map((chapter) => (
                <div
                  onClick={(e) => { onChapterSelect(e, chapter.key); }}
                  className={styles.select}
                >
                  {chapter.name}
                </div>
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
              {verseList.map((v) => (
                <div
                  onClick={(e) => { onVerseSelect(e, v.key); }}
                  className={styles.select}
                >
                  {v.name}

                </div>
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
  bookName: PropTypes.string,
  chapter: PropTypes.string,
  verse: PropTypes.string,
  chapterList: PropTypes.array,
  verseList: PropTypes.array,
  onChangeChapter: PropTypes.func,
  onChangeVerse: PropTypes.func,
  closeBooks: PropTypes.func,
  closeVerses: PropTypes.func,
};
