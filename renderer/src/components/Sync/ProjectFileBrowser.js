/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-alert */
import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRightIcon } from '@heroicons/react/solid';
// import FileIcon from '@/icons/file.svg';
import Dropzone from './Dropzone/Dropzone';
// import fetchParseFiles from '../../core/projects/fectchParseFiles';
import * as logger from '../../logger';
import { SyncContext } from './SyncContextProvider';

import LoadingSpinner from './LoadingSpinner';

export default function ProjectFileBrowser() {
  const username = 'Michael';
  const [index, setIndex] = useState(-1);
  const {
    states: { agProjects, agProjectsMeta },
    action: { fetchProjects, onDragEnd, handleDrop },
  } = useContext(SyncContext);

  const [files, setFiles] = useState([]);
  // const [projectMeta, setProjectmeta] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleProjects = async (projectName, indexValue) => {
    logger.debug('Dropzone.js', 'calling handleProjects event');
    setLoading(true);
    // const res = await fetchParseFiles(username, projectName);

    const selectedProject = agProjectsMeta.filter((project) => project.identification.name.en === projectName);
    // const selectedFiles = [];
    // for (let key in selectedProject[0].ingredients) {
    //   selectedFiles.push(key.split('/').pop());
    // }
    setFiles(selectedProject[0]);
    // console.log("selected : == :",selectedProject[0].identification.name.en);
    // console.log("selected files : == :", selectedFiles);

    setIndex(indexValue);
    // setFiles(res);
    setLoading(false);

    // .then((res) => {
    //   setIndex(indexValue);
    //   setFiles(res);
    // });
  };

  useEffect(() => {
    const getProjects = async () => {
      await fetchProjects();
    };
    getProjects();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="flex flex-row mx-5 my-3 border-b-1 border-primary">
        <button
          type="button"
          className="font-semibold"
          onClick={() => setIndex(-1)}
          data-testid="ag-step1"
        >
          {`${t('app-name') } `}
          {t('label-project')}
        </button>
        {agProjects[index]
          ? (
            <span className="font-semibold tracking-wide text-primary ">
              <ChevronRightIcon className="h-4 w-4 mx-2 inline-block fill-current text-gray-800" aria-hidden="true" />
              {agProjects[index]}
            </span>
          ) : <span />}
      </div>

      {loading
        ? (
          <LoadingSpinner />
        )
        : (
          <table className="min-w-full divide-y divide-gray-200" data-testid="table">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  data-testid="th-name"
                >
                  {t('label-name')}
                </th>
                {/* <th
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
            </th> */}
              </tr>
            </thead>

            {index !== -1 && agProjects[index] !== undefined ? (
              <tbody className="bg-white divide-y divide-gray-200">
                {/* {files.map((file) => ( */}
                {Object.keys(files.ingredients).map((file) => (
                  // <tr key={file.filename} draggable onDragStart={() => onDragEnd(file)} className="cursor-pointer">
                  <tr key={file}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <svg viewBox="0 0 14 16" fill="none" className="mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M9.09182 1.00903H3.95833C2.3696 1.00903 1 2.29684 1 3.88635V12.1526C1 13.8316 2.28009 15.1703 3.95833 15.1703H10.1227C11.7122 15.1703 13 13.7428 13 12.1526V5.08002L9.09182 1.00903Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M8.88916 1V3.2446C8.88916 4.34028 9.77573 5.22917 10.8706 5.23148C11.8868 5.2338 12.9262 5.23457 12.9964 5.22994" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path opacity="0.4" d="M8.74248 10.8824H4.57812" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path opacity="0.4" d="M7.16739 7.06128H4.57788" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                        <span className="text-sm text-gray-900">
                          {/* {file.filename} */}
                          {file.split('/').pop()}
                          {/* (
                          {file.filenameAlias}
                          ) */}
                        </span>

                      </div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.created}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.updated}</td> */}
                  </tr>
              ))}
                {/* <Dropzone dropped={() => handleDrop({ index, username })} /> */}
              </tbody>
          )
            : (
              <tbody className="bg-white divide-y divide-gray-200 h-full">
                {agProjects.map((project, i) => (
                  <tr
                    key={project}
                    draggable
                    onDragStart={() => onDragEnd(project)}
                    onClick={() => handleProjects(project, i)}
                    data-testid="project-id"
                    className="cursor-pointer"
                  >

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <svg viewBox="0 0 14 16" fill="none" className="mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M9.09182 1.00903H3.95833C2.3696 1.00903 1 2.29684 1 3.88635V12.1526C1 13.8316 2.28009 15.1703 3.95833 15.1703H10.1227C11.7122 15.1703 13 13.7428 13 12.1526V5.08002L9.09182 1.00903Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M8.88916 1V3.2446C8.88916 4.34028 9.77573 5.22917 10.8706 5.23148C11.8868 5.2338 12.9262 5.23457 12.9964 5.22994" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path opacity="0.4" d="M8.74248 10.8824H4.57812" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path opacity="0.4" d="M7.16739 7.06128H4.57788" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-sm text-gray-900">{project}</span>
                      </div>
                    </td>

                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.created}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.updated}</td> */}
                  </tr>
                ))}
                <Dropzone dropped={() => handleDrop({ index, username })} />
              </tbody>
            )}
          </table>
)}
    </>
  );
}
