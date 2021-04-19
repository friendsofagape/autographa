import React from 'react';
import PropTypes from 'prop-types';

const DragAndDrop = (props) => {
  const handleDragEnter = (e) => {
    e.preventDefault();
    // e.stopPropagation();
    console.log('handleDragEnter');
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
  };

  const handleDrop = (e) => {
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
