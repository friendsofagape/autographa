import PropTypes from 'prop-types';
import {
  Fragment, useRef, useState,
} from 'react';

import {
  Dialog, Transition,
} from '@headlessui/react';

import {
  InformationCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';
import LogoIcon from '@/icons/logo.svg';
import packageInfo from '../../../../package.json';

export default function AboutModal(props) {
  const { openModal, open } = props;
  const [tabNumber, setTabNumber] = useState(0);

  const cancelButtonRef = useRef(null);

  const { t } = useTranslation();

  function modalStatus(isOpen) {
    openModal(isOpen);
  }

  return (

    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => modalStatus(false)}
        initialFocus={cancelButtonRef}
      >
        <div className="min-h-screen px-4 text-center">
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

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">

                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="flex justify-items-center items-center mb-4 text-lg leading-6 text-primary uppercase tracking-wide font-bold">
                      <div className="flex items-center justify-center rounded-full bg-primary h-10 w-10 mr-5">
                        <LogoIcon
                          className="h-6 w-6 text-white"
                          fill="currentColor"
                          aria-hidden="true"
                        />
                      </div>
                      {t('app-name')}
                      <span className="bg-primary text-white text-xxs px-2 py-0 ml-2 rounded-full">{packageInfo.version}</span>
                    </Dialog.Title>

                    <div className="flex cursor-pointer border-0 border-b border-gray-300">
                      <div
                        onClick={() => setTabNumber(0)}
                        role="button"
                        tabIndex="0"
                        className={`flex items-center justify-center p-2 leading-6 text-sm text-black hover:text-primary uppercase tracking-wide font-bold border-0 border-b-4 ${tabNumber === 0 ? 'border-primary' : 'border-transparent hover:border-black'}`}
                      >
                        <InformationCircleIcon
                          className="h-5 w-5 mr-2"
                          aria-hidden="true"
                        />
                        {t('modal-title-about')}
                      </div>
                      <div
                        aria-label="license-button"
                        onClick={() => setTabNumber(1)}
                        role="button"
                        tabIndex="0"
                        className={`flex items-center justify-center p-2 leading-6 text-sm text-black hover:text-primary uppercase tracking-wide font-bold border-0 border-b-4 ${tabNumber === 1 ? 'border-primary' : 'border-transparent hover:border-black'}`}
                      >
                        <DocumentTextIcon
                          className="h-5 w-5 mr-2"
                          aria-hidden="true"
                        />
                        {t('modal-title-license')}
                      </div>
                    </div>
                    <div className="mt-5 prose">
                      {tabNumber === 0
                        && (
                          <p className="text-sm text-gray-500">
                            This is a standalone desktop application which hopes to aid and be a friendly companion of the Bible Translator. In essence it is a basic USFM editor which is capable of import and export of USFM files. It has handy features like color-coded diffs across imported texts for comparison between revisions, search and replace and export to formatted HTML and autographa will include capabilities for syncing data with online repositories and that this application is licensed differently.
                          </p>
                        )}
                      {tabNumber === 1
                        && (
                          <>
                            <p className="text-sm text-gray-500">MIT License</p>

                            <p className="text-sm text-gray-500">Copyright &copy; 2020 Friends of Agape</p>

                            <p className="text-sm text-gray-500">
                              Permission is hereby granted, free of charge, to any person obtaining a copy
                              of this software and associated documentation files (the &#34;Software&#34;), to deal
                              in the Software without restriction, including without limitation the rights
                              to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                              copies of the Software, and to permit persons to whom the Software is
                              furnished to do so, subject to the following conditions:
                            </p>

                            <p className="text-sm text-gray-500">
                              The above copyright notice and this permission notice shall be included in all
                              copies or substantial portions of the Software.
                            </p>

                            <p className="text-sm text-gray-500">
                              THE SOFTWARE IS PROVIDED &#34;AS IS&#34;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                              IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                              FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                              AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                              LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                              OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                              SOFTWARE.
                            </p>

                          </>
                        )}
                    </div>
                    <p aria-label="developed-by" className="text-xs text-primary text-right my-3">
                      Developed by Bridge Connectivity Solutions
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-200 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  aria-label="close-about"
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => modalStatus(false)}
                  ref={cancelButtonRef}
                >
                  {t('btn-close')}
                </button>
                <a
                  // type="button"
                  href="https://github.com/friendsofagape/autographa"
                  target="_blank"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  rel="noreferrer"
                >
                  {t('btn-source-code')}
                </a>

                {/* <a
                  // type="button"
                  // href="https://github.com/friendsofagape/autographa/blob/development/LICENSE"
                  // target="_blank"
                  href="#update"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-success focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                  rel="noreferrer"
                >
                  Check For Update
                </a> */}

              </div>
            </div>

          </Transition.Child>
        </div>
      </Dialog>
    </Transition>

  );
}

AboutModal.propTypes = {
  openModal: PropTypes.func,
  open: PropTypes.bool,
};
