import { Dialog, Transition } from '@headlessui/react';
import {
 Fragment, useContext, useEffect, useRef, useState,
} from 'react';
import SelectBook from '@/components/EditorPage/Navigation/reference/SelectBook';
import SelectVerse from '@/components/EditorPage/Navigation/reference/SelectVerse';
import { XIcon } from '@heroicons/react/solid';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import { IconButton } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default function BibleNavigation() {
    const supportedBooks = null; // if empty array or null then all books available
      const {
     state: {
        bookList,
        bookName,
        chapter,
        verse,
        chapterList,
        verseList,
     }, actions: {
        onChangeBook,
        onChangeChapter,
        onChangeVerse,
        applyBooksFilter,
      },
    } = useContext(ReferenceContext);

    useEffect(() => {
        applyBooksFilter(supportedBooks);
      }, [applyBooksFilter, supportedBooks]);

    const [openBook, setOpenBook] = useState(false);
    const [openVerse, setOpenVerse] = useState(false);
    const cancelButtonRef = useRef(null);

    const [multiSelectVerse] = useState(false);
    const [multiSelectBook] = useState(false);
    const [selectedVerses, setSelectedVerses] = useState([]);
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [verselectActive, setVerseSelectActive] = useState(false);

    function closeBooks() {
      setOpenBook(false);
    }

    function openBooks() {
      setOpenBook(true);
    }

    function closeVerses() {
      setOpenVerse(false);
      if (multiSelectVerse) { setVerseSelectActive(true); }
    }

    function selectBook() {
      setOpenBook(false);
      setOpenVerse(true);
      if (multiSelectVerse) { setSelectedVerses([]); }
    }

    return (
      <>
        <span className="items-center justify-center">
          <span
            className="px-2 py-2 pr-0 text-sm uppercase font-medium text-white bg-gray-800 bg-opacity-90"
          >
            {bookName}
            <span style={{ marginLeft: '6px' }} className="px-2 py-2 pl-0 pr-0 text-sm font-medium text-white bg-gray-900 bg-opacity-90 hover:bg-opacity-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
              <IconButton
                style={{ width: '30px' }}
                onClick={openBooks}
              >
                <ExpandMoreIcon fontSize="small" color="secondary" />
              </IconButton>
            </span>
          </span>
          <span
            className="px-2 py-2 pr-0.5 text-sm font-medium text-white bg-gray-900 bg-opacity-90"
          >
            {chapter}
            <span style={{ marginLeft: '6px' }} className="px-2 py-2 pl-0 pr-0 text-sm font-medium text-white bg-gray-900 bg-opacity-90 hover:bg-opacity-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
              <IconButton
                style={{ width: '30px', marginLeft: '2px' }}
                onClick={selectBook}
              >
                <ExpandMoreIcon fontSize="small" color="secondary" />
              </IconButton>
            </span>
          </span>
          <span
            className="px-2 py-2 text-sm uppercase font-medium text-white bg-gray-800 bg-opacity-90"
          >
            VERSE:
            {' '}
            {multiSelectVerse
            ? selectedVerses.join()
            : verse}
          </span>
        </span>
        <Transition
          show={openBook}
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
            open={openBook}
            onClose={closeBooks}
          >

            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            <div className="flex items-center justify-center h-screen ">
              <div className="w-5/12 m-auto z-50 shadow overflow-hidden sm:rounded-lg">
                <SelectBook
                  selectBook={selectBook}
                  bookList={bookList}
                  onChangeBook={onChangeBook}
                  multiSelectBook={multiSelectBook}
                  selectedBooks={selectedBooks}
                  setSelectedBooks={setSelectedBooks}
                >
                  <button
                    type="button"
                    className="w-9 h-9 bg-black p-2"
                    onClick={closeBooks}
                  >
                    <XIcon />
                  </button>
                </SelectBook>
              </div>
            </div>

          </Dialog>
        </Transition>

        <Transition
          show={openVerse}
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
            open={openVerse}
            onClose={closeVerses}
          >

            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            <div className="flex items-center justify-center h-screen">

              <div className=" w-3/12 m-auto z-50 bg-black text-white shadow overflow-hidden sm:rounded-lg">
                <SelectVerse
                  chapter={chapter}
                  verse={verse}
                  chapterList={chapterList}
                  verseList={verseList}
                  bookName={bookName}
                  onChangeChapter={onChangeChapter}
                  onChangeVerse={onChangeVerse}
                  closeBooks={closeBooks}
                  closeVerses={closeVerses}
                  multiSelectVerse={multiSelectVerse}
                  selectedVerses={selectedVerses}
                  setSelectedVerses={setSelectedVerses}
                  verselectActive={verselectActive}
                  setVerseSelectActive={setVerseSelectActive}
                >
                  <button
                    type="button"
                    className="w-9 h-9 bg-black p-2"
                    onClick={closeVerses}
                  >
                    <XIcon />
                  </button>
                </SelectVerse>
              </div>
            </div>

          </Dialog>
        </Transition>
      </>
  );
}
