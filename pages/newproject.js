import AuthenticationContextProvider from '@/components/Login/AuthenticationContextProvider';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef, useState } from 'react';

import ProjectsLayout from '@/layouts/ProjectsLayout';
import SelectBook from '@/modules/reference/SelectBook';
import SelectVerse from '@/modules/reference/SelectVerse';
import Notifications from '@/modules/notifications/Notifications';

import { XIcon } from '@heroicons/react/solid';

export default function ReferenceSelector() {
  const [openBook, setOpenBook] = useState(false);
  const [openVerse, setOpenVerse] = useState(false);

  const [book, setBook] = useState('');
  const [chapter, setChapter] = useState('');
  const [verse, setVerse] = useState('');
  const cancelButtonRef = useRef(null);

  function closeBooks() {
    setOpenBook(false);
  }

  function openBooks() {
    setOpenBook(true);
  }

  function closeVerses() {
    setOpenVerse(false);
  }

  function openVerses() {
    setOpenVerse(true);
  }

  function selectBook(book) {
    setBook(book);
    // console.log(book);
    setOpenBook(false);
    setOpenVerse(true);
  }

  function selectChapter(chapter) {
    setChapter(chapter);
    // console.log(chapter);
  }

  function selectVerse(verse) {
    setVerse(verse);
    // console.log(book, chapter, verse);
  }

  return (
    <AuthenticationContextProvider>
      <ProjectsLayout title="New Project">

        <div className="items-center justify-center">
          <button
            type="button"
            onClick={openBooks}
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          >
            Books
          </button>
          {/* <button
            type="button"
            onClick={openVerses}
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          >
            Chapters
          </button> */}
        </div>

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
                <SelectBook selectBook={selectBook}>
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
                <SelectVerse selectChapter={selectChapter} selectVerse={selectVerse}>
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

      </ProjectsLayout>
    </AuthenticationContextProvider>
  );
}
