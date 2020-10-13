import {
  Box,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import * as React from 'react';
import { MarkdownViewer } from './MarkdownViewer';
import { CreateProjectStyles } from './useStyles/CreateProjectStyles';

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

const LicenseSelection = ({ openmdviewer, setopenmdviewer }) => {
  const classes = CreateProjectStyles();
  const [selectedLicense, setselectedLicense] = React.useState(
    licenseItems[0].id,
  );
  const [updatelicenseItems] = React.useState(licenseItems);

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
          {updatelicenseItems.map((license, index) => (
            <MenuItem value={license.id} key={license.id}>
              {license.license}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <MarkdownViewer
        openmdviewer={openmdviewer}
        setopenmdviewer={setopenmdviewer}
        selectedLicense={selectedLicense}
      />
    </>
  );
};

export default LicenseSelection;
