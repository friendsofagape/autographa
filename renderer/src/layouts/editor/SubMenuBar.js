/* eslint-disable max-len */
import {
  Fragment, useState, useEffect, useContext,
} from 'react';

import {
  Dialog, Transition,
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
import Font from '@/icons/font.svg';
import Notifications from '@/modules/notifications/Notifications';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import MenuBar from '@/components/Menubar/MenuBar';
import { CustomUsfmToolbar } from '@/components/EditorPage/UsfmEditor/UsfmToolbar';
import AboutModal from './AboutModal';
import StatsModal from './StatsModal';
import MenuDropdown from '../../components/MenuDropdown/MenuDropdown';
import menuStyles from './MenuBar.module.css';
import styles from './SubMenuBar.module.css';

const tesfFunc = () => {
  // console.log('edit');
};

const tesfFunc1 = () => {
  // console.log('test2');
};
const activate = () => {
  // console.log('rename');
};

const FileMenuItems = [{
  itemname: 'Edit',
  icon: <PencilIcon />,
  callback: tesfFunc,
},
{
  itemname: 'Duplicate',
  icon: <DuplicateIcon />,
  callback: tesfFunc1,
},
{
  itemname: 'Archive',
  icon: <ArchiveIcon />,
  callback: tesfFunc1,
},
{
  itemname: 'Delete',
  icon: <TrashIcon />,
  callback: tesfFunc1,
},
{
  itemname: 'Rename',
  callback: tesfFunc1,
},
];
const FormatMenuItems = [
  {
    itemname: 'Open',
    icon: <ExternalLinkIcon />,
    callback: tesfFunc1,
  },
  {
    itemname: 'About',
    icon: <InformationCircleIcon />,
    callback: tesfFunc1,
  },
  {
    itemname: 'Font',
    icon: <Font />,
    renderElement: <MenuDropdown />,
    callback: activate,
  },
];

const EditorTools = [
  {
    renderElement: <CustomUsfmToolbar />,
  },
];

export default function SubMenuBar() {
  const [open, setOpen] = useState(false);
  const [openStats, setOpenStats] = useState(false);
  // const [snackBar, setSnackBar] = useState(true);
  const [openSideBar, setOpenSideBar] = useState(false);
  const {
    state: {
      layout,
      refernceLoading,
      counter,
    },
    actions: {
      setOpenResource1,
      setOpenResource2,
      setOpenResource3,
      setOpenResource4,
      getFonts,
      setLayout,
      setRefernceLoading,
    },
  } = useContext(ReferenceContext);
  const [notificationsText, setNotification] = useState();

  useEffect(() => {
    getFonts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResource = () => {
    setOpenResource1(false);
        setOpenResource2(false);
        setOpenResource3(false);
        setOpenResource4(false);
    if (layout < 3) { setLayout(layout + 1); }
    if (layout >= 3) { setLayout(1); }
    if (layout === 2) { setLayout(0); }
  };

  function openSideBars() {
    setOpenSideBar(true);
  }

  function closeNotifications(open) {
    setOpenSideBar(open);
  }

  // Third Attempts
  // useEffect(() => {
  //   const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
  //   if (counter <= 0) {
  //     // setNotification(refernceLoading.text);
  //     setRefernceLoading({
  //       status: false,
  //       text: '',
  //     });
  //   }
  //   return () => clearInterval(timer);
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [counter]);

  function closeSnackBar() {
    setNotification(refernceLoading.text);
    // setSnackBar(false);
    setRefernceLoading({
      status: false,
      text: '',
    });
  }

  // function timeOutClose() {
  //   if (counter <= 0) {
  //     setSnackBar(false);
  //   }
  // }

  function openModal(isOpen) {
    setOpen(isOpen);
  }

  function openStatsModal(isOpen) {
    setOpenStats(isOpen);
  }

  return (
    <>

      <AboutModal openModal={openModal} open={open} />

      <StatsModal openModal={openStatsModal} open={openStats} />

      <Transition appear show={refernceLoading.status} as={Fragment}>
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
                    {refernceLoading.text}
                    {counter > 0 ? counter : ''}
                  </p>
                </div>

                {/* <div className="relative p-5 mt-5 bg-light rounded-lg text-sm font-semibold text-gray-500">
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
                </div> */}

              </div>

            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <Notifications isOpen={openSideBar} closeNotifications={closeNotifications}>
        {notificationsText && (
          <div className="relative mb-2 bg-gray-200 rounded-lg text-sm text-black overflow-hidden">
            <div className="flex justify-between px-4 py-1 text-xs uppercase font-semibold bg-gray-300 text-gray-700">
              Resources
              <span className="opacity-100 text-xxs text-gray-400">
                a min ago
              </span>
            </div>
            <p className="px-4 py-2">{notificationsText}</p>
          </div>
        )}
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

      <nav className="flex p-2 shadow-sm border-b border-gray-200">
        <div className="w-3/5">
          <MenuBar header="File" MenuItems={FileMenuItems} />
          <span>
            <MenuBar header="FORMAT" MenuItems={FormatMenuItems} style={{ left: '-60px' }} />
          </span>
          {/* <button type="button" className={styles.menu} aria-expanded="false">
            <span>Insert</span>
          </button> */}
          <span>
            <MenuBar header="EDIT" MenuItems={EditorTools} style={{ left: '-147px', height: '65px' }} />
          </span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={styles.menu}
            aria-expanded="false"
          >
            <span>About</span>
          </button>
        </div>
        {/* <div className="w-2/3">
          <div className="flex-1 items-center text-center place-self-center" />
        </div> */}
        <div className="w-2/5">
          <div className="flex justify-end">
            <button type="button" onClick={() => handleResource()} className={`group ${menuStyles.btn}`}>
              <ColumnsIcon fill="currentColor" className="h-6 w-6" aria-hidden="true" />
              <span className="px-2 ml-1 bg-primary
              text-white  group-hover:bg-white
              group-hover:text-primary inline-flex
              text-xxs leading-5 font-semibold rounded-full"
              >
                {layout + 1}
              </span>
            </button>
            <button type="button" className={`group ${menuStyles.btn}`}>
              <ReplyIcon fill="currentColor" className="h-6 w-6" aria-hidden="true" />
            </button>
            <button type="button" className={`group ${menuStyles.btn} mx-0`}>
              <ForwardIcon fill="currentColor" className="h-6 w-6" aria-hidden="true" />
            </button>
            <div
              className="flex items-center px-4"
              onClick={() => setOpenStats(true)}
              role="button"
              tabIndex="0"
            >
              <div className="bg-success w-20 h-2 mr-4 rounded overflow-hidden">
                <div className="bg-gray-300 w-10 h-2" />
              </div>
              <span className="text-xxs uppercase font-semibold">
                Saved
                <span className="text-primary"> 5 Mins </span>
              </span>
            </div>

            <button
              onClick={openSideBars}
              type="button"
              className={`group ${menuStyles.btn}`}
            >
              <BellIcon className="h-5 w-5" aria-hidden="true" />
              <span
                className="px-1 ml-1 inline-flex text-xxs leading-5 font-semibold rounded-full bg-success text-white group-hover:bg-white group-hover:text-primary "
              >
                21
              </span>
            </button>

            {/* <button
              type="button"
              onClick={() => setOpen(true)}
              className={menuStyles.btn}
            >
              <InformationCircleIcon className="h-6 w-6" aria-hidden="true" />
            </button> */}

          </div>
        </div>
      </nav>

    </>

  );
}
