import React from 'react';
import PropTypes from 'prop-types';
// import localforage, * as localForage from 'localforage';
import { useTranslation } from 'react-i18next';
import { SnackBar } from '@/components/SnackBar';
import ConfirmationModal from '@/layouts/editor/ConfirmationModal';
import localForage from 'localforage';
import * as logger from '../../../../logger';
import TrashSvg from '@/icons/basil/Outline/Interface/Trash.svg';

const fs = window.require('fs');
const path = require('path');

function RemoveResource({ resource, selectResource, closeResourceWindow }) {
    logger.warn('removeResource.js', 'inside remove resource');
    const { t } = useTranslation();
    const [snackBar, setOpenSnackBar] = React.useState(false);
    const [snackText, setSnackText] = React.useState('');
    // eslint-disable-next-line no-unused-vars
    const [notify, setNotify] = React.useState();
    const [openModal, setOpenModal] = React.useState(false);

    // React.useEffect(() => {
    // }, []);

    const handleRemoveResourceResources = async () => {
        logger.warn('removeResource.js', 'inside removing resource call');
        localForage.getItem('userProfile').then(async (user) => {
            logger.debug('DownloadResourcePopUp.js', 'In resource download user fetch - ', user?.username);
            const newpath = localStorage.getItem('userPath');
            const folder = path.join(newpath, 'autographa', 'users', `${user?.username}`, 'resources');
            let resourceName = null;
            switch (selectResource) {
              case 'obs':
              case 'bible':
                  resourceName = resource?.projectDir;
                  break;
              case 'tn':
              case 'tw':
              case 'ta':
              case 'tq':
              case 'obs-tn':
              case 'obs-tq':
                  resourceName = resource?.projectDir;
                  break;
              default:
                  break;
            }
            await fs.rmdir(path.join(folder, resourceName), { recursive: true }, (err) => {
              if (err) {
                setOpenSnackBar(true);
                setNotify('failure');
                setSnackText('Remove Resource Failed');
                // throw new Error(`Remove Resource failed :  ${err}`);
              }
              // console.log('resource remove success');
              setOpenSnackBar(true);
              setNotify('success');
              setSnackText('Removed Resource Successfully');
              closeResourceWindow();
            });
        });
    };

    return (
      <>
        <div
          className="text-xs cursor-pointer focus:outline-none hover:"
          role="button"
          tabIndex={0}
          title="Remove Resource"
          onClick={() => setOpenModal(true)}
        >
          <TrashSvg
            fill="currentColor"
            className="w-6 h-6"
          />
        </div>

        <SnackBar
          openSnackBar={snackBar}
          snackText={snackText}
          setOpenSnackBar={setOpenSnackBar}
          setSnackText={setSnackText}
          error={notify}
        />

        <ConfirmationModal
          openModal={openModal}
          title={t('modal-title-remove-resource')}
          setOpenModal={setOpenModal}
          confirmMessage="Are you sure want to remove the resource. This action can not be reverted"
          buttonName={t('btn-replace')}
          closeModal={handleRemoveResourceResources}
        />

      </>
    );
}

RemoveResource.propTypes = {
    resource: PropTypes.object,
    selectResource: PropTypes.string,
    closeResourceWindow: PropTypes.func,
  };

export default RemoveResource;
