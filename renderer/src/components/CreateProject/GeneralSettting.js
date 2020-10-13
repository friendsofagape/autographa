import React from 'react';
import {
  Grid,
  Box,
  MenuItem,
  FormControl,
  Select,
  Radio,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  TextField,
} from '@material-ui/core';
import clsx from 'clsx';
import { CreateProjectStyles } from './useStyles/CreateProjectStyles';
import { AutoComplete } from './AutoComplete';
import useUpdateValidator from '../Validation/useUpdatevalidator';

const version = [
  { id: 1, value: 'IRV' },
  { id: 2, value: 'NLT' },
  { id: 3, value: 'UDB' },
  { id: 4, value: 'ULB' },
  { id: 5, value: 'UJNT' },
];

function StyledRadio(props) {
  const classes = CreateProjectStyles();

  return (
    <Radio
      className={classes.radioroot}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  );
}

const GeneralSettting = () => {
  const classes = CreateProjectStyles();
  const [biblename, setBiblename] = React.useState('');
  const { errors, handleChangeFields } = useUpdateValidator();
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={11}>
          <form noValidate autoComplete="off">
            <div>
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  <Box fontWeight={600} m={1}>
                    Type
                  </Box>
                </FormLabel>
                <Select
                  className={classes.biblename}
                  value="bi"
                  variant="outlined"
                >
                  <MenuItem value="md">MdFile</MenuItem>
                  <MenuItem value="bi">Bible</MenuItem>
                </Select>
              </FormControl>
              <span className={classes.version}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">
                    <Box fontWeight={600} m={1}>
                      Bible Name
                    </Box>
                  </FormLabel>
                  <div>
                    <TextField
                      className={classes.biblename}
                      variant="outlined"
                      name="namefield"
                      placeholder="Enter Bible Name"
                      value={biblename}
                      helperText={errors.namefield}
                      onChange={(e) => {
                        setBiblename(e.target.value);
                        handleChangeFields(e);
                      }}
                    />
                  </div>
                </FormControl>
              </span>
              <span className={classes.version}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">
                    <Box fontWeight={600} m={1}>
                      Bible Version
                    </Box>
                  </FormLabel>
                  <div>
                    <AutoComplete version={version} />
                  </div>
                </FormControl>
              </span>

              <div>
                <FormControl className={classes.direction} component="fieldset">
                  <FormLabel component="legend">
                    <Box fontWeight={600} m={1}>
                      Script Direction
                    </Box>
                  </FormLabel>
                  <RadioGroup
                    style={{ display: 'inline', marginLeft: '12px' }}
                    defaultValue="LTR"
                    aria-label="direction"
                    name="customized-radios"
                  >
                    <FormControlLabel
                      value="LTR"
                      control={<StyledRadio />}
                      label="LTR"
                    />
                    <FormControlLabel
                      value="RTL"
                      control={<StyledRadio />}
                      label="RTL"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
          </form>
        </Grid>
      </Grid>
    </>
  );
};
export default GeneralSettting;
