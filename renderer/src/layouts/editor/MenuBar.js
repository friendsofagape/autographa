import Link from 'next/link';
import React, { Fragment, useContext } from 'react';
import {
  Disclosure, Menu, Transition,
} from '@headlessui/react';
import {
  UserIcon,
  ArrowLeftIcon,
} from '@heroicons/react/outline';
import router from 'next/router';
import { useTranslation } from 'react-i18next';
import EditorSideBar from '@/modules/editorsidebar/EditorSideBar';
// eslint-disable-next-line import/no-unresolved
import { classNames } from '@/util/classNames';
import LogoIcon from '@/icons/logo.svg';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import { ProjectContext } from '@/components/context/ProjectContext';
import { AuthenticationContext } from '@/components/Login/AuthenticationContextProvider';
import styles from './MenuBar.module.css';
import { saveReferenceResource } from '@/core/projects/updateAgSettings';

// const solutions = [
//   {
//     name: 'Translation',
//     href: '##',
//     icon: LayoutIcon,
//   },
//   {
//     name: 'Audio',
//     href: '##',
//     icon: BullhornIcon,
//   },
//   {
//     name: 'MT',
//     href: '##',
//     icon: ProcessorIcon,
//   },
//   {
//     name: 'Check',
//     href: '##',
//     icon: CheckIcon,
//   },
// ];

export default function TopMenuBar() {
  const {
    states: {
      selectedProject,
      openSideBar,
    },
    actions: {
      setOpenSideBar,
    },
  } = useContext(ProjectContext);

  const {
    state: {
      fontSize,
    },
    actions: {
      setFontsize,
    },
  } = useContext(ReferenceContext);
  const userPic = true;
  const { t } = useTranslation();
  const profile = [t('label-your-profile')];
  const _projectnamewithId = selectedProject;
  const projectname = _projectnamewithId?.split('_');
  const { action: { logout } } = React.useContext(AuthenticationContext);

  function closeSideBar(open) {
    setOpenSideBar(open);
  }
  const handleFontSize = (status) => {
    if (status === 'dec' && fontSize > 0.70) {
      setFontsize(fontSize - 0.2);
    }
    if (status === 'inc' && fontSize < 2) {
      setFontsize(fontSize + 0.2);
    }
  };
  const goToProjectPage = async () => {
    await saveReferenceResource();
    router.push('/projects');
  };
  return (
    <>

      <EditorSideBar isOpen={openSideBar} closeSideBar={closeSideBar} />

      <Disclosure
        as="nav"
        className="flex items-center h-16 border-b border-gray-200"
      >
        {() => (
          <>

            <button className="h-full px-5 border-r border-gray-200" title="Back" type="button" onClick={() => goToProjectPage()}>
              <ArrowLeftIcon className="h-6 w-6" />
            </button>

            <div className="h-full w-20 grid justify-items-center items-center border-r border-gray-200 hover:text-primary">
              <LogoIcon
                className="h-8 w-8"
                alt="Workflow"
              />
            </div>

            <div>
              <span aria-label="editor-project-name" className="text-primary px-10 py-2 text-lg tracking-wide font-bold uppercase" title="Project Name">
                {projectname?.[0]}
              </span>
            </div>

            <div className="flex-grow">
              <div className="mt-1 relative w-2/5 m-auto focus:ring-primary focus:border-primary bg-gray-100 block rounded-md sm:text-sm border-none placeholder-gray-700">
                {/* <div className="absolute inset-y-0 left-0 pl-3
                flex items-center pointer-events-none">
                  <span className="text-gray-300 sm:text-sm">
                    <SearchIcon className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="bg-gray-100 focus:ring-primary
                  focus:border-primary block w-full pl-10 sm:text-sm border-none rounded-md"
                  placeholder="Search"
                  // onClick={openSideBars}
                /> */}
              </div>

            </div>

            <div className="flex justify-end">

              <div className="mr-4 flex items-center">

                {/* <PopoverProjectType items={solutions}>
                  <button type="button" className={styles.btn}>
                    <AppsIcon
                      fill="currentColor"
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </button>
                </PopoverProjectType> */}

                <button type="button" className={styles.btn}>

                  <div
                    aria-label="decrease-font"
                    onClick={() => { handleFontSize('dec'); }}
                    role="button"
                    tabIndex="0"
                    title={t('tooltip-editor-font-dec')}
                    className="h6 w-6 hover:text-black font-bold border-r border-gray-200 text-center"
                  >
                    {t('label-editor-font-char')}
                  </div>
                  <div
                    aria-label="increase-font"
                    className="h6 w-6 hover:text-black font-bold text-lg text-center"
                    onClick={() => { handleFontSize('inc'); }}
                    role="button"
                    title={t('tooltip-editor-font-inc')}
                    tabIndex="0"
                  >
                    {t('label-editor-font-char')}
                  </div>

                </button>

                {/* <button type="button" className={styles.btn}>
                  <ExpandIcon fill="currentColor" className="h-6 w-6" aria-hidden="true" />
                </button>

                <button type="button" className={styles.btnDark}>
                  <SunIcon className="h-6 w-6" aria-hidden="true" />
                </button> */}

                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  {({ open }) => (
                    <>
                      <div>
                        <Menu.Button className="max-w-xs bg-gray-800 border-4 border-gray-300 rounded-full flex items-center text-sm
                              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-700"
                        >
                          <span className="sr-only">Open user menu</span>

                          {/* <UserIcon className="h-8 w-8 rounded-full" /> */}

                          {/* check if user pic available  */}
                          {userPic
                            ? (
                              <div className="h-8 w-8 p-2 bg-primary rounded-full">
                                <UserIcon className="h-4 w-4 text-white" />
                              </div>
                            )
                            : (
                              <img
                                className="h-8 w-8 rounded-full"
                                src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                alt=""
                              />
                            )}

                          {/* <img
                            className="h-8 w-8 rounded-full"
                            src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
                          /> */}

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
                                <Link href="/profile">
                                  <a
                                    href="#profile"
                                    className={classNames(
                                        active ? 'bg-gray-100' : '',
                                        'block px-4 py-2 text-sm text-gray-700',
                                      )}
                                  >
                                    {item}
                                  </a>
                                </Link>
                                )}
                            </Menu.Item>
                          ))}
                          <Menu.Item key="Sign out">
                            {({ active }) => (
                              <a
                                href="#profile"
                                onClick={() => logout()}
                                className={classNames(
                                      active ? 'bg-gray-100' : '',
                                      'block px-4 py-2 text-sm text-gray-700',
                                )}
                              >
                                {t('btn-signout')}
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>
              </div>
            </div>

          </>
        )}
      </Disclosure>

    </>

  );
}
