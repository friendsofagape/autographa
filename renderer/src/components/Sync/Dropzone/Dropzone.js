/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import * as logger from '../../../logger';

const DragAndDrop = (props) => {
  const handleDragEnter = (e) => {
    logger.debug('Dropzone.js', 'calling handleDragEnter event');
    e.preventDefault();
    // e.stopPropagation();
    console.log('handleDragEnter');
  };
  const handleDragLeave = (e) => {
    logger.debug('Dropzone.js', 'calling handleDragLeave event');
    e.preventDefault();
    // e.stopPropagation();
    console.log('handleDragLeave');
  };
  const handleDragOver = (e) => {
    logger.debug('Dropzone.js', 'calling handleDragOver event');
    e.preventDefault();
    // e.stopPropagation();
    console.log('handleDragOver');
  };

  const handleDrop = (e) => {
    logger.debug('Dropzone.js', 'calling handleDrop event');
    e.preventDefault();
    // e.stopPropagation();
    console.log('handleDrop', props);
    props.dropped(true);
  };
  return (
    <div
      onDrop={(e) => handleDrop(e)}
      onDragOver={(e) => handleDragOver(e)}
      onDragEnter={(e) => handleDragEnter(e)}
      onDragLeave={(e) => handleDragLeave(e)}
    >
      <p>Drop files here to upload</p>
    </div>
  );
};
export default DragAndDrop;
DragAndDrop.propTypes = {
  /** State which triggers Drop. */
  dropped: PropTypes.bool,
};
