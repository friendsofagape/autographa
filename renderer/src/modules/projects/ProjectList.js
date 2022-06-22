/* eslint-disable react/jsx-no-useless-fragment */
import React, { Fragment, useState } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';

import { Disclosure, Transition, Menu } from '@headlessui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/solid';
import {
  StarIcon, DotsVerticalIcon,
} from '@heroicons/react/outline';
import localforage from 'localforage';

import { useTranslation } from 'react-i18next';
import ProjectsLayout from '@/layouts/projects/Layout';
import EnhancedTableHead from '@/components/ProjectsPage/Projects/EnhancedTableHead';
import AutographaContextProvider, { AutographaContext } from '@/components/context/AutographaContext';
import { getComparator, stableSort } from '@/components/ProjectsPage/Projects/SortingHelper';

import ExportProjectPopUp from '@/layouts/projects/ExportProjectPopUp';
import ProjectContextProvider from '@/components/context/ProjectContext';
import SearchTags from './SearchTags';
import NewProject from './NewProject';
import * as logger from '../../logger';

export default function ProjectList() {
  const router = useRouter();
  const { t } = useTranslation();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');

  const filterList = ['name', 'language', 'type', 'date', 'view'];
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
      FetchProjects,
    },
  } = React.useContext(AutographaContext);
  const [callEditProject, setCallEditProject] = useState(false);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [currentProject, setCurrentProject] = useState();
  const openExportPopUp = (project) => {
    setCurrentProject(project);
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

  const handleSelectProject = (event, projectName, projectId) => {
    logger.debug('ProjectList.js', 'In handleSelectProject');
    setSelectedProject(projectName);
    localforage.setItem('currentProject', `${projectName}_${projectId}`);
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

  const editproject = async (project) => {
    logger.debug('ProjectList.js', 'In editproject');
    const path = require('path');
    const fs = window.require('fs');
    const newpath = localStorage.getItem('userPath');
    await localforage.getItem('userProfile').then((value) => {
      const folder = path.join(newpath, 'autographa', 'users', value.username, 'projects', `${project.name}_${project.id[0]}`);
      const data = fs.readFileSync(path.join(folder, 'metadata.json'), 'utf-8');
      let metadata = JSON.parse(data);
      let dirName;
      switch (metadata.type.flavorType.flavor.name) {
        case 'textTranslation':
          dirName = 'ingredients';
          break;
        case 'textStories':
          dirName = 'content';
          break;
        default:
          break;
      }
      const settings = fs.readFileSync(path.join(folder, dirName, 'ag-settings.json'), 'utf-8');
      const agSetting = JSON.parse(settings);
      metadata = { ...metadata, ...agSetting };
      logger.debug('ProjectList.js', 'Loading current project metadata');
      setCurrentProject(metadata);
      setCallEditProject(true);
    });
  };
  const closeEditProject = async () => {
    logger.debug('ProjectList.js', 'Closing edit project page and updating the values');
    setCallEditProject(false);
    await FetchProjects();
  };

  return (
    <>
      {callEditProject === false
        ? (
          <>
            <ProjectsLayout
              title={t('projects-page')}
              isImport
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
                          <table data-testid="tablelayout" className="min-w-full divide-y divide-gray-200 mb-9">
                            <EnhancedTableHead
                              order={order}
                              orderBy={orderBy}
                              onRequestSort={handleRequestSort}
                            />
                            <tbody className="bg-white divide-y divide-gray-200">
                              {starredrow && (stableSort(
                                starredrow,
                                getComparator(order, orderBy),
                                orderBy,
                                order,
                                ).map((project) => (
                                  <Disclosure key={project.name}>
                                    {({ open }) => (
                                      <>
                                        <tr
                                          className="hover:bg-gray-100 focus:outline-none cursor-pointer"
                                        >
                                          <td className="px-4 py-4">
                                            <button
                                              title="star/unstar project"
                                              aria-label="unstar-project"
                                              onClick={(event) => handleClickStarred(event, project.name, 'starred')}
                                              type="button"
                                            >
                                              <StarIcon className="h-5 w-5 fill-current text-yellow-400" aria-hidden="true" />
                                            </button>
                                          </td>
                                          {/* <td className="px-4 py-4">
                                      <button
                                        type="button"
                                        title="open project"
                                        onClick={
                                          (event) => handleSelectProject(event, project.name, project.id[0])
                                        }
                                      >
                                        <ExternalLinkIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                                      </button>
                                    </td> */}
                                          <td className="px-6 py-4">
                                            <div
                                              onClick={
                                                (event) => handleSelectProject(event, project.name, project.id[0])
                                              }
                                              role="button"
                                              aria-label="project-name"
                                              tabIndex="0"
                                              className="focus:outline-none text-sm font-medium text-gray-900"
                                            >
                                              {project.name}
                                            </div>
                                          </td>
                                          <td className="px-6 py-4 text-sm text-gray-900">{project.language}</td>
                                          <td className="px-6 py-4 text-sm text-gray-900">{project.type}</td>
                                          <td className="px-6 py-4 text-sm text-gray-500">{moment(project.date).format('LL')}</td>
                                          <td className="px-6 py-4 text-sm text-gray-500">{moment(project.view, 'YYYY-MM-DD h:mm:ss').fromNow()}</td>

                                          <td className="px-6 py-4 text-right text-sm font-medium flex justify-end">
                                            <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-purple-900 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                              {open
                                                ? <ChevronUpIcon className="w-5 h-5 text-purple-500" />
                                              : <ChevronDownIcon className="w-5 h-5 text-purple-500" />}
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
                                              <td />
                                              <td className="px-6 py-4">
                                                <div className="text-xxs uppercase font-regular text-gray-500 tracking-wider p-1">description</div>
                                                <div className="text-sm tracking-wide p-1">{project.description}</div>
                                              </td>
                                              <td colSpan="3" className="px-5">
                                                <div className="text-xxs uppercase font-regular text-gray-500 tracking-wider p-1">Project ID</div>
                                                <div className="text-sm tracking-wide p-1">{project.id[0]}</div>
                                              </td>
                                              <td className="pl-5">

                                                <Menu as="div">
                                                  <div>
                                                    <Menu.Button className="px-5">
                                                      <DotsVerticalIcon className="h-5 w-5 text-primary" aria-hidden="true" />
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
                                                    <Menu.Items className="fixed right-26 top-4 w-56 mt-2 z-50 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                      <div className="px-1 py-1 ">
                                                        <Menu.Item>
                                                          {({ active }) => (
                                                            <button
                                                              type="button"
                                                              className={`${active ? 'bg-primary text-white' : 'text-gray-900'
                                                                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                                              onClick={() => editproject(project)}
                                                            >
                                                              {t('btn-edit')}
                                                            </button>
                                                          )}
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                          {({ active }) => (
                                                            <button
                                                              type="button"
                                                              className={`${active ? 'bg-primary text-white' : 'text-gray-900'
                                                                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                                              onClick={() => openExportPopUp(project)}
                                                            >
                                                              {t('btn-export')}
                                                            </button>
                                                          )}
                                                        </Menu.Item>
                                                      </div>
                                                    </Menu.Items>
                                                  </Transition>
                                                </Menu>

                                              </td>
                                            </tr>
                                          </Disclosure.Panel>
                                        </Transition>
                                      </>
                                    )}
                                  </Disclosure>
                                ))
                              )}
                            </tbody>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {unstarredrow && (stableSort(
                                unstarredrow,
                                getComparator(order, orderBy),
                                orderBy,
                                order,
                                ).map((project) => (
                                  <Disclosure key={project.name}>
                                    {({ open }) => (
                                      <>
                                        <tr>
                                          <td
                                            className="px-4 py-3 text-left text-xs font-medium text-gray-400"
                                          >
                                            <button
                                              aria-label="star-project"
                                              title="star/unstar project"
                                              onClick={(event) => handleClickStarred(event, project.name, 'unstarred')}
                                              type="button"
                                            >
                                              <StarIcon className="h-5 w-5" aria-hidden="true" />
                                            </button>
                                          </td>
                                          {/* <td className="px-4 py-4">
                                            <button
                                              type="button"
                                              title="open project"
                                              onClick={
                                                (event) => handleSelectProject(event, project.name, project.id[0])
                                              }
                                            >
                                              <ExternalLinkIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                                            </button>
                                          </td> */}
                                          <td className="px-6 py-4">
                                            <div className="flex items-center">
                                              <div className="ml-0">
                                                <div
                                                  onClick={
                                                    (event) => handleSelectProject(event, project.name, project.id[0])
                                                  }
                                                  role="button"
                                                  aria-label="unstar-projectname"
                                                  tabIndex="0"
                                                  className="text-sm font-medium text-gray-900"
                                                >
                                                  {project.name}

                                                </div>
                                              </div>
                                            </div>
                                          </td>
                                          <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{project.language}</div>
                                          </td>
                                          <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{project.type}</div>
                                          </td>
                                          <td className="px-6 py-4 text-sm text-gray-500">{moment(project.date).format('LL')}</td>
                                          <td className="px-6 py-4 text-sm text-gray-500">{moment(project.view, 'YYYY-MM-DD h:mm:ss').fromNow()}</td>
                                          <td className="px-6 py-4 text-right text-sm font-medium">
                                            <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-purple-900 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                              {open
                                                ? <ChevronUpIcon className="w-5 h-5 text-purple-500" />
                                              : <ChevronDownIcon aria-label="expand-project" className="w-5 h-5 text-purple-500" />}
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
                                              <td />
                                              <td className="px-6 py-4">
                                                <div className="text-xxs uppercase font-regular text-gray-500 tracking-wider p-1">description</div>
                                                <div aria-label="project-description-display" className="text-sm tracking-wide p-1">{project.description}</div>
                                              </td>
                                              <td colSpan="3" className="px-5">
                                                <div className="text-xxs uppercase font-regular text-gray-500 tracking-wider p-1">Project ID</div>
                                                <div className="text-sm tracking-wide p-1">{project.id[0]}</div>
                                              </td>
                                              <td className="pl-5">
                                                <Menu as="div">
                                                  <div>
                                                    <Menu.Button className="px-5">
                                                      <DotsVerticalIcon className="h-5 w-5 text-primary" aria-label="menu-project" aria-hidden="true" />
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
                                                    <Menu.Items className="fixed right-26 top-4 w-56 mb-1 z-50 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                      <div className="px-1 py-1">
                                                        <Menu.Item>
                                                          {({ active }) => (
                                                            <button
                                                              type="button"
                                                              aria-label="edit-project"
                                                              className={`${active ? 'bg-primary text-white' : 'text-gray-900'
                                                                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                                              onClick={() => editproject(project)}
                                                            >
                                                              {t('btn-edit')}
                                                            </button>
                                                          )}
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                          {({ active }) => (
                                                            <button
                                                              type="button"
                                                              className={`${active ? 'bg-primary text-white' : 'text-gray-900'
                                                                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                                              onClick={() => openExportPopUp(project)}
                                                            >
                                                              {t('btn-export')}
                                                            </button>
                                                          )}
                                                        </Menu.Item>
                                                      </div>
                                                    </Menu.Items>
                                                  </Transition>
                                                </Menu>

                                              </td>
                                            </tr>
                                          </Disclosure.Panel>

                                        </Transition>
                                      </>
                                    )}
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
            <ExportProjectPopUp open={openPopUp} closePopUp={closeExportPopUp} project={currentProject} />
          </>
        )
        : <ProjectContextProvider><AutographaContextProvider><NewProject call="edit" project={currentProject} closeEdit={() => closeEditProject()} /></AutographaContextProvider></ProjectContextProvider>}
    </>
  );
}
