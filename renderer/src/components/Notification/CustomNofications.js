import {
    BellIcon,
  } from '@heroicons/react/outline';
import { useState } from 'react';
import Notifications from '@/modules/notifications/Notifications';
import menuStyles from '../../layouts/editor/MenuBar.module.css';

const CustomNofications = () => {
    const [notificationsText, setNotification] = useState('somethings');
    const [openSideNotification, setOpenSideNotification] = useState(false);

    function openSideBars() {
        setOpenSideNotification(true);
    }

    function closeNotifications(open) {
        setOpenSideNotification(open);
    }

    return (
      <>
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
        <Notifications isOpen={openSideNotification} closeNotifications={closeNotifications}>
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
                <span className="block w-2/2 bg-primary h-2 rounded-full">&nbsp;</span>
              </span>
            </p>
          </div>
        </Notifications>
      </>
    );
  };

export default CustomNofications;
