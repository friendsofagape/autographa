/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Disclosure, Transition } from '@headlessui/react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import { convertToRange } from '@/util/convertToRange';
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
  multiSelectVerse,
  selectedVerses,
  setSelectedVerses,
  verselectActive,
  setVerseSelectActive,
}) {
  const [controlVerseSelect, setControlVerseSelect] = useState([]);
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
    if (multiSelectVerse === false) { closeVerses(); }
  };

  const onMultiSelectVerse = async (e, verses) => {
    e.preventDefault();
      if (controlVerseSelect.includes(parseInt(verses, 10)) === false && verses) {
        const temp = [...controlVerseSelect];
          temp.push(parseInt(verses, 10));
          selectedVerses.push(parseInt(verses, 10));
          setControlVerseSelect(temp);
        }
  };

  useEffect(() => {
    const converMultiverseRange = async () => {
    if (multiSelectVerse && verselectActive) {
      const result = await convertToRange(selectedVerses);
      setSelectedVerses(result);
      setVerseSelectActive(false);
    }
  };
  converMultiverseRange();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verselectActive]);

  return (
    <>
      <div className="flex flex-row justify-between text-center font-semibold text-xs tracking-wider uppercase">
        <div className="grid grid-cols-3 gap-0 w-full bg-gray-700">
          <div className={`px-2 pt-2 ${openVerse ? 'bg-black border-black' : 'bg-primary border-primary'} hover:bg-primary hover:border-primary border-b-4 cursor-pointer`}>
            {bookName}
          </div>
          <div className={`px-2 pt-2 ${openVerse ? 'hover:bg-gray-600 border-gray-600' : 'bg-primary border-primary'} border-b-4 cursor-pointer`}>
            Chapter : &nbsp;
            {chapter}
          </div>
          <div className={`px-2 pt-2 ${openVerse ? 'bg-primary border-primary' : 'hover:bg-gray-600 border-gray-600'} border-b-4 cursor-pointer`}>
            Verse : &nbsp;
            {multiSelectVerse
            ? controlVerseSelect.join()
            : verse}
          </div>
        </div>
        <div className="flex justify-end">
          {children}
        </div>
      </div>

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
            <Disclosure.Panel className="grid py-5 grid-cols-10 gap-1 text-center bg-black text-white text-xs font-medium tracking-wide uppercase" static>
              {chapterList.map((chapter) => (
                <div
                  key={chapter.key}
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
          <Disclosure.Panel className="grid py-5 grid-cols-10 gap-1 text-center bg-black text-white text-xs font-medium tracking-wide uppercase">
            {verseList.map((verse) => (
              <div
                key={verse.key}
                style={{ color: controlVerseSelect.includes(parseInt(verse.key, 10)) ? 'seagreen' : '' }}
                onClick={(e) => {
                  // eslint-disable-next-line no-unused-expressions
                  multiSelectVerse
                  ? onMultiSelectVerse(e, verse.key)
                  : onVerseSelect(e, verse.key);
                  }}
                className={styles.select}
              >
                {verse.name}
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
