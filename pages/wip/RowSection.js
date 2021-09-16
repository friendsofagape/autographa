/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import Image from 'next/image';

import PropTypes from 'prop-types';
import { ViewGridAddIcon } from '@heroicons/react/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ColumnOne(props) {
  const {
    children,
    rowCount,
    ishidden,
    expandRow,
    isExpand,
    addRow,
    removeRow,
  } = props;

  return (
    <>
      <div className={classNames(!ishidden ? 'hidden' : '', 'relative first:mt-0 pb-12 border bg-white border-gray-200 rounded shadow-sm overflow-hidden group')}>

        <div className="bg-gray-200 rounded-t text-center text-gray-600 relative overflow-hidden">
          <div className="bg-gray-200 z-50 rounded-t overflow-hidden">
            <div className="flex items-center">
              <div className="ml-4 h-8 flex justify-center items-center text-xxs uppercase tracking-wider font-bold leading-3 truncate">
                Bible
              </div>

              <div className="flex bg-gray-300 absolute h-full -right-0 rounded-tr invisible group-hover:visible">
                <button type="button">
                  <img
                    src="/illustrations/settings-small.svg"
                    alt="/"
                    className="py-2 px-4"
                  />
                </button>

                <button
                  type="button"
                  onClick={expandRow}
                >
                  <img
                    className="px-2 py-2"
                    src="/illustrations/minimize.svg"
                    alt=""
                  />
                </button>

                <button
                  type="button"
                  onClick={removeRow}
                >
                  <img
                    className="px-2 py-0"
                    src="/illustrations/small-close-button.svg"
                    alt=""
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="prose-sm p-4 text-xl h-full overflow-y-scroll no-scrollbars">

          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs uppercase pb-4">
                Load a Module
                {rowCount}
              </div>
              <button
                type="button"
                className="p-4 bg-gray-200 rounded-lg ring-offset-1"
              >
                <ViewGridAddIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

        </div>

        <button
          type="button"
          onClick={addRow}
          className="h-10 w-10 absolute bottom-0 -right-0 invisible group-hover:visible group-last:hidden"
        >
          <Image
            title="Add Section"
            src="/illustrations/add-section.svg"
            alt=""
            layout="fill"
          />
        </button>

      </div>
    </>
  );
}

ColumnOne.propTypes = {
  children: PropTypes.array,
  rowCount: PropTypes.string,
  ishidden: PropTypes.bool,
  expandRow: PropTypes.func,
  addRow: PropTypes.func,
  removeRow: PropTypes.func,
};