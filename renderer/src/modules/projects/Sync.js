import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/solid';

import ProjectsLayout from '@/layouts/ProjectsLayout';
// import styles from './breadcrumbs.module.css';

const localFiles = [
  {
    name: 'arabic_revised.usfm',
    created: '12 Aug 2019',
    updated: '1 day ago',
    type: 'usfm',
  },
  {
    name: 'arabic_new.usfm',
    created: '10 Jun 2019',
    updated: '3 hours ago',
    type: 'usfm',
  },
  {
    name: 'kinyarwanda_new.usfm',
    created: '10 Jun 2019',
    updated: '3 hours ago',
    type: 'usfm',
  },
  {
    name: 'hindi_new.usfm',
    created: '10 Jun 2019',
    updated: '3 hours ago',
    type: 'usfm',
  },
];

const cloudFiles = [
  {
    name: 'folder',
    created: '12 Aug 2019',
    updated: '1 day ago',
    type: 'folder',
  },
  {
    name: 'logo.png',
    created: '10 Jun 2019',
    updated: '3 hours ago',
    type: 'usfm',
  },
  {
    name: 'project_arabic.md',
    created: '10 Jun 2019',
    updated: '3 hours ago',
    type: 'usfm',
  },
  {
    name: 'arabic_revised.usfm',
    created: '12 Aug 2019',
    updated: '1 day ago',
    type: 'usfm',
  },
];

export default function ProjectList() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <ProjectsLayout
      title="Sync"
      isTwoCol
      colOne={(
        <form action="#" className="flex flex-row mx-5">
          <div className="flex items-center h-5">
            <input
              id="comments"
              name="comments"
              type="checkbox"
              onClick={() => setIsOpen(true)}
              className="focus:ring-indigo-500 h-4 w-4 text-primary border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            {/* eslint jsx-a11y/label-has-associated-control: ["error", { assert: "either" } ] */}
            <label htmlFor="comments" className="font-medium text-gray-700">
              Show Hidden Files
            </label>
          </div>
        </form>

      )}
      colTwo={(
        <ul className="list-none p-0 flex">
          <li className="mr-2">
            <a className="bg-secondary text-white inline-block rounded-t py-2 px-6 text-sm uppercase" href="#a">
              <img className="inline mr-2 w-4" src="/brands/door43.png" alt="Door 43 Logo" />
              Door 43
            </a>
          </li>
          <li className="mr-2">
            <a className="bg-gray-200 inline-block rounded-t py-2 px-6 hover:text-white hover:bg-black text-sm uppercase" href="#b">
              <img className="inline mr-2 w-5" src="/brands/paratext.png" width="18" alt="Paratext Logo" />
              Paratext
            </a>
          </li>
          <li className="mr-2">
            <a className="bg-gray-200 inline-block rounded-t py-2 px-6 hover:text-white hover:bg-black text-sm uppercase" href="#c">
              <img className="inline mr-2 w-5" src="/brands/gitea.png" width="18" alt="Gitea Logo" />
              Gitea
            </a>
          </li>
        </ul>
      )}
    >

      <Transition
        show={isOpen}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >

        <Dialog
          static
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="fixed z-10 inset-0 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen">

            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

            <div className="bg-white p-10 rounded shadow max-w-sm mx-auto">

              <Dialog.Title className="text-lg">Deactivate account</Dialog.Title>
              <Dialog.Description className="text-sm py-4">
                Are you sure you want to deactivate your account? All of your data will
                be permanently removed. This action cannot be undone.
              </Dialog.Description>

              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-error hover:bg-error-700"
                onClick={() => setIsOpen(false)}
              >
                Deactivate

              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 mx-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-300"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>

            </div>

          </div>
        </Dialog>

      </Transition>

      <main>
        <div className="py-6 sm:px-6 lg:px-6">

          <div className="grid grid-cols-2 gap-2 sm:px-0">
            <div className="shadow rounded">

              <div className="flex flex-row mx-5 my-3 border-b-1 border-primary">
                <span className="font-semibold">
                  Arabic
                  <ChevronRightIcon className="h-4 w-4 mx-2 inline-block fill-current text-gray-800" aria-hidden="true" />
                </span>
                <span className="font-semibold tracking-wide text-primary ">Toolkit</span>
              </div>

              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Created
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Last Viewed
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">

                  {localFiles.map((file) => (
                    <tr key={file.name}>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-0">
                            <div className="text-sm text-gray-900">{file.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.created}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>

            <div className="shadow rounded">

              <div className="flex flex-row mx-5 my-3 border-b-1 border-primary">
                <span className="font-semibold">
                  BridgeConn
                  <ChevronRightIcon className="h-4 w-4 mx-2 inline-block fill-current text-gray-800" aria-hidden="true" />
                </span>
                <span className="font-semibold tracking-wide text-primary ">Toolkit</span>
              </div>

              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Created
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Last Viewed
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cloudFiles.map((file) => (
                    <tr key={file.name}>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-0">
                            <div className="text-sm text-gray-900">{file.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.created}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>

        </div>
      </main>

    </ProjectsLayout>

  );
}
