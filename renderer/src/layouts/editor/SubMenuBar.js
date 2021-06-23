import { Menu, Transition } from '@headlessui/react';
import { Fragment, useContext } from 'react';

import {
  PencilIcon,
  DuplicateIcon,
  ArchiveIcon,
  TrashIcon,
  ExternalLinkIcon,
  BellIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline';

import ColumnsIcon from '@/icons/basil/Outline/Interface/Columns.svg';
import ReplyIcon from '@/icons/basil/Outline/Communication/Reply.svg';
import ForwardIcon from '@/icons/basil/Outline/Communication/Forward.svg';
import Font from '@/icons/font.svg';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import menuStyles from './MenuBar.module.css';
import styles from './SubMenuBar.module.css';
import MenuDropdown from '../../components/MenuDropdown.js/MenuDropdown';

export default function SubMenuBar() {
  const {
    actions: {
      setOpenResource,
    },
  } = useContext(ReferenceContext);
  return (
    <nav className="flex p-2 shadow">
      <div>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className={styles.dd}>
              File
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="flex absolute left-0 w-screen mt-2 -ml-2 origin-top-left bg-white divide-y divide-gray-100 shadow ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="flex px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      className={`${active ? 'bg-black text-primary' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                    >
                      <PencilIcon
                        className="w-5 h-5 mr-2"
                        aria-hidden="true"
                      />
                      Edit
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      className={`${active ? 'bg-black text-primary' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                    >
                      <DuplicateIcon
                        className="w-5 h-5 mr-2"
                        aria-hidden="true"
                      />
                      Duplicate
                    </button>
                  )}
                </Menu.Item>
              </div>
              <div className="flex px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      className={`${active ? 'bg-black text-primary' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                    >

                      <ArchiveIcon
                        className="w-5 h-5 mr-2"
                        aria-hidden="true"
                      />
                      Archive
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      className={`${active ? 'bg-black text-primary' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                    >
                      <ExternalLinkIcon
                        className="w-5 h-5 mr-2"
                        aria-hidden="true"
                      />
                      Move
                    </button>
                  )}
                </Menu.Item>
              </div>
              <div className="flex px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      className={`${active ? 'bg-black text-primary' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                    >
                      <TrashIcon
                        className="w-5 h-5 mr-2 text-violet-400"
                        aria-hidden="true"
                      />
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className={styles.dd}>
              FORMAT
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="flex absolute left-0 w-screen mt-2 -ml-2 origin-top-left bg-white divide-y divide-gray-100 shadow ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="flex px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      className={`${active ? 'bg-black text-primary' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                    >
                      <PencilIcon
                        className="w-5 h-5 mr-2"
                        aria-hidden="true"
                      />
                      Edit
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      className={`${active ? 'bg-black text-primary' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                    >
                      <DuplicateIcon
                        className="w-5 h-5 mr-2"
                        aria-hidden="true"
                      />
                      Duplicate
                    </button>
                  )}
                </Menu.Item>
              </div>
              <div className="flex px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      className={`${active ? 'bg-black text-primary' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                    >

                      <ArchiveIcon
                        className="w-5 h-5 mr-2"
                        aria-hidden="true"
                      />
                      Archive
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      className={`${active ? 'bg-black text-primary' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                    >
                      <ExternalLinkIcon
                        className="w-5 h-5 mr-2"
                        aria-hidden="true"
                      />
                      Move
                    </button>
                  )}
                </Menu.Item>
              </div>
              <div className="flex px-1 py-15">
                <Menu.Item>
                  {({ active }) => (
                    <>
                      <span
                        className={`${active ? 'bg-black text-primary' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        <Font
                          className="w-5 h-5 mr-2"
                          aria-hidden="true"
                        />
                      </span>
                      <span>
                        <MenuDropdown />
                      </span>
                    </>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
        <button type="button" className={styles.menu} aria-expanded="false">
          <span>INSERT</span>
        </button>
      </div>
      <div className="w-2/3">
        <div className="flex-1 items-center text-center place-self-center">
          <button onClick={() => setOpenResource(false)} type="button" className={`group ${menuStyles.btn}`}>
            <ColumnsIcon fill="currentColor" className="h-6 w-6" aria-hidden="true" />
            <span className="px-2 ml-1 bg-primary  text-white  group-hover:bg-white group-hover:text-primary inline-flex text-xxs leading-5 font-semibold rounded-full">3</span>
          </button>
          <button type="button" className={`group ${menuStyles.btn}`}>
            <ReplyIcon fill="currentColor" className="h-6 w-6" aria-hidden="true" />
          </button>
          <button type="button" className={`group ${menuStyles.btn} mx-0`}>
            <ForwardIcon fill="currentColor" className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex justify-end">
          <button type="button" className={`group ${menuStyles.btn}`}>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
            <span className="px-2 ml-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-success text-white group-hover:bg-white group-hover:text-primary ">21</span>
          </button>
          <button type="button" className={menuStyles.btn}>
            <InformationCircleIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </nav>

  );
}
