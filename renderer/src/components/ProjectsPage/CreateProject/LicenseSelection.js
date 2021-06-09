/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
// @flow
import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  MenuItem,
  Select,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';
import * as React from 'react';
import { MDEditor } from '../../MdEditor/MDEditor';
import { CreateProjectStyles } from './useStyles/CreateProjectStyles';
import * as logger from '../../../logger';
import DrawerMenu from '../../ApplicationBar/DrawerMenu';

const licenseItems = [
  { id: 'BY', license: 'Attribution' },
  { id: 'BY_ND', license: 'Attribution-NoDerivatives' },
  { id: 'BY_NC', license: 'Attribution-NonCommercial' },
  { id: 'BY_SA', license: 'Attribution-ShareAlike' },
  { id: 'BY_NC_SA', license: 'Attribution-NonCommercial-ShareAlike' },
  { id: 'BY_NC_ND', license: 'Attribution-NonCommercial-NoDerivatives' },
  { id: 'CC0', license: 'CC0' },
  { id: 'Custom', license: 'Custom' },
];

export const LicenseSelection = ({ openmdviewer, setopenmdviewer }) => {
  const classes = CreateProjectStyles();
  const [selectedLicense, setselectedLicense] = React.useState(
    licenseItems[0].id,
  );
  const [updatelicenseItems] = React.useState(licenseItems);
  const [filePath, setFilePath] = React.useState();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  // const [eventName, setEventname] = React.useState('');

  const setDrawerEvent = (e, value) => {
    e.preventDefault();
    setDrawerOpen(value);
    // setEventname(eventname);
  };
  React.useEffect(() => {
    logger.debug(
      'markdownviewer.js', `extracting text from files ${selectedLicense} on selection`,
    );
    const licensefile = require(`../../../lib/license/${selectedLicense}.md`);
    setFilePath(licensefile.default);
  }, [setFilePath, selectedLicense]);

  const handleMdViewer = (event) => {
    setselectedLicense(event.target.value);
    setopenmdviewer(true);
  };

  return (
    <>
      <FormControl className={classes.license} component="fieldset">
        <FormLabel component="legend">
          <Box fontWeight={600} m={1}>
            License
          </Box>
        </FormLabel>
        <Select
          className={classes.licenseselect}
          variant="outlined"
          value={selectedLicense}
          onChange={(event) => handleMdViewer(event)}
        >
          {updatelicenseItems.map((license) => (
            <MenuItem value={license.id} key={license.id}>
              {license.license}
            </MenuItem>
          ))}
        </Select>
        <span>
          <IconButton>
            <EditIcon onClick={(e) => { setDrawerEvent(e, true, 'licenseedit'); }} />
          </IconButton>
        </span>
      </FormControl>
      <DrawerMenu
        open={drawerOpen}
        classes={classes}
        direction="right"
      >
        <MDEditor
          openMDFile={openmdviewer}
          setopenMDFile={setDrawerEvent}
          mdFilePath={filePath}
        />
      </DrawerMenu>
    </>
  );
};

LicenseSelection.propTypes = {
  openmdviewer: PropTypes.bool.isRequired,
  setopenmdviewer: PropTypes.func,
};
