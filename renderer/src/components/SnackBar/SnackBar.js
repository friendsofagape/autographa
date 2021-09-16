/* eslint-disable consistent-return */
import React, {
 Fragment, useEffect, useState,
} from 'react';
import { XIcon } from '@heroicons/react/outline';
import { Dialog, Transition } from '@headlessui/react';
import PropTypes from 'prop-types';

const colors = { success: '#82E0AA', failure: '#F5B7B1', warning: '#F8C471' };
const SnackBar = ({
  openSnackBar,
  snackText,
  setOpenSnackBar,
  setSnackText,
  error,
}) => {
  const [timeLeft, setTimeLeft] = useState(3);

  const closeSnackBar = () => {
    setOpenSnackBar(false);
    setSnackText('');
    setTimeLeft(null);
  };

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeLeft(null);
    }

    if (!timeLeft) { return; }

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
        if (timeLeft <= 1) {
            closeSnackBar();
        }
    }, 1000);

    return () => clearInterval(intervalId);
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [timeLeft]);

  useEffect(() => {
    if (openSnackBar) {
      setTimeLeft(3);
    }
  }, [openSnackBar]);

  return (

    <Transition appear show={openSnackBar} as={Fragment}>
      <Dialog
        as={Fragment}
        // className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => { }}
      >
        <div className="static">
          {/* This element is to trick the browser into centering the modal contents. */}
          {/* <span
            // className="inline-block h-screen align-bottom"
            aria-hidden="true"
          >
            &#8203;
          </span> */}
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
              <div className="relative bg-green-100 p-5 mt-5 bg-validation rounded-lg text-sm font-semibold text-gray-600" style={{ backgroundColor: colors[error] }}>
                <button
                  type="button"
                  className="bg-black absolute top-0 right-0 h-6 w-6 rounded-full text-center text-white p-1 -mt-2 -mr-2 focus:outline-none"
                  onClick={() => closeSnackBar(false)}
                >
                  <XIcon />
                </button>
                <p>
                  {snackText}
                </p>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

SnackBar.propTypes = {
  openSnackBar: PropTypes.bool,
  snackText: PropTypes.string,
  setOpenSnackBar: PropTypes.func,
  setSnackText: PropTypes.func,
  error: PropTypes.string,
};

export default SnackBar;
