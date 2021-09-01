/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import ResourcesPopUp from '@/components/EditorPage/Reference/ResourcesPopUp';

import { ViewGridAddIcon } from '@heroicons/react/outline';
import { ProjectContext } from '@/components/context/ProjectContext';

export default function EditorSection({
  title,
  selectedResource,
  setReferenceResources,
  children,
  languageId,
  row,
  setLoadResource,
  loadResource,
  openResource,
  setOpenResource1,
  setOpenResource2,
  setOpenResource3,
  setOpenResource4,
  sectionNum,
  setSectionNum,
  hideAddition,
  CustomNavigation,
}) {
  const [content, setContent] = useState(true);
  const [openResourcePopUp, setOpenResourcePopUp] = useState(false);
  const {
    state: {
      // selectedFont
      fontSize,
      layout,
      openResource1,
      openResource2,
      openResource3,
      openResource4,
    },
    actions: {
      setLayout,
    },
  } = useContext(ReferenceContext);
  const {
    states: {
      scrollLock,
    },
  } = useContext(ProjectContext);

  const removeSection = () => {
    switch (row) {
      case '1':
        setOpenResource1(true);
        break;
      case '2':
        setOpenResource2(true);
        break;
      case '3':
        setOpenResource3(true);
        break;
      case '4':
        setOpenResource4(true);
        break;
      default:
        break;
    }
    // setLoadResource(false);
    if (sectionNum > 0) {
      setSectionNum(sectionNum - 1);
    }
    // if (sectionNum <= 1) {
    //   setLayout(layout - 1);
    // }
  };

  useEffect(() => {
    if (openResource1 === true && openResource2 === true) {
      if (layout > 1) { setLayout(1); }
    }
    if (openResource3 === true && openResource4 === true) {
      if (layout > 1) { setLayout(1); }
      //  else if (layout === 1) { setLayout(0); }
    }

    if (openResource1 === true && openResource2 === true
      && openResource3 === true && openResource4 === true) {
      if (layout === 1) {
        setLayout(0);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const sectionContent = () => {
    setContent(!content);
  };

  const showResourcesPanel = () => {
    setOpenResourcePopUp(true);
    setLoadResource(true);
  };

  const addRow = () => {
    if (sectionNum >= 0 && sectionNum < 2) {
      setSectionNum(sectionNum + 1);
      if (layout < 2 && layout >= 0) {
        setSectionNum(sectionNum + 1);
      }
    }
    switch (row) {
      case '1':
        setOpenResource2(false);
        break;
      case '2':
        setOpenResource1(false);
        break;
      case '3':
        setOpenResource4(false);
        break;
      case '4':
        setOpenResource3(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className={`${openResource && 'hidden'} relative first:mt-0 mt-3 pb-12 ${ sectionNum > 1 ? 'h-1/2' : 'h-full'} border bg-white border-gray-200 shadow-sm rounded-b overflow-hidden group`}>

      <div className="bg-gray-200 rounded-t text-center text-gray-600 relative overflow-hidden">
        {openResourcePopUp
          && (
            <div className="fixed z-50 ">
              <ResourcesPopUp
                column={row}
                header={title}
                languageId={languageId}
                selectedResource={selectedResource}
                setReferenceResources={setReferenceResources}
                openResourcePopUp={openResourcePopUp}
                setOpenResourcePopUp={setOpenResourcePopUp}
              />

            </div>
          )}

        <div className="bg-gray-200 z-50 rounded-t overflow-hidden">
          <div className="flex items-center">
            {scrollLock ? (
              <>
                {CustomNavigation}
                <div className="ml-4 h-4 flex justify-center items-center text-xxs uppercase tracking-wider font-bold leading-3 truncate">
                  {title}
                </div>
              </>
            )
            : (
              <div className="flex">
                <div className="py-2 uppercase tracking-wider text-xs font-semibold">
                  <div className="ml-4 h-4 flex justify-center items-center text-xxs uppercase tracking-wider font-bold leading-3 truncate">
                    {title}
                  </div>
                </div>
              </div>
              )}
            <div className="flex bg-gray-300 absolute h-full -right-0 rounded-tr invisible group-hover:visible ">
              <button onClick={showResourcesPanel} type="button">
                <img
                  src="/illustrations/settings-small.svg"
                  alt="/"
                  className="py-2 px-2"
                />
              </button>
              <button
                onClick={sectionContent}
                type="button"
              >
                <img
                  className="px-2 py-2"
                  src="/illustrations/minimize.svg"
                  alt=""
                />
              </button>
              <button type="button" onClick={removeSection}>
                <img
                  src="/illustrations/small-close-button.svg"
                  alt=""
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {
        content
        && (
          <div
            style={{ fontFamily: 'sans-serif', fontSize: `${fontSize}rem` }}
            className="prose-sm p-4 text-xl h-full overflow-y-scroll no-scrollbars"
          >
            {
              (loadResource === false)
              ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xs uppercase pb-4">Load a Module</div>
                    <button
                      type="button"
                      className="p-4 bg-gray-200 rounded-lg ring-offset-1"
                      onClick={showResourcesPanel}
                    >
                      <ViewGridAddIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )
              : children
            }
            {hideAddition && (
              <span
                tabIndex={-42}
                onClick={addRow}
                role="button"
              >
                <img
                  title="Add Section"
                  style={{ marginBottom: '0' }}
                  className="absolute bottom-0 -right-0 invisible group-hover:visible"
                  src="/illustrations/add-section.svg"
                  alt=""
                />
              </span>
            )}
          </div>
        )
      }

    </div>
  );
}

EditorSection.propTypes = {
  title: PropTypes.string,
  children: PropTypes.any,
  selectedResource: PropTypes.string,
  setReferenceResources: PropTypes.func,
  row: PropTypes.string,
  languageId: PropTypes.string,
};
