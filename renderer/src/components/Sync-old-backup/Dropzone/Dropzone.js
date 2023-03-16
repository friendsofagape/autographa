import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import * as logger from '../../../logger';

const DragAndDrop = (props) => {
  const handleDragEnter = (e) => {
    logger.debug('Dropzone.js', 'calling handleDragEnter event');
    e.preventDefault();
    // e.stopPropagation();
    logger.info('Dropzone.js', 'handleDragEnter');
  };
  const handleDragLeave = (e) => {
    logger.debug('Dropzone.js', 'calling handleDragLeave event');
    e.preventDefault();
    // e.stopPropagation();
    logger.info('Dropzone.js', 'handleDragLeave');
  };
  const handleDragOver = (e) => {
    logger.debug('Dropzone.js', 'calling handleDragOver event');
    e.preventDefault();
    // e.stopPropagation();
    logger.info('Dropzone.js', 'handleDragOver');
  };

  const handleDrop = (e) => {
    logger.debug('Dropzone.js', 'calling handleDrop event');
    e.preventDefault();
    // e.stopPropagation();
    logger.info('handleDrop', props);
    // eslint-disable-next-line react/destructuring-assignment
    props.dropped(true);
  };
  const { t } = useTranslation();
  return (
    <div
      onDrop={(e) => handleDrop(e)}
      onDragOver={(e) => handleDragOver(e)}
      onDragEnter={(e) => handleDragEnter(e)}
      onDragLeave={(e) => handleDragLeave(e)}
      className="flex flex-col h-96 m-5 justify-center items-center border-2 border-dashed rounded"
    >
      <p className="uppercase text-primary">{t('label-drop-file-upload')}</p>
    </div>
  );
};
export default DragAndDrop;
DragAndDrop.propTypes = {
  /** State which triggers Drop. */
  dropped: PropTypes.bool,
};
