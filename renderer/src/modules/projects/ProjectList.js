import { Fragment } from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/solid';
import { StarIcon } from '@heroicons/react/outline';

import ProjectsLayout from '@/layouts/ProjectsLayout';
import SearchTags from './SearchTags';

const people = [
  {
    name: 'Project Malayalam',
    title: 'Malayalam',
    department: 'Optimization',
    status: 'active',
    created: '12 Aug 2019',
    updated: '1 day ago',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  {
    name: 'Project Arabic',
    title: 'Arabic',
    department: 'Optimization',
    status: 'finished',
    created: '10 Jun 2019',
    updated: '3 hours ago',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
];

export default function ProjectList() {
  return (
    <ProjectsLayout
      title="Projects"
      header={<SearchTags />}
    >

      <div className="mx-auto py-6 sm:px-6 lg:px-8">

        <div className="px-4 py-4 sm:px-0">

          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-400"
                        >
                          <StarIcon className="h-5 w-5" aria-hidden="true" />
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Project Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Target Language
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Last Viewed
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Editors
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {people.map((person) => (
                        <Disclosure>
                          <tr key={person.name}>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <StarIcon className="h-5 w-5 fill-current text-yellow-400" aria-hidden="true" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="ml-0">
                                  <div className="text-sm font-medium text-gray-900">{person.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{person.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${person.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {person.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.created}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.updated}</td>
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
                                <ChevronUpIcon className={`${open ? 'transform rotate-180' : ''} h-4 w-4 fill-current text-gray-400`} aria-hidden="true" />
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
                              <tr key={person.name}>
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
                      ))}
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
