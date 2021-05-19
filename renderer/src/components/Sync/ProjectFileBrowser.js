/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable max-len */
/* eslint-disable no-alert */
import React from 'react';
import { ChevronRightIcon } from '@heroicons/react/solid';
import Dropzone from './Dropzone/Dropzone';
import fetchParseFiles from '../../core/projects/fectchParseFiles';
import * as logger from '../../logger';
import { SyncContext } from './SyncContextProvider';

export default function ProjectFileBrowser() {
  const username = 'Michael';
  const [index, setIndex] = React.useState(-1);
  const {
    states: { agProjects },
    action: { fetchProjects, onDragEnd, handleDrop },
  } = React.useContext(SyncContext);
  const [files, setFiles] = React.useState([]);

  const handleProjects = async (projectName, indexValue) => {
    logger.debug('Dropzone.js', 'calling handleProjects event');
    await fetchParseFiles(username, projectName)
    .then((res) => {
      setIndex(indexValue);
      setFiles(res);
    });
  };
  React.useEffect(() => {
    fetchProjects(username);
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <div className="flex flex-row mx-5 my-3 border-b-1 border-primary">
        <span className="font-semibold" onClick={() => setIndex(0)}>
          Autographa Project
        </span>
        {agProjects[index]
        ? (
          <span className="font-semibold tracking-wide text-primary ">
            <ChevronRightIcon className="h-4 w-4 mx-2 inline-block fill-current text-gray-800" aria-hidden="true" />
            {agProjects[index]}
          </span>
        ) : <span />}
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
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

            {files.map((file) => (
              <tr key={file.filename} draggable onDragStart={() => onDragEnd(file)}>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-0">
                      <div className="text-sm text-gray-900">
                        {file.filename}
                        (
                        {file.filenameAlias}
                        )
                      </div>
                    </div>
                  </div>
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.created}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.updated}</td> */}
              </tr>
                    ))}
            <Dropzone dropped={() => handleDrop({ index, username })} />
          </tbody>
        )
        : (
          <tbody className="bg-white divide-y divide-gray-200">

            {agProjects.map((project, i) => (
              <tr key={project} onClick={() => handleProjects(project, i)}>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-0">
                      <div className="text-sm text-gray-900">{project}</div>
                    </div>
                  </div>
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.created}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.updated}</td> */}
              </tr>
            ))}
          </tbody>
          )}
      </table>
    </>
  );
}
