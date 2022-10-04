import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// import localforage, * as localForage from 'localforage';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { SnackBar } from '@/components/SnackBar';
// import * as logger from '../../../../logger';

// import ProgressCircle from '../ProgressCircle';

// const path = require('path');

function CheckHelpsUpdatePopUp({ update }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const { t } = useTranslation();
    const [snackBar, setOpenSnackBar] = React.useState(false);
    const [snackText, setSnackText] = React.useState('');
    const [notify, setNotify] = React.useState();

    // eslint-disable-next-line no-async-promise-executor

    // const handleUpdateResource = () => {
    // logger.debug('EditorAutoSync.js', 'Inside auto sync Project : ');
    // const projectName = '';
    // localForage.getItem('userProfile').then(async (user) => {
    //     const fs = window.require('fs');
    //     const newpath = localStorage.getItem('userPath');
    //     const file = path.join(newpath, 'autographa', 'users', user?.username, 'ag-user-settings.json');
    // });
    // };

    const modalClose = () => {
        setIsOpen(false);
      };

    const callFunction = () => {
            // setNotify('failure');
            // setSnackText('Please select a valid account to sync..');
            // setOpenSnackBar(true);
    };

    useEffect(() => {
        // on pop up
        console.log('update : ', { update });
        setIsOpen(true);
    }, []);

    return (
      <>
        <Transition appear show={isOpen} as={React.Fragment}>
          <Dialog as="div" className="relative z-10" onClose={modalClose}>
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-30 pointer-events-none" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="bg-gray-200  w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all">
                      <div className="flex mr-2 justify-between">
                        <div className="">
                          <Dialog.Title
                            as="h3"
                            className="text-lg font-bold leading-6 text-gray-900"
                          >
                            Update Resource
                          </Dialog.Title>
                        </div>
                        {/* <div className="">
                          <a className="bg-secondary text-white inline-block rounded-t py-2 px-4 text-sm uppercase" href="#a">
                            <img className="inline mr-2 w-6" src="/brands/door43.png" alt="Door 43 Logo" />
                            {t('label-door43')}
                          </a>
                        </div> */}
                      </div>

                      <div className="mt-4 ">
                        <div className="bg-gray-200 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                          {update
                            ? (
                              <>
                                <button
                                  aria-label="confirm-update"
                                  type="button"
                                  className="w-20 h-10 bg-success leading-loose rounded shadow text-xs font-base  text-white tracking-wide  font-light uppercase"
                                  onClick={callFunction}
                                >
                                  {t('btn-update')}
                                </button>
                                <button
                                  aria-label="close-update"
                                  type="button"
                                  className="w-20 h-10 mx-2 bg-error leading-loose rounded shadow text-xs font-base  text-white tracking-wide  font-light uppercase"
                                  onClick={modalClose}
                                >
                                  {t('btn-cancel')}
                                </button>
                              </>
                            ) : (
                              <button
                                aria-label="update-cancel"
                                type="button"
                                className="w-20 h-10 bg-success leading-loose rounded shadow text-xs font-base  text-white tracking-wide  font-light uppercase"
                                onClick={modalClose}
                              >
                                {t('btn-ok')}
                              </button>
                            )}
                        </div>
                      </div>

                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </div>
          </Dialog>
        </Transition>

        <SnackBar
          openSnackBar={snackBar}
          snackText={snackText}
          setOpenSnackBar={setOpenSnackBar}
          setSnackText={setSnackText}
          error={notify}
        />

      </>
    );
}

CheckHelpsUpdatePopUp.propTypes = {
    update: PropTypes.bool,
  };

export default CheckHelpsUpdatePopUp;
