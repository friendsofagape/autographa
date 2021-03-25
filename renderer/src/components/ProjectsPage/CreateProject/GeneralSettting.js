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
  TextField, Button, IconButton,
} from '@material-ui/core';
import clsx from 'clsx';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { CreateProjectStyles } from './useStyles/CreateProjectStyles';
// import useValidator from '../../Validation/useValidator';
import DrawerMenu from '../../ApplicationBar/DrawerMenu';
import { ProjectContext } from '../ProjectsContext/ProjectContext';
import { AutoCompleteSearch } from '../../AutoCompleteSearch/AutoCompleteSearch';

const version = [
  'IRV',
  'NLT',
  'UDB',
  'ULB',
  'UJNT',
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
  const {
   states: {
    drawer,
    selectedVersion,
    newProjectFields,
   }, actions: {
    setDrawer,
    setSelectedVersion,
    handleProjectFields,
   },
  } = React.useContext(ProjectContext);
  // validation custom hook
  // const {
  //   state: { errors }, action: { handleFields },
  // } = useValidator();

  const openDrawer = (status) => {
    setDrawer(status);
  };
  const TargetLanguageTab = (
    <div style={{ width: '600px', marginTop: '100px', marginLeft: 20 }}>
      <FormControl component="fieldset">
        <FormLabel component="legend">
          <Box fontWeight={600} m={1}>
            Target Language
          </Box>
        </FormLabel>
        <div>
          <TextField
            className={classes.biblename}
            variant="outlined"
            name="namefield"
            value={newProjectFields.language}
            // helperText={errors.namefield}
            onChange={
                handleProjectFields('language')
            }
          />
        </div>
        <div>
          <FormLabel component="legend">
            <Box fontWeight={600} m={1}>
              Script Direction
            </Box>
          </FormLabel>
          <RadioGroup
            style={{ display: 'inline', marginLeft: '12px' }}
            defaultValue={newProjectFields.scriptDirection}
            aria-label="direction"
            name="customized-radios"
            onClick={handleProjectFields('scriptDirection')}
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
          <div>
            <Button
              className={classes.save}
              variant="contained"
              color="secondary"
              data-testid="submit-button"
              type="submit"
              onClick={() => setDrawer(false)}
            >
              cancel
            </Button>
            <Button
              className={classes.save}
              variant="contained"
              color="primary"
              data-testid="submit-button"
              type="submit"
            >
              Save
            </Button>
          </div>
        </div>
      </FormControl>
    </div>
  );
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={11}>
          <DrawerMenu
            classes={classes}
            direction="right"
            open={drawer}
          >
            {TargetLanguageTab}
          </DrawerMenu>
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
              <div>
                <FormControl component="fieldset">
                  <FormLabel component="legend">
                    <Box fontWeight={600} m={1}>
                      Project Name
                    </Box>
                  </FormLabel>
                  <div>
                    <TextField
                      className={classes.biblename}
                      variant="outlined"
                      name="namefield"
                      required
                      placeholder="Enter Bible Name"
                      value={newProjectFields.projectName}
                      // helperText={errors.namefield}
                      onChange={handleProjectFields('projectName')}
                    />
                  </div>
                </FormControl>
              </div>
              <span>
                <FormControl component="fieldset">
                  <FormLabel component="legend">
                    <Box fontWeight={600} m={1}>
                      Bible Version
                    </Box>
                  </FormLabel>
                  <div>
                    <FormControl
                      variant="outlined"
                      className={classes.autocomplete}
                    >
                      <AutoCompleteSearch
                        id="Version"
                        listarray={version}
                        selectedValue={selectedVersion}
                        setSelectedValue={setSelectedVersion}
                      />
                    </FormControl>
                  </div>
                </FormControl>
              </span>

              <div>
                <FormControl component="fieldset">
                  <FormLabel component="legend">
                    <Box fontWeight={600} m={1}>
                      Target Language
                    </Box>
                  </FormLabel>
                  <div>
                    <span>
                      <TextField
                        className={classes.biblename}
                        variant="outlined"
                        name="namefield"
                        placeholder="Enter Bible Name"
                        value={newProjectFields.language}
                      />
                      <IconButton>
                        <AddCircleIcon onClick={() => { openDrawer(true); }} />
                      </IconButton>
                    </span>
                  </div>
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
