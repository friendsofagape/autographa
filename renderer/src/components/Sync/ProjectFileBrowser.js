/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-alert */
import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRightIcon } from '@heroicons/react/solid';
// import FileIcon from '@/icons/file.svg';
import Dropzone from './Dropzone/Dropzone';
// import fetchParseFiles from '../../core/projects/fectchParseFiles';
// import * as logger from '../../logger';
import { SyncContext } from './SyncContextProvider';
import ProgressBar from './ProgressBar';
import LoadingSpinner from './LoadingSpinner';

export default function ProjectFileBrowser() {
  // const username = 'Michael';
  const [index, setIndex] = useState(-1);
  const {
    states: {
 agProjects, agProjectsMeta, uploadStartAg, totalFilesAg, totalUploadedAg,
},
    action: {
      fetchProjects, onDragEndFolder, handleDropFolderAg,
    },
  } = useContext(SyncContext);

  // const [files, setFiles] = useState([]);
  // const [projectMeta, setProjectmeta] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  // onclick dispaly file code
  // const handleProjects = async (projectName, indexValue) => {
  //   logger.debug('Dropzone.js', 'calling handleProjects event');
  //   setLoading(true);
  //   // const res = await fetchParseFiles(username, projectName);
  //   const selectedProject = agProjectsMeta.filter((project) => project.identification.name.en === projectName);
  //   // const selectedFiles = [];
  //   // for (let key in selectedProject[0].ingredients) {
  //   //   selectedFiles.push(key.split('/').pop());
  //   // }
  //   setFiles(selectedProject[0]);
  //   // console.log("selected : == :",selectedProject[0].identification.name.en);
  //   // console.log("selected files : == :", selectedFiles);

  //   setIndex(indexValue);
  //   // setFiles(res);
  //   setLoading(false);

  //   // .then((res) => {
  //   //   setIndex(indexValue);
  //   //   setFiles(res);
  //   // });
  // };

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

      {uploadStartAg
        && <ProgressBar currentValue={totalUploadedAg} totalValue={totalFilesAg} />}

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

            {/* {index !== -1 && agProjects[index] !== undefined ? (
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.keys(files.ingredients).map((file) => (
                  <tr key={file.filename} draggable onDragStart={() => onDragEnd(file)} className="cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <svg viewBox="0 0 14 16" fill="none" className="mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M9.09182 1.00903H3.95833C2.3696 1.00903 1 2.29684 1 3.88635V12.1526C1 13.8316 2.28009 15.1703 3.95833 15.1703H10.1227C11.7122 15.1703 13 13.7428 13 12.1526V5.08002L9.09182 1.00903Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M8.88916 1V3.2446C8.88916 4.34028 9.77573 5.22917 10.8706 5.23148C11.8868 5.2338 12.9262 5.23457 12.9964 5.22994" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path opacity="0.4" d="M8.74248 10.8824H4.57812" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path opacity="0.4" d="M7.16739 7.06128H4.57788" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                        <span className="text-sm text-gray-900">
                          {file.split('/').pop()}
                        </span>

                      </div>
                    </td>
                  </tr>
              ))}
              </tbody>
          ) */}
            <tbody className="bg-white divide-y divide-gray-200 h-full">
              {/* {agProjects.map((project, i) => ( */}
              {agProjects.map((project) => (
                <tr
                  key={project}
                  draggable
                  onDragStart={() => onDragEndFolder(agProjectsMeta.filter((projectData) => projectData.identification.name.en === project))}
                    // onClick={() => handleProjects(project, i)}
                  data-testid="project-id"
                  className="cursor-pointer"
                >

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {/* <svg viewBox="0 0 14 16" fill="none" className="mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M9.09182 1.00903H3.95833C2.3696 1.00903 1 2.29684 1 3.88635V12.1526C1 13.8316 2.28009 15.1703 3.95833 15.1703H10.1227C11.7122 15.1703 13 13.7428 13 12.1526V5.08002L9.09182 1.00903Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8.88916 1V3.2446C8.88916 4.34028 9.77573 5.22917 10.8706 5.23148C11.8868 5.2338 12.9262 5.23457 12.9964 5.22994" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path opacity="0.4" d="M8.74248 10.8824H4.57812" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path opacity="0.4" d="M7.16739 7.06128H4.57788" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg> */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="25px" height="25px">
                        <path fill="#D8D4EA" d="M100.2,104H19c-5.5,0-10-4.5-10-10V29h98.7c6,0,10.7,5.3,9.9,11.2l-7.5,55C109.5,100.2,105.2,104,100.2,104 z" />
                        <path fill="#FFF" d="M104,104H19c-5.5,0-10-4.5-10-10V24h24.6c3.3,0,6.5,1.7,8.3,4.5l4.1,6.1c1.9,2.8,5,4.5,8.3,4.5H89 c5.5,0,10,4.5,10,10v41v1.9C99,96.5,100.8,100.8,104,104L104,104z" />
                        <path fill="#454B54" d="M100.2,107H19c-7.2,0-13-5.8-13-13V24c0-1.7,1.3-3,3-3h24.6c4.4,0,8.4,2.2,10.8,5.8l4.1,6.1 c1.3,2,3.5,3.1,5.8,3.1H89c7.2,0,13,5.8,13,13v35c0,1.7-1.3,3-3,3s-3-1.3-3-3V49c0-3.9-3.1-7-7-7H54.4c-4.4,0-8.4-2.2-10.8-5.8 l-4.1-6.1c-1.3-2-3.5-3.1-5.8-3.1H12v67c0,3.9,3.1,7,7,7h81.2c3.5,0,6.5-2.6,6.9-6.1l7.5-55c0.2-2-0.4-4-1.7-5.5 c-1.3-1.5-3.2-2.4-5.2-2.4c-1.7,0-3-1.3-3-3s1.3-3,3-3c3.7,0,7.3,1.6,9.7,4.4c2.5,2.8,3.6,6.5,3.2,10.2l-7.5,55 C112.3,102.1,106.7,107,100.2,107z" />
                        <path fill="#454B54" d="M107.7,32H43c-1.7,0-3-1.3-3-3s1.3-3,3-3h64.7c1.7,0,3,1.3,3,3S109.3,32,107.7,32z" />
                      </svg>
                      <span className="text-sm text-gray-900">{project}</span>
                    </div>
                  </td>

                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.created}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.updated}</td> */}
                </tr>
                ))}
              <Dropzone dropped={() => handleDropFolderAg()} />
              {/* <Dropzone dropped={() => handleDrop({ index, username })} /> */}
            </tbody>
            {/* } */}
          </table>
)}
    </>
  );
}
