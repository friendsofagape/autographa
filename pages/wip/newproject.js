import { useState } from 'react';

import ProjectsLayout from '@/layouts/projects/Layout';
import AuthenticationContextProvider from '@/components/Login/AuthenticationContextProvider';
import ProjectContextProvider from '@/components/context/ProjectContext';
import ReferenceContextProvider from '@/components/context/ReferenceContext';
import { classNames } from '@/util/classNames';
import CloudArrowDownIcon from '@/icons/Download/CloudArrowDown.svg';
import CloudArrowUpIcon from '@/icons/Download/CloudArrowUp.svg';
import MagnifyingGlassIcon from '@/icons/Download/MagnifyingGlass.svg';

import FolderIcon from './folder.svg';

function GridRow({
 title, lastSync, selected, isUpload, uploadPercentage = 10,
}) {
  return (
    <>
      <div className="flex gap-2 justify-between items-center px-5 py-4 border-b border-gray-100">
        <div class="flex items-center w-10">
          <input
            id="default-checkbox"
            defaultChecked={selected}
            type="checkbox"
            class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
          />
        </div>
        <span
          className={classNames(
					  selected ? 'text-primary' : 'text-gray-800',
						'capitalize w-full flex items-center gap-5',
					)}
        >
          <FolderIcon className="w-4 h-4" />
          {title}
        </span>
        <span
          className={classNames(
						selected ? 'text-primary' : '',
						'text-xs font-semibold uppercase text-right w-40',
					)}
        >
          {lastSync}
        </span>
      </div>
      {isUpload && (
      <div className="w-full bg-gray-200 h-1">
        <div
          className="bg-primary h-1"
          style={{ width: `${uploadPercentage}%` }}
        />
      </div>
			)}
    </>
  );
}

export default function NewProject() {
	return (
  <AuthenticationContextProvider>
    <ProjectContextProvider>
      <ReferenceContextProvider>
        <ProjectsLayout>
          <div className="grid grid-cols-2 gap-2 bg-gray-50 h-full">
            <div className="bg-white border-x border-gray-200 h-full">
              <div className="flex justify-between items-center p-3 px-5 uppercase tracking-wider shadow-sm border-b border-gray-200">
                <span className="font-semibold">Local Projects</span>
                <button
                  type="button"
                  className="text-white bg-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary font-medium text-xs px-3 py-1.5 text-center inline-flex items-center rounded-full gap-2 uppercase tracking-wider"
                >
                  <CloudArrowUpIcon className="h-5 w-5" />
                  Cloud Sync
                </button>
              </div>
              <div className="flex justify-between items-center h-14 px-5 tracking-wide shadow-sm border-b border-gray-200">
                <div className="font-bold ">
                  Autographa Project
                </div>
                <div className="text-xs font-semibold uppercase">
                  Last Sync
                </div>
              </div>
              <div>
                <GridRow
                  title="project title"
                  lastSync="10 mins ago"
                  selected
                />
                <GridRow
                  title="project title"
                  lastSync="Uploading ..."
                  selected
                  isUpload
                  uploadPercentage={90}
                />
                <GridRow
                  title="project title"
                  lastSync="45 mins ago"
                />
                <GridRow
                  title="project title"
                  lastSync="1 hour ago"
                />
                <GridRow
                  title="project title"
                  lastSync="24 hours ago"
                />
              </div>
            </div>

            <div className="bg-white border-x border-gray-200">
              <div className="flex justify-between items-center px-5 uppercase tracking-wider shadow-sm border-b border-gray-200">
                Cloud PROJECTS

                <ul class="flex flex-wrap text-xs font-medium text-center text-gray-500">
                  <li class="mr-2">
                    <a
                      href="#door43"
                      aria-current="page"
                      class="inline-block p-3 px-5 mt-4 text-white bg-black rounded-t-lg active"
                    >
                      Door 43
                    </a>
                  </li>
                  <li class="mr-2">
                    <a
                      href="#paratext"
                      class="inline-block p-3 px-5 mt-4 bg-gray-200 rounded-t-lg hover:text-white hover:bg-black"
                    >
                      ParaText
                    </a>
                  </li>
                  <li class="mr-2">
                    <a
                      href="#gitea"
                      class="inline-block p-3 px-5 mt-4 bg-gray-200 rounded-t-lg hover:text-white hover:bg-black"
                    >
                      Gitea
                    </a>
                  </li>
                </ul>

                <button
                  type="button"
                  className="text-white bg-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary font-medium text-xs px-3 py-1.5 text-center inline-flex items-center rounded-full gap-2 uppercase tracking-wider"
                >
                  <CloudArrowDownIcon className="h-5 w-5" />
                  Offline Sync
                </button>
              </div>
              <div className="grid grid-cols-3 justify-between items-center h-14 px-5 tracking-wide shadow-sm border-b border-gray-200">
                <form className="col-span-2">
                  <label
                    for="default-search"
                    className="mb-2 text-sm font-medium text-gray-900 sr-only"
                  >
                    Search
                  </label>
                  <div className="relative">
                    <input
                      type="search"
                      id="default-search"
                      className="block w-full p-1 px-2 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Search ..."
                      required
                    />
                    <button
                      type="submit"
                      className="absolute right-1 bottom-1 px-2 py-1"
                    >
                      <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </form>

                <div className="flex gap-3 justify-end items-center">
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white border"
                    src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />

                  <div className="text-sm font-bold text-right">
                    Arpit Jacob
                  </div>
                </div>
              </div>
              <div>
                <GridRow
                  title="project title"
                  lastSync="10 mins ago"
                />
                <GridRow
                  title="project title"
                  lastSync="Uploading"
                />
                <GridRow
                  title="project title"
                  lastSync="Uploading ..."
                  selected
                  isUpload
                  uploadPercentage={40}
                />
                <GridRow
                  title="project title"
                  lastSync="1 hour ago"
                  selected
                />
                <GridRow
                  title="project title"
                  lastSync="24 hours ago"
                />
              </div>
            </div>
          </div>
        </ProjectsLayout>
      </ReferenceContextProvider>
    </ProjectContextProvider>
  </AuthenticationContextProvider>
	);
}
