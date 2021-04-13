import React from 'react';
import PropTypes from 'prop-types';

const DragAndDrop = (props) => {
  const handleDragEnter = (e) => {
    e.preventDefault();
    // e.stopPropagation();
    console.log('handleDragEnter');
    // dispatch({ type: 'AddToDropZone', inDropZone: true });
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    // e.stopPropagation();
    console.log('handleDragLeave');
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    // e.stopPropagation();
    console.log('handleDragOver');
    // dispatch({ type: 'AddToDropZone', inDropZone: true });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    // e.stopPropagation();
    console.log('handleDrop', props);
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
  /** State which triggers login. */
//   dropped: PropTypes.bool,
};
