import {
  Fragment, useState, useRef, useEffect,
} from 'react';

import {
  Menu, Dialog, Transition,
} from '@headlessui/react';

import {
  PencilIcon,
  DuplicateIcon,
  ArchiveIcon,
  TrashIcon,
  ExternalLinkIcon,
  BellIcon,
  InformationCircleIcon,
  XIcon,
} from '@heroicons/react/outline';

import ColumnsIcon from '@/icons/basil/Outline/Interface/Columns.svg';
import ReplyIcon from '@/icons/basil/Outline/Communication/Reply.svg';
import ForwardIcon from '@/icons/basil/Outline/Communication/Forward.svg';

import Notifications from '@/modules/notifications/Notifications';
import AboutModal from './AboutModal';

import menuStyles from './MenuBar.module.css';
import styles from './SubMenuBar.module.css';

export default function SubMenuBar() {
  const [open, setOpen] = useState(false);
  const [snackBar, setSnackBar] = useState(true);
  const [counter, setCounter] = useState(10);
  const [openSideBar, setOpenSideBar] = useState(false);

  function openSideBars() {
    setOpenSideBar(true);
  }

  function closeNotifications(open) {
    setOpenSideBar(open);
  }

  // Third Attempts
  useEffect(() => {
    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    if (counter <= 0) {
      setSnackBar(false);
    }
    return () => clearInterval(timer);
  }, [counter]);

  function closeSnackBar() {
    setSnackBar(false);
  }

  function timeOutClose() {
    if (counter <= 0) {
      setSnackBar(false);
    }
  }

  function openModal(isOpen) {
    setOpen(isOpen);
  }

  return (
    <>

      <AboutModal openModal={openModal} open={open} />

      <Transition appear show={snackBar} as={Fragment}>
        <Dialog
          as={Fragment}
          // className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => { }}
        >
          <div className="static">

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              // className="inline-block h-screen align-bottom"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >

              <div className="inline-block absolute bottom-0 left-0 align-top transform transition-all w-2/5 p-4">

                <div className="relative p-5 mt-5 bg-validation rounded-lg text-sm font-semibold text-gray-500">
                  <button
                    type="button"
                    className="bg-black absolute top-0 right-0 h-6 w-6 rounded-full text-center text-white p-1 -mt-2 -mr-2 focus:outline-none"
                    onClick={() => closeSnackBar(false)}
                  >
                    <XIcon />
                  </button>
                  <p>
                    This is a Notifiction. &nbsp;
                    {counter}
                  </p>
                </div>

                <div className="relative p-5 mt-5 bg-light rounded-lg text-sm font-semibold text-gray-500">
                  <button
                    type="button"
                    className="bg-black absolute top-0 right-0 h-6 w-6 rounded-full text-center text-white p-1 -mt-2 -mr-2 focus:outline-none"
                    onClick={() => closeSnackBar(false)}
                  >
                    <XIcon />
                  </button>
                  <p>This is a Notifiction.</p>
                </div>

                <div className="relative p-5 mt-5 bg-validation rounded-lg text-sm font-semibold text-gray-500">
                  <button
                    type="button"
                    className="bg-black absolute top-0 right-0 h-6 w-6 rounded-full text-center text-white p-1 -mt-2 -mr-2 focus:outline-none"
                    onClick={() => closeSnackBar(false)}
                  >
                    <XIcon />
                  </button>
                  <p>This is a Notifiction.</p>
                </div>

              </div>

            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <Notifications isOpen={openSideBar} closeNotifications={closeNotifications}>
        <div className="relative mb-2 bg-gray-200 rounded-lg text-sm text-black overflow-hidden">
          <div className="flex justify-between px-4 py-1 text-xs uppercase font-semibold bg-gray-300 text-gray-700">
            Title
            <span className="opacity-100 text-xxs text-gray-400">
              1 Hour Ago
            </span>
          </div>
          <p className="px-4 py-2">This is a Notifiction.</p>
        </div>
        <div className="relative mb-2 bg-validation rounded-lg text-sm text-black">
          <div className="flex justify-between px-4 py-1 text-xs uppercase font-semibold bg-secondary text-error rounded-t">
            Validation
            <span className="opacity-100 text-xxs text-gray-500">
              1 Hour Ago
            </span>
          </div>
          <p className="px-4 py-2 border-error border border-t-0 border-opacity-30 rounded-b">Unable to create a project.</p>
        </div>
        <div className="relative mb-2 bg-light rounded-lg text-sm text-black">
          <div className="flex justify-between px-4 py-1 text-xs uppercase font-semibold bg-secondary text-primary rounded-t">
            Sync
            <span className="opacity-100 text-xxs text-gray-500">
              2 Hour Ago
            </span>
          </div>
          <p className="px-4 py-2 border-primary border border-t-0 border-opacity-30 rounded-b">
            Uploading Files.
            <span className="block m-auto bg-black h-2 mt-2 mb-4 mx-10 rounded-full">
              <span className="block w-2/4 bg-primary h-2 rounded-full">&nbsp;</span>
            </span>
          </p>
        </div>
      </Notifications>

      <nav className="flex p-2 shadow">
        <div>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className={styles.dd}>
                File
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="flex absolute left-0 w-screen mt-2 -ml-2 origin-top-left bg-white divide-y divide-gray-100 shadow ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="flex px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        className={`${active ? 'bg-black text-primary' : 'text-gray-900'
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        <PencilIcon
                          className="w-5 h-5 mr-2"
                          aria-hidden="true"
                        />
                        Edit
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        className={`${active ? 'bg-black text-primary' : 'text-gray-900'
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        <DuplicateIcon
                          className="w-5 h-5 mr-2"
                          aria-hidden="true"
                        />
                        Duplicate
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="flex px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        className={`${active ? 'bg-black text-primary' : 'text-gray-900'
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >

                        <ArchiveIcon
                          className="w-5 h-5 mr-2"
                          aria-hidden="true"
                        />
                        Archive
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        className={`${active ? 'bg-black text-primary' : 'text-gray-900'
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        <ExternalLinkIcon
                          className="w-5 h-5 mr-2"
                          aria-hidden="true"
                        />
                        Move
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="flex px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        className={`${active ? 'bg-black text-primary' : 'text-gray-900'
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        <TrashIcon
                          className="w-5 h-5 mr-2 text-violet-400"
                          aria-hidden="true"
                        />
                        Delete
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          <button type="button" className={styles.menu} aria-expanded="false">
            <span>Insert</span>
          </button>
          <button type="button" className={styles.menu} aria-expanded="false">
            <span>Format</span>
          </button>
        </div>
        <div className="w-2/3">
          <div className="flex-1 items-center text-center place-self-center">
            <button type="button" className={`group ${menuStyles.btn}`}>
              <ColumnsIcon fill="currentColor" className="h-6 w-6" aria-hidden="true" />
              <span className="px-2 ml-1 bg-primary  text-white  group-hover:bg-white group-hover:text-primary inline-flex text-xxs leading-5 font-semibold rounded-full">3</span>
            </button>
            <button type="button" className={`group ${menuStyles.btn}`}>
              <ReplyIcon fill="currentColor" className="h-6 w-6" aria-hidden="true" />
            </button>
            <button type="button" className={`group ${menuStyles.btn} mx-0`}>
              <ForwardIcon fill="currentColor" className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-end">
            <button
              onClick={openSideBars}
              type="button"
              className={`group ${menuStyles.btn}`}
            >
              <BellIcon className="h-6 w-6" aria-hidden="true" />
              <span className="px-2 ml-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-success text-white group-hover:bg-white group-hover:text-primary ">21</span>
            </button>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className={menuStyles.btn}
            >
              <InformationCircleIcon className="h-6 w-6" aria-hidden="true" />
            </button>

          </div>
        </div>
      </nav>

    </>

  );
}
