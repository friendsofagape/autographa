import React from 'react';
import PropTypes from 'prop-types';
// import localforage, * as localForage from 'localforage';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { SnackBar } from '@/components/SnackBar';
import LoadingScreen from '@/components/Loading/LoadingScreen';
import * as logger from '../../../../logger';
import RefreshSvg from '@/icons/basil/Outline/Interface/Refresh.svg';
import DownloadCreateSBforHelps from './DownloadCreateSBforHelps';

// const path = require('path');

const checkHelpsVersionUpdate = async (reference) => {
  try {
      logger.debug('checkHelpsUpdatePopup.js', 'check update for resource');
      // console.log('reference : ', { reference });
      return new Promise((resolve) => {
      const currentResourceReleased = reference?.value?.meta?.released;
      let latestResourceReleased = null;
      // get released from repo fetch new meta
      const subject = reference?.value?.meta?.subject;
      const lang = reference?.value?.meta?.language;
      const owner = reference?.value?.meta?.owner;
      fetch(`https://git.door43.org/api/catalog/v5/search?subject=${subject}&lang=${lang}&owner=${owner}`)
      .then((res) => res.json())
      .then((resultMeta) => {
          // console.log({ resultMeta });
          logger.debug('checkHelpsVersionUpdate.js', { currentResourceReleased, latestResourceReleased });
          latestResourceReleased = resultMeta?.data[0]?.released;

          // check for update
          // currentResourceReleased = '2019-07-01T21:38:48Z';
          console.log({ currentResourceReleased, latestResourceReleased });
          if (new Date(latestResourceReleased) > new Date(currentResourceReleased)) {
              resolve({
                status: true,
                currentVersion: reference?.value?.meta?.release?.name,
                latestVersion: resultMeta?.data[0]?.release?.name,
                latestMeta: resultMeta?.data[0],
              });
              logger.debug('checkHelpsVersionUpdate.js', 'update avaailable');
          } else {
              resolve({
                status: false,
                currentVersion: reference?.value?.meta?.release?.name,
                latestVersion: resultMeta?.data[0]?.release?.name,
                latestMeta: resultMeta?.data[0],
              });
              logger.debug('checkHelpsVersionUpdate.js', 'No update avaailable');
          }
      });
    });
  } catch (err) {
      console.log('error check update :', { err });
  }
};

function CheckHelpsUpdatePopUp({ resource }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isloading, setIsLoading] = React.useState(false);
    const [versions, setVersions] = React.useState({});
    const [updateStatus, setUpdateStatus] = React.useState(null);
    const { t } = useTranslation();
    const [snackBar, setOpenSnackBar] = React.useState(false);
    const [snackText, setSnackText] = React.useState('');
    // eslint-disable-next-line no-unused-vars
    const [notify, setNotify] = React.useState();

    const modalClose = () => {
        setIsOpen(false);
      };

    const UpdateResource = async () => {
      await DownloadCreateSBforHelps(versions?.meta, setIsLoading, { status: true, prevVersion: resource?.value?.meta?.release?.tag_name, setIsOpen });
      // setNotify('failure');
        // setSnackText('Please select a valid account to sync..');
        // setOpenSnackBar(true);
    };

    React.useEffect(() => {
    }, []);

    const handleCheckUpdateHelpsResources = async (event, resource) => {
      setIsOpen(true);
      setIsLoading(true);
      await checkHelpsVersionUpdate(resource)
      .then((obj) => {
        setUpdateStatus(obj.status);
        setVersions({ current: obj?.currentVersion, latest: obj?.latestVersion, meta: obj?.latestMeta });
        setIsLoading(false);
      });
    };

    return (
      <>
        <div
          className="text-xs cursor-pointer focus:outline-none"
          role="button"
          tabIndex={0}
          title="check updates"
          onClick={(e) => handleCheckUpdateHelpsResources(e, resource)}
        >
          <RefreshSvg
            fill="currentColor"
            // fill="blue"
            className="w-6 h-6"
          />
        </div>
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
                            Resource Update
                          </Dialog.Title>
                        </div>
                        <div className="">
                          <a className="bg-secondary text-white inline-block rounded-t py-2 px-4 text-sm uppercase" href="#a">
                            <img className="inline mr-2 w-6" src="/brands/door43.png" alt="Door 43 Logo" />
                            {t('label-door43')}
                          </a>
                        </div>
                      </div>

                      <div className="mt-3">
                        {updateStatus !== null && updateStatus ? (
                          <div>
                            {isloading ? (
                              <div>
                                <LoadingScreen />
                              </div>
                            ) : (
                              <>
                                <p className="text-sm pb-1">
                                  updates available for the resource
                                </p>
                                <div>
                                  <p className="text-sm pb-1">
                                    <strong>{versions?.current}</strong>
                                    <span className="px-2 text-lg">
                                      {String.fromCharCode(8594)}
                                      {' '}
                                    </span>
                                    <strong>{versions?.latest}</strong>
                                  </p>
                                </div>
                                <p className="text-sm">Do you want to update ?</p>
                              </>
                              )}
                          </div>
                        ) : (
                          <div>
                            {isloading ? (
                              <div>
                                <LoadingScreen />
                              </div>
                            ) : (
                              <p className="text-sm">
                                No updates available
                                latest Version is
                                {' '}
                                <strong>{resource?.value?.meta?.release?.name}</strong>
                              </p>
                              )}
                          </div>
                        )}
                      </div>
                      <div className="mt-4 ">
                        <div className="bg-gray-200 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                          {updateStatus
                            ? (
                              <>
                                <button
                                  aria-label="confirm-update"
                                  type="button"
                                  className="w-20 h-10 bg-success leading-loose rounded shadow text-xs font-base  text-white tracking-wide  font-light uppercase"
                                  onClick={UpdateResource}
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
    resource: PropTypes.object,
  };

export default CheckHelpsUpdatePopUp;
