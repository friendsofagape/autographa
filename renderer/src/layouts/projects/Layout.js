import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ImportPopUp from '@/modules/projects/ImportPopUp';
import {
  UploadIcon,
} from '@heroicons/react/outline';
import SideBar from './SideBar';
import TopMenuBar from './TopMenuBar';

export default function ProjectsLayout(props) {
  const {
    children,
    title,
    header,
    isTwoCol,
    colOne,
    colTwo,
  } = props;

  const [openPopUp, setOpenPopUp] = useState(false);

  function openImportPopUp() {
    setOpenPopUp(true);
  }

  function closeImportPopUp() {
    setOpenPopUp(false);
  }

  return (
    <div className="flex">

      <SideBar />

      <div className="w-full">

        <TopMenuBar />

        <header className="bg-white shadow">
          {!isTwoCol
            ? (
              <div className="mx-auto py-4 px-4 sm:px-4 lg:px-6 border-primary border-b-4 flex items-center justify-between">
                <div className="flex">
                  <h1 className="text-xl font-bold text-gray-900 uppercase tracking-wider">{title}</h1>
                  {header}
                </div>
                {title === 'Projects' && (
                  <>
                    <button
                      type="button"
                      className="flex text-white ml-5 font-bold text-xs px-3 py-2 rounded-full
                  leading-3 tracking-wider uppercase bg-primary items-center"
                      onClick={openImportPopUp}
                    >
                      <UploadIcon className="h-4 mr-2 text-white" />
                      import
                    </button>
                    <ImportPopUp open={openPopUp} closePopUp={closeImportPopUp} />
                  </>
                )}
              </div>
            )
            : (
              <div className="mx-auto px-4 sm:px-4 lg:px-6 border-primary border-b-4 grid grid-cols-2 gap-2">
                <div className="flex flex-row py-4 items-center">
                  <h1 className="text-xl font-bold text-gray-900 uppercase tracking-wider">{title}</h1>
                  {colOne}
                </div>
                <div className="flex items-end">
                  {colTwo}
                </div>
              </div>
            )}
        </header>

        {children}

      </div>

    </div>

  );
}

ProjectsLayout.propTypes = {
  children: PropTypes.any,
  title: PropTypes.string.isRequired,
  header: PropTypes.element,
  isTwoCol: PropTypes.bool,
  colOne: PropTypes.element,
  colTwo: PropTypes.element,
};
