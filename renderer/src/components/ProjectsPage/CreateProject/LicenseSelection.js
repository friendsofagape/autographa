/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
// @flow
import {
  Box,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import * as React from 'react';
import { MDEditor } from '../../MdEditor/MDEditor';
import { CreateProjectStyles } from './useStyles/CreateProjectStyles';
import * as logger from '../../../logger';

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
      </FormControl>
      <MDEditor
        openMDFile={openmdviewer}
        setopenMDFile={setopenmdviewer}
        mdFilePath={filePath}
      />
    </>
  );
};

LicenseSelection.propTypes = {
  openmdviewer: PropTypes.bool.isRequired,
  setopenmdviewer: PropTypes.func,
};
