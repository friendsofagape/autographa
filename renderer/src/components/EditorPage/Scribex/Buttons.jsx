/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

import {
  LockClosedIcon,
  BookmarkIcon,
  CollectionIcon,
  ViewBoardsIcon,
  PencilIcon,
  SaveIcon,
} from '@heroicons/react/outline';

import { ArrowClockwise, ArrowCounterClockwise } from 'phosphor-react';

export const classNames = (...classes) => classes.filter(Boolean).join(' ');

export default function Buttons(props) {
  const [sectionable, setSectionableState] = useState(false);
  const [blockable, setBlockableState] = useState(true);
  const [editable, setEditableState] = useState(true);
  const [preview, setPreviewState] = useState(false);
  const {
    bookCode,
    undo,
    redo,
    setSectionable,
    setBlockable,
    setEditable,
    setPreview,
    exportUsfm,
  } = props;

  const onSectionable = () => {
    setSectionableState(!sectionable);
    setSectionable(!sectionable);
  };
  const onBlockable = () => {
    setBlockableState(!blockable);
    setBlockable(!blockable);
  };
  const onEditable = () => {
    setEditableState(!editable);
    setEditable(!editable);
  };
  const onPreview = () => {
    setPreviewState(!preview);
    setPreview(!preview);
  };

  return (
    <>
      <CollectionIcon
        aria-label="Collection-Icon"
        className={classNames(
        sectionable ? 'fill-current' : '',
        'h-5 w-5 text-white cursor-pointer',
        )}
        aria-hidden="true"
        onClick={onSectionable}
      />

      <PencilIcon
        aria-label="Collection-Icon"
        className={classNames(
        editable ? 'fill-current' : '',
        'h-5 w-5 text-white cursor-pointer',
        )}
        aria-hidden="true"
        onClick={onEditable}
      />

      {/* <ViewBoardsIcon
          aria-label='Block Icon'
          className='h-5 w-5 text-white cursor-pointer'
          aria-hidden='true'
          onClick={() => setBlockable(true)}
          />
          <button
          className='text-blue-700 font-semibold text-primary hover:text-white border border-blue-500 hover:border-transparent rounded'
          onClick={() => setBlockable(false)}>
          B Off
          </button> */}
      <ArrowCounterClockwise
        aria-label="Collection-Icon"
        className="h-5 w-5 text-white cursor-pointer"
        aria-hidden="true"
        onClick={() => undo()}
      />
      <ArrowClockwise
        aria-label="Collection Icon"
        className="h-5 w-5 text-white cursor-pointer"
        aria-hidden="true"
        onClick={() => redo()}
      />
      <SaveIcon
        aria-label="Save Icon"
        className="h-5 w-5 text-white cursor-pointer"
        aria-hidden="true"
        onClick={() => exportUsfm(bookCode)}
      />
    </>
  );
}
