import { Fragment } from 'react';
import {
   Dialog, Transition,
} from '@headlessui/react';

import PropTypes from 'prop-types';
import { XIcon } from '@heroicons/react/solid';

export default function Notifications(props) {
  const {
    children,
    isOpen,
    closeNotifications,
  } = props;

  function closeSideBars() {
    closeNotifications(false);
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>

      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        open={isOpen}
        onClose={closeSideBars}
      >

        <div className="min-h-screen px-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
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

            <div className="absolute top-16 right-0 h-full shadow overflow-hidden rounded-l-md">

              <div className="flex flex-row w-96 text-center bg-black text-white text-xs font-medium tracking-wider uppercase">
                <div className="m-auto">
                  notifications
                </div>
                <div className="flex justify-end">
                  <button type="button" className="w-9 h-9 bg-gray-900 p-2 focus:outline-none" onClick={closeSideBars}>
                    <XIcon />
                  </button>
                </div>
              </div>
              <div className="bg-white h-full p-2">
                {children}
              </div>
            </div>

          </Transition.Child>
        </div>

      </Dialog>
    </Transition>

  );
}

Notifications.propTypes = {
  children: PropTypes.any,
  isOpen: PropTypes.bool,
  closeNotifications: PropTypes.func,
};
