/* eslint-disable max-len */
import React, { Fragment, useState } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';

import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/solid';
import {
 StarIcon, ExternalLinkIcon, PencilAltIcon, DotsVerticalIcon,
} from '@heroicons/react/outline';
import localforage from 'localforage';

import ProjectsLayout from '@/layouts/projects/Layout';
import EnhancedTableHead from '@/components/ProjectsPage/Projects/EnhancedTableHead';
import { AutographaContext } from '@/components/context/AutographaContext';
import { getComparator, stableSort } from '@/components/ProjectsPage/Projects/SortingHelper';

import ExportProjectPopUp from '@/layouts/projects/ExportProjectPopUp';
import SearchTags from './SearchTags';

export default function ProjectList() {
  const router = useRouter();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [showRow, setShowRow] = useState(false);

  const filterList = ['name', 'language', 'date', 'view'];
  const {
    states: {
      starredrow,
      unstarredrow,
      starredProjects,
      unstarredProjects,
      activeNotificationCount,
    },
    action: {
      setStarredRow,
      setUnStarredRow,
      handleClickStarred,
      setSelectedProject,
      setNotifications,
      setActiveNotificationCount,
    },
  } = React.useContext(AutographaContext);

  const [openPopUp, setOpenPopUp] = useState(false);
  const [exportProject, setExportProject] = useState();

  const openExportPopUp = (project) => {
    setExportProject(project.name);
    setOpenPopUp(true);
  };
  const closeExportPopUp = () => {
    setOpenPopUp(false);
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectProject = (event, projectName) => {
    setSelectedProject(projectName);
    localforage.setItem('currentProject', projectName);
    router.push('/home');
    localforage.getItem('notification').then((value) => {
      const temp = [...value];
      temp.push({
          title: 'Project',
          text: `successfully loaded ${projectName} files`,
          type: 'success',
          time: moment().format(),
          hidden: true,
      });
      setNotifications(temp);
    }).then(() => setActiveNotificationCount(activeNotificationCount + 1));
  };

  const toggleShowRow = () => {
    if (showRow) {
      setShowRow(false);
    } else {
      setShowRow(true);
    }
  };

  return (
    <>
      <ProjectsLayout
        title="Projects"
        header={(
          <SearchTags
            contentList1={starredProjects}
            contentList2={unstarredProjects}
            filterList={filterList}
            onfilerRequest1={setStarredRow}
            onfilerRequest2={setUnStarredRow}
          />
        )}
      >

        <div className="mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-4 sm:px-0">

            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table data-testid="tablelayout" className="min-w-full divide-y divide-gray-200">
                      <EnhancedTableHead
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                      />
                      <tbody className="bg-white divide-y divide-gray-200">
                        {starredrow && (stableSort(starredrow,
                          getComparator(order, orderBy),
                          orderBy,
                          order).map((project) => (
                            <>
                              <tr
                                className="hover:bg-gray-100 focus:outline-none cursor-pointer"
                                key={project.name}
                                onClick={() => toggleShowRow()}
                              >
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <button
                                    onClick={(event) => handleClickStarred(event, project.name, 'starred')}
                                    type="button"
                                  >
                                    <StarIcon className="h-5 w-5 fill-current text-yellow-400" aria-hidden="true" />
                                  </button>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <button
                                    // onClick={}
                                    type="button"
                                  >
                                    <ExternalLinkIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                                  </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div
                                    className="flex items-center"
                                  >
                                    <div className="ml-0">
                                      <div
                                        onClick={
                                          (event) => handleSelectProject(event, project.name)
                                        }
                                        role="button"
                                        tabIndex="0"
                                        className="focus:outline-none text-sm font-medium text-gray-900"
                                      >
                                        {project.name}

                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{project.language}</div>
                                </td>
                                {/* <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                  ${project.status !== 'active'
                                        ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                  >
                                    active
                                  </span>
                                </td> */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{moment(project.date).format('LL')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{moment(project.view, 'YYYY-MM-DD h:mm:ss').fromNow()}</td>
                                {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex -space-x-1 overflow-hidden">
                                    <img
                                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                                      src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                      alt=""
                                    />
                                    <img
                                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                                      src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                      alt=""
                                    />
                                    <img
                                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                                      alt=""
                                    />
                                    <img
                                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                      alt=""
                                    />
                                  </div>
                                </td> */}
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end">
                                  {showRow
                                    ? <ChevronUpIcon className="h-4 w-4 mt-2 fill-current text-gray-400" aria-hidden="true" />
                                    : <ChevronDownIcon className="h-4 w-4 mt-2 fill-current text-gray-400" aria-hidden="true" />}
                                </td>
                              </tr>
                              {showRow
                                && (
                                  <tr key={project.name}>
                                    <td colSpan="9" className="px-4 py-4 whitespace-nowrap">
                                      <div className="flex gap-4">
                                        <div className="flex-grow">
                                          <div className="text-xxs uppercase font-regular text-gray-500 tracking-wider p-1">description</div>
                                          <div className="text-sm tracking-wide p-1">{project.description}</div>
                                        </div>
                                        <div className="flex-grow">
                                          <div className="text-xxs uppercase font-regular text-gray-500 tracking-wider p-1">Source Languages</div>
                                          <div className="text-sm tracking-wide p-1">English, Aramic.</div>
                                        </div>
                                        <div className="flex flex-shrink items-center justify-center text-center">
                                          <button
                                            // onClick={}
                                            type="button"
                                            className="px-5"
                                          >
                                            <PencilAltIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                                          </button>
                                          <button
                                            onClick={() => openExportPopUp(project)}
                                            type="button"
                                            className="px-5"
                                          >
                                            <DotsVerticalIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                                          </button>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                            </>

                          ))
                        )}
                      </tbody>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {unstarredrow && (stableSort(unstarredrow,
                          getComparator(order, orderBy),
                          orderBy,
                          order).map((project) => (
                            <Disclosure>
                              <tr key={project.name}>
                                <td
                                  className="px-4 py-3 text-left text-xs font-medium text-gray-400"
                                >
                                  <button
                                    onClick={(event) => handleClickStarred(event, project.name, 'unstarred')}
                                    type="button"
                                  >
                                    <StarIcon className="h-5 w-5" aria-hidden="true" />
                                  </button>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <button
                                    // onClick={}
                                    type="button"
                                  >
                                    <ExternalLinkIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                                  </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="ml-0">
                                      <div
                                        onClick={
                                          (event) => handleSelectProject(event, project.name)
                                        }
                                        role="button"
                                        tabIndex="0"
                                        className="text-sm font-medium text-gray-900"
                                      >
                                        {project.name}

                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{project.language}</div>
                                </td>
                                {/* <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                  ${project.status === 'active'
                                        ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                  >
                                    finished
                                  </span>
                                </td> */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{moment(project.date).format('LL')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{moment(project.view, 'YYYY-MM-DD h:mm:ss').fromNow()}</td>
                                {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex -space-x-1 overflow-hidden">
                                    <img
                                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                                      src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                      alt=""
                                    />
                                    <img
                                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                                      src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                      alt=""
                                    />
                                    <img
                                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                                      alt=""
                                    />
                                    <img
                                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                      alt=""
                                    />
                                  </div>
                                </td> */}
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <Disclosure.Button>
                                    <ChevronUpIcon className="h-4 w-4 fill-current text-gray-400" aria-hidden="true" />
                                  </Disclosure.Button>
                                </td>
                              </tr>
                              <Transition
                                as={Fragment}
                                enter="transition duration-100 ease-out"
                                enterFrom="transform scale-95 opacity-0"
                                enterTo="transform scale-100 opacity-100"
                                leave="transition duration-75 ease-out"
                                leaveFrom="transform scale-100 opacity-100"
                                leaveTo="transform scale-95 opacity-0"
                              >
                                <Disclosure.Panel as={Fragment}>
                                  <tr key={project.name}>
                                    <td colSpan="9" className="px-4 py-4 whitespace-nowrap">
                                      <div className="flex gap-4">
                                        <div className="flex-grow">
                                          <div className="text-xxs uppercase font-regular text-gray-500 tracking-wider p-1">description</div>
                                          <div className="text-sm tracking-wide p-1">{project.description}</div>
                                        </div>
                                        <div className="flex-grow">
                                          <div className="text-xxs uppercase font-regular text-gray-500 tracking-wider p-1">Source Languages</div>
                                          <div className="text-sm tracking-wide p-1">English, Aramic.</div>
                                        </div>
                                        <div className="flex flex-shrink items-center justify-center text-center">
                                          <button
                                            // onClick={}
                                            type="button"
                                            className="px-5"
                                          >
                                            <PencilAltIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                                          </button>
                                          <button
                                            onClick={() => openExportPopUp(project)}
                                            type="button"
                                            className="px-5"
                                          >
                                            <DotsVerticalIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                                          </button>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </Disclosure.Panel>
                              </Transition>
                            </Disclosure>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProjectsLayout>
      <ExportProjectPopUp open={openPopUp} closePopUp={closeExportPopUp} projectName={exportProject} />
    </>
  );
}
