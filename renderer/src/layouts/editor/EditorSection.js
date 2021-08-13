import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import ResourcesPopUp from '@/components/EditorPage/Reference/ResourcesPopUp';
import BibleNavigation from '@/modules/biblenavigation/BibleNavigation';

import { ViewGridAddIcon } from '@heroicons/react/outline';

export default function EditorSection({
  title,
  selectedResource,
  setReferenceResources,
  children,
  languageId,
  column,
  sectionNum,
  setLoadResource,
  loadResource,
  openResource,
  setOpenResource,
}) {
  const [content, setContent] = useState(true);

  const {
    state: {
      // selectedFont
      fontSize,
      row,
      layout,
    },
    actions: {
      setRow,
    },
  } = useContext(ReferenceContext);

  const [openResourcePopUp, setOpenResourcePopUp] = useState(false);

  const removeSection = () => {
    setOpenResource(!openResource);
    setLoadResource(false);
  };

  const sectionContent = () => {
    setContent(!content);
  };

  const showResourcesPanel = () => {
    setOpenResourcePopUp(true);
    setLoadResource(true);
  };

  const addRow = () => {
    if (row <= 0 && layout === 2) {
      setRow(row + 1);
    }
    if (row >= 1 && row < 2 && layout >= 2) {
      setRow(row + 1);
    }
  };

  return (
    <div className={`${openResource && 'hidden'} relative first:mt-0 mt-3 pb-12 h-1/2 border bg-white border-gray-200 shadow-sm rounded-b overflow-hidden group`}>

      <div className="bg-gray-200 rounded-t text-center text-gray-600 relative overflow-hidden">
        {openResourcePopUp

          && (
            <div className="fixed z-50 ">

              <ResourcesPopUp
                column={column}
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
            <BibleNavigation />
            <div className="ml-4 h-4 flex justify-center items-center text-xxs uppercase tracking-wider font-bold leading-3 truncate">
              {title}
            </div>
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
  column: PropTypes.string,
  languageId: PropTypes.string,
};
