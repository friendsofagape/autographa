import React, { Fragment } from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';
import { StarIcon } from '@heroicons/react/outline';

import moment from 'moment';
import ProjectsLayout from '../../layouts/ProjectsLayout';
import EnhancedTableHead from '../../components/ProjectsPage/Projects/EnhancedTableHead';
import { AutographaContext } from '../../components/AutogrpahaContext/AutographaContext';
import { getComparator, stableSort } from '../../components/ProjectsPage/Projects/SortingHelper';
import SearchTags from './SearchTags';

export default function ProjectList() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const filterList = ['name', 'language', 'date', 'view'];
  const {
    states: {
      starredrow,
      unstarredrow,
      starredProjects,
      unstarredProjects,
    },
    action: {
      setStarredRow,
      setUnStarredRow,
    },
  } = React.useContext(AutographaContext);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
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
                  <table className="min-w-full divide-y divide-gray-200">
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
                          <Disclosure>
                            <tr key={project.name}>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <button type="button">
                                  <StarIcon className="h-5 w-5 fill-current text-yellow-400" aria-hidden="true" />
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="ml-0">
                                    <div className="text-sm font-medium text-gray-900">{project.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{project.language}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${project.status !== 'active'
                                  ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                >
                                  active
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{moment(project.view, 'YYYY-MM-DD h:mm:ss').fromNow()}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                              </td>
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
                                  <td colSpan="8" className="px-4 py-4 whitespace-nowrap">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <div className="text-xxs uppercase font-regular text-gray-500 tracking-wider p-1">description</div>
                                        <div className="text-sm tracking-wide p-1">This is project description for this project. This project is about to be description for this project.</div>
                                      </div>
                                      <div>
                                        <div className="text-xxs uppercase font-regular text-gray-500 tracking-wider p-1">Source Languages</div>
                                        <div className="text-sm tracking-wide p-1">English, Aramic.</div>
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
                                <button type="button">
                                  <StarIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="ml-0">
                                    <div className="text-sm font-medium text-gray-900">{project.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{project.language}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${project.status === 'active'
                                  ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                >
                                  finished
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{moment(project.view, 'YYYY-MM-DD h:mm:ss').fromNow()}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                              </td>
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
                                  <td colSpan="8" className="px-4 py-4 whitespace-nowrap">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <div className="text-xxs uppercase font-regular text-gray-500 tracking-wider p-1">description</div>
                                        <div className="text-sm tracking-wide p-1">This is project description for this project. This project is about to be description for this project.</div>
                                      </div>
                                      <div>
                                        <div className="text-xxs uppercase font-regular text-gray-500 tracking-wider p-1">Source Languages</div>
                                        <div className="text-sm tracking-wide p-1">English, Aramic.</div>
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

  );
}
