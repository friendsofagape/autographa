/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import {
  LockOpenIcon,
  LockClosedIcon,
  BookmarkIcon,
  CogIcon,
  AnnotationIcon,
  BellIcon,
  MenuIcon,
  XIcon,
} from '@heroicons/react/outline';
import {
  Disclosure, Menu, Transition,
} from '@headlessui/react';
import Link from 'next/link';
import {
  ChevronDownIcon, DotsVerticalIcon,
} from '@heroicons/react/solid';

import * as localforage from 'localforage';
import {
 Fragment, useContext, useEffect, useState,
} from 'react';
import CustomNavigation from '@/components/EditorPage/Navigation/CustomNavigation';
import BibleNavigation from '@/modules/biblenavigation/BibleNavigation';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import { ProjectContext } from '@/components/context/ProjectContext';
// eslint-disable-next-line import/no-unresolved
import { classNames } from '@/util/classNames';
import FootNotesIcon from '@/icons/footnotes.svg';
import CrossReferenceIcon from '@/icons/crossreference.svg';
// import styles from './Editor.module.css';
const profile = ['Your Profile'];

export default function Editor({
  children,
}) {
  const {
    states: {
      scrollLock,
    },
    actions: {
      setScrollLock,
    },
  } = useContext(ProjectContext);
  const {
    state: {
      selectedFont,
      fontSize,
      bookmarksVerses,
      bookId,
      bookName,
      chapter,
      verse,
      projectScriptureDir,
    },
    actions: {
      setBookmarksVerses,
      setProjectScriptureDir,
    },
  } = useContext(ReferenceContext);
  const [bookMarked, setBookMarks] = useState(false);

  const handleUnlockScroll = (e) => {
    e.preventDefault();
    setScrollLock(!scrollLock);
  };

  useEffect(() => {
      if (((bookmarksVerses?.find((x) => x.bookname === bookName && x.chapter === chapter)
            !== undefined))) {
        setBookMarks(true);
      } else {
        setBookMarks(false);
      }
  }, [bookName, bookmarksVerses, chapter]);

  const updateBookMarksDB = (bookmarksVerses) => {
    localforage.getItem('currentProject').then((projectName) => {
      const _projectname = projectName?.split('_');
      localforage.getItem('projectmeta').then((value) => {
        Object?.entries(value).forEach(
          ([_columnnum, _value]) => {
            Object?.entries(_value).forEach(
              ([_rownum, resources]) => {
                if (resources.identification.name.en === _projectname[0]) {
                  // eslint-disable-next-line no-param-reassign
                  resources.project.textTranslation.bookMarks = [...bookmarksVerses];
                  localforage.setItem('projectmeta', value).then((val) => {
                    localforage.setItem('projectmeta', value).then((val) => {
                      // eslint-disable-next-line no-console
                      console.log(val.projects);
                    });
                  });
                }
              },
            );
          },
        );
      });
    });
  };

  const handleBookmarks = (e) => {
    const temp = [...bookmarksVerses];
    if (bookmarksVerses.length !== 0) {
      bookmarksVerses.every((markedVerses) => {
        if (bookmarksVerses.find((x) => x.bookname === bookName && x.chapter === chapter)
        !== undefined) {
          const selectedIndex = bookmarksVerses.indexOf(bookmarksVerses.find((x) => x.bookname === bookName && x.chapter === chapter));
          bookmarksVerses.splice(selectedIndex, 1);
          setBookMarks(false);
        }
        if (markedVerses.bookname === bookName && markedVerses.chapter !== chapter) {
          if (bookmarksVerses.find((x) => x.bookname === bookName && x.chapter === chapter)
          === undefined) {
            temp.push({ bookname: bookName, chapter });
            bookmarksVerses.push({ bookname: bookName, chapter });
            setBookmarksVerses(temp);
            setBookMarks(true);
          } else {
            setBookMarks(false);
            const selectedIndex = bookmarksVerses.indexOf(bookmarksVerses.find((x) => x.bookname === bookName && x.chapter === chapter));
            bookmarksVerses.splice(selectedIndex, 1);
          }
        }
        if (markedVerses.bookname !== bookName) {
           if (bookmarksVerses.find((x) => x.bookname === bookName && x.chapter === chapter) === undefined) {
            const selectedIndex = bookmarksVerses.indexOf({ bookname: bookName, chapter });
            temp.push({ bookname: bookName, chapter });
            bookmarksVerses.push({ bookname: bookName, chapter });
            setBookmarksVerses(temp);
            setBookMarks(true);
          } else {
            setBookMarks(false);
            const selectedIndex = bookmarksVerses.indexOf(bookmarksVerses.find((x) => x.bookname === bookName && x.chapter === chapter));
            bookmarksVerses.splice(selectedIndex, 1);
          }
        }
      });
    } else {
            temp.push({ bookname: bookName, chapter });
            bookmarksVerses.push({ bookname: bookName, chapter });
            setBookmarksVerses(temp);
            setBookMarks(true);
    }
    updateBookMarksDB(bookmarksVerses);
  };

  return (
    <>
      <div className="flex flex-col bg-white border-b-2 border-secondary rounded-md shadow h-editor scrollbar-width">
        <div className="flex flex-wrap items-center justify-between bg-secondary ">
          <BibleNavigation />
          {/* <div className="text-center h-6 rounded-t text-gray-100  text-xs uppercase tracking-widest font-bold leading-3">
          <div className="text-center pt-1">
            Editor
          </div>
        </div> */}
          <div aria-label="editor-pane" className="h-4 flex flex-1 justify-center text-white text-xxs uppercase tracking-wider font-bold leading-3 truncate">
            Editor
          </div>
          <div title="navigation lock/unlock" className="flex items-center">
            {scrollLock === true ? (
              <div>
                <LockOpenIcon aria-label="open-lock" onClick={() => setScrollLock(!scrollLock)} className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
            )
          : (
            <div>
              <LockClosedIcon aria-label="close-lock" onClick={(e) => handleUnlockScroll(e)} className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
          )}
            <div
              onClick={(event) => handleBookmarks(event)}
              role="button"
              tabIndex="0"
              title="bookmark"
              className="mx-1 px-2 focus:outline-none border-r-2 border-l-2 border-white border-opacity-10"
            >
              <BookmarkIcon className={`${bookMarked ? 'fill-current' : ''}  h-5 w-5 text-white`} aria-hidden="true" />

            </div>
            {/* <Menu as="div" className="px-2 py-1 focus:outline-none border-r-1 border-white border-opacity-10">
            {({ open }) => (
              <>
                <div>
                  <Menu.Button>
                    <DotsVerticalIcon className="h-5 w-5 focus:outline-none text-white" aria-hidden="true" />
                  </Menu.Button>
                </div>
                <Transition
                  show={open}
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items
                    static
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <Menu.Item>
                      {({ active }) => (
                        <>
                          <div>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                className={classNames(
                                          active ? 'bg-gray-100' : '',
                                          'block ml-5 mx-1 px-2 py-2 text-sm text-gray-700 form-checkbox',
                                        )}
                              />
                              <span className="ml-3">Verse per line</span>
                            </label>
                          </div>
                        </>
                        )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu> */}
            {/* <div className="mr-2">
            <CogIcon className="h-5 w-5 text-white" aria-hidden="true" />
          </div> */}
          </div>
        </div>
        <div
          style={{
                fontFamily: selectedFont || 'sans-serif',
                fontSize: `${fontSize}rem`,
                lineHeight: (fontSize > 1.3) ? 1.5 : '',
                direction: `${projectScriptureDir === 'RTL' ? 'rtl' : 'auto'}`,
        }}
          className="border-l-2 border-r-2 border-secondary pb-16 prose-sm max-w-none overflow-auto h-full scrollbars-width"
        >
          {children}
          {/* styled editor */}

          {/* <>
          <h3 className="text-secondary">Jesus Has Risen</h3>
          <p>
            <sup className={styles.verseNumber}>1</sup>
            After the Sabbath, at dawn on the first day of the week,
            Mary Magdalene and the other Mary went to look at the tomb.
            <span className={styles.editToolWrap}>
              <AnnotationIcon className={styles.editTool} aria-hidden="true" />
            </span>
          </p>
          <p>
            <sup className={styles.verseNumber}>2</sup>
            There was a violent earthquake, for an angel of
            <span className={styles.editToolWrap}>
              <FootNotesIcon fill="currentColor" className={styles.editTool} aria-hidden="true" />
            </span>
            the Lord came down from heaven and,
            going to the tomb, rolled back the stone and sat on it.
          </p>
          <p>
            <sup className={styles.verseNumber}>3</sup>
            His appearance was like lightning, and his clothes were white as snow.
            <span className={styles.editToolWrap}>
              <CrossReferenceIcon
                fill="currentColor"
                className={styles.editTool}
                aria-hidden="true"
              />
            </span>
          </p>
          <p>
            <sup className={styles.verseNumber}>4</sup>
            The guards were so afraid of him that they shook and became like dead men.
          </p>
          <p>
            <sup className={styles.verseNumber}>5</sup>
            The angel said to the women,
            “Do not be afraid, for I know that you are looking for Jesus, who was crucified.
          </p>
          <p>
            <sup className={styles.verseNumber}>6</sup>
            He is not here; he has risen, just as he said. Come and see the place where he lay.
          </p>
          <p>
            <sup className={styles.verseNumber}>7</sup>
            Then go quickly and tell his disciples:
            ‘He has risen from the dead and is going ahead
            of you into Galilee. There you will see him.’ Now I have told you.”
          </p>
          <p>
            <sup className={styles.verseNumber}>8</sup>
            So the women hurried away from the tomb,
            afraid yet filled with joy, and ran to tell his disciples.
          </p>
          <p>
            <sup className={styles.verseNumber}>9</sup>
            Suddenly Jesus met them.
            <span className={styles.redLetters}>“Greetings,”</span>
            he said. They came to him, clasped his feet and worshiped him.
          </p>
          <p>
            <sup className={styles.verseNumber}>10</sup>
            Then Jesus said to them,
            <span className={styles.redLetters}>
              “Do not be afraid. Go and tell my brothers to go to Galilee; there they will see me.”
            </span>
          </p>
          <h3>The Guards’ Report</h3>
          <p>
            <sup className={styles.verseNumber}>11</sup>
            While the women were on their way,
            some of the guards went into the city and
            reported to the chief priests everything that had happened.
          </p>
          <p>
            <sup className={styles.verseNumber}>12</sup>
            When the chief priests had met with the elders
            and devised a plan, they gave the soldiers a large sum of money,
          </p>
          <p>
            <sup className={styles.verseNumber}>13</sup>
            telling them, “You are to say, ‘His disciples came
            during the night and stole him away while we were asleep.’
          </p>
          <p>
            <sup className={styles.verseNumber}>14</sup>
            If this report gets to the governor, we will satisfy him and keep you out of trouble.”
          </p>
          <p>
            <sup className={styles.verseNumber}>15</sup>
            So the soldiers took the money and did as they were instructed.
            And this story has been widely circulated among the Jews to this very day.
          </p>
          <h3>The Great Commission</h3>
          <p>
            <sup className={styles.verseNumber}>16</sup>
            Then the eleven disciples went to Galilee,
            to the mountain where Jesus had told them to go.
          </p>
          <p>
            <sup className={styles.verseNumber}>17</sup>
            When they saw him, they worshiped him; but some doubted.
          </p>
          <p>
            <sup className={styles.verseNumber}>18</sup>
            Then Jesus came to them and said,
            {' '}
            <span className={styles.redLetters}>
              “All
              authority in heaven and on earth has been given to me.

            </span>
          </p>
          <p>
            <sup className={styles.verseNumber}>19</sup>
            <span className={styles.redLetters}>
              Therefore go
              and make disciples of all nations, baptizing
              them in the name of the Father and of the Son
              and of the Holy Spirit, 20 and teaching them to obey

            </span>
          </p>
          <p>
            <sup className={styles.verseNumber}>20</sup>
            <span className={styles.redLetters}>
              everything
              I have commanded you. And surely I am with you always, to the very end of the age.”

            </span>
          </p>
        </> */}
        </div>
      </div>
    </>
  );
}

Editor.propTypes = {
  children: PropTypes.any,
};
