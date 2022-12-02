import { useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, Transition } from '@headlessui/react';

import ProjectsLayout from '@/layouts/projects/Layout';
import Gitea from '@/components/Sync/Gitea/Gitea';
import ProjectFileBrowser from '@/components/Sync/ProjectFileBrowser';
import Door43Logo from '@/icons/door43.svg';

export default function Sync() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <ProjectsLayout
      title="Sync"
      isTwoCol
      colOne={(
        <form action="#" className="flex flex-row mx-5">
          <div className="flex items-center h-5">
            {/* <input
              id="comments"
              name="comments"
              type="checkbox"
              onClick={() => setIsOpen(true)}
              className="focus:ring-indigo-500 h-4 w-4 text-primary border-gray-300 rounded"
            /> */}
          </div>
          <div className="ml-3 text-sm">
            {/* eslint jsx-a11y/label-has-associated-control: ["error", { assert: "either" } ] */}
            {/* <label htmlFor="comments" className="font-medium text-gray-700">
              {t('label-show-hidden-file')}
            </label> */}
          </div>
        </form>

      )}
      colTwo={(
        <ul className="list-none p-0 flex">
          <li className="mr-2">
            <a className="bg-secondary text-white inline-block rounded-t py-2 px-6 text-sm uppercase" href="#a">
              {/* <img className="inline mr-2 w-4" src="/brands/door43.png" alt="" /> */}
              <Door43Logo className="inline mr-2 w-4" fill="#9bc300" />
              {/* <img className="inline mr-2 w-4" src="/brands/door43.png" alt="Door 43 Logo" /> */}
              {t('label-door43')}
            </a>
          </li>
          {/* <li className="mr-2">
            <a className="bg-gray-200 inline-block rounded-t py-2 px-6 hover:text-white hover:bg-black text-sm uppercase" href="#b">
              <img className="inline mr-2 w-5" src="/brands/paratext.png" width="18" alt="Paratext Logo" />
              {t('label-paratext')}
            </a>
          </li>
          <li className="mr-2">
            <a className="bg-gray-200 inline-block rounded-t py-2 px-6 hover:text-white hover:bg-black text-sm uppercase" href="#c">
              <img className="inline mr-2 w-5" src="/brands/gitea.png" width="18" alt="Gitea Logo" />
              {t('label-Gitea')}
            </a>
          </li> */}
        </ul>
      )}
    >

      <Transition
        show={isOpen}
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
          static
          open={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="flex items-center justify-center h-screen">

            <div className="bg-white w-5/12 p-10 m-auto z-50 shadow overflow-hidden sm:rounded-lg">

              <Dialog.Title className="text-lg">{t('label-deactivate-account')}</Dialog.Title>
              <Dialog.Description className="text-sm py-4">
                {t('dynamic-msg-deactivate-account')}
              </Dialog.Description>

              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-error hover:bg-error-700"
                onClick={() => setIsOpen(false)}
              >
                {t('btn-deactivate')}
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 mx-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-300"
                onClick={() => setIsOpen(false)}
              >
                {t('btn-cancel')}
              </button>

            </div>

          </div>
        </Dialog>

      </Transition>

      <div className="grid grid-cols-2 gap-2 py-6 sm:px-6 lg:px-6">
        <div className="shadow rounded h-full">
          <ProjectFileBrowser />
        </div>
        <div className="shadow rounded">
          <Gitea />
        </div>
      </div>

    </ProjectsLayout>

  );
}
