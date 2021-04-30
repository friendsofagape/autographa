/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react';
import 'tailwindcss/tailwind.css';

import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
  BellIcon,
  MenuIcon,
  XIcon,
  StarIcon,
} from '@heroicons/react/outline';
import { ChevronUpIcon, XCircleIcon } from '@heroicons/react/solid';

const profile = ['Your Profile', 'Settings', 'Sign out'];
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

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Example() {
  return (
    <div className="flex">

      <div className="w-28 bg-white shadow min-h-screen">
        <div className="grid justify-items-center items-center h-16 border border-b-1">
          <img
            className="h-8 w-8"
            src="/Logo.svg"
            alt="Workflow"
          />
        </div>
        <ul className="mt-8">
          <li className="text-gray-900 font-medium hover:text-gray-600 cursor-pointer mb-12">
            <div className="flex flex-col items-center">
              <img
                className="h-7 w-7"
                src="/projects.svg"
                alt="Workflow"
              />
              <div className="text-xs mt-3 uppercase">projects</div>
            </div>
          </li>
          <li className="text-gray-900 font-medium hover:text-gray-600 cursor-pointer mb-12">
            <div className="flex flex-col items-center">
              <img
                className="h-7 w-7"
                src="/new.svg"
                alt="Workflow"
              />
              <div className="text-xs mt-3 uppercase">new</div>
            </div>
          </li>
          <li className="text-gray-900 font-medium hover:text-gray-600 cursor-pointer mb-12">
            <div className="flex flex-col items-center">
              <img
                className="h-7 w-7"
                src="/sync.svg"
                alt="Workflow"
              />
              <div className="text-xs mt-3 uppercase">sync</div>
            </div>
          </li>
        </ul>

      </div>

      <div className="w-full">
        <Disclosure as="nav" className="bg-secondary">
          {({ open }) => (
            <>
              <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center">

                    <div className="hidden md:block">
                      <div className="-ml-4 flex items-baseline space-x-4">
                        <span className="text-white px-3 py-2 text-lg tracking-wide font-bold uppercase">
                          Autographa
                          <span className="text-primary font-extrabold"> 2.0</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <button
                        type="button"
                        className="inline-flex items-center px-2 py-1 border border-transparent rounded-md shadow-sm
                        text-sm font-medium text-white bg-gray-800
                        hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-700"
                      >
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                        {/* <CheckIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" /> */}
                        <span className="px-2 ml-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-success text-white">21</span>
                      </button>

                      {/* Profile dropdown */}
                      <Menu as="div" className="ml-3 relative">
                        {({ open }) => (
                          <>
                            <div>
                              <Menu.Button className="max-w-xs bg-gray-800 border-4 border-white rounded-full flex items-center text-sm
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-700"
                              >
                                <span className="sr-only">Open user menu</span>
                                <img
                                  className="h-8 w-8 rounded-full"
                                  src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                  alt=""
                                />
                              </Menu.Button>
                            </div>
                            <Transition
                              show={open}
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items
                                static
                                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                              >
                                {profile.map((item) => (
                                  <Menu.Item key={item}>
                                    {({ active }) => (
                                      <a
                                        href="#active"
                                        className={classNames(
                                          active ? 'bg-gray-100' : '',
                                          'block px-4 py-2 text-sm text-gray-700',
                                        )}
                                      >
                                        {item}
                                      </a>
                                    )}
                                  </Menu.Item>
                                ))}
                              </Menu.Items>
                            </Transition>
                          </>
                        )}
                      </Menu>

                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </Disclosure>

        <header className="bg-white shadow">
          <div className="mx-auto py-4 px-4 sm:px-4 lg:px-6 border-primary border-b-4 flex items-center">
            <h1 className="text-xl font-bold text-gray-900 uppercase tracking-wider">Projects</h1>
            <input
              type="text"
              name="search_box"
              id="search_box"
              autoComplete="given-name"
              className="bg-gray-100 mx-5 w-2/12 block rounded-full shadow-sm sm:text-sm focus:ring-gray-500 focus:border-primary border-gray-300"
            />
            <button
              type="button"
              className="rounded-full border border-transparent py-2 pl-5 pr-3 mx-2
              bg-gray-200 text-xs uppercase flex flex-wrap content-center justify-items-center
              hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <div className="leading-tight">Arabic</div>
              <XCircleIcon className="h-4 w-4 ml-2 fill-current text-gray-800" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="rounded-full border border-transparent py-2 pl-5 pr-3 mx-2
              bg-gray-200 text-xs uppercase flex flex-wrap content-center justify-items-center
              hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <div className="leading-tight">Malayalam</div>
              <XCircleIcon className="h-4 w-4 ml-2 fill-current text-gray-800" aria-hidden="true" />
            </button>
          </div>
        </header>
        <main>
          <div className="mx-auto py-6 sm:px-6 lg:px-8">
            {/* Replace with your content */}
            <div className="px-4 py-6 sm:px-0">

              <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
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
                                <ChevronUpIcon className="h-4 w-4 fill-current text-gray-400" aria-hidden="true" />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* /End replace */}
          </div>
        </main>
      </div>

    </div>

  );
}
