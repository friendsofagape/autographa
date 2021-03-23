import React, { useEffect } from 'react';
import {
  Grid,
  Box,
  MenuItem,
  FormControl,
  Select,
  FormLabel,
  IconButton,
  Button,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import * as localForage from 'localforage';
import DrawerMenu from '../../ApplicationBar/DrawerMenu';
import { CreateProjectStyles } from './useStyles/CreateProjectStyles';
import { AllBooks, NT, OT } from '../../../lib/CanonSpecification';
import CustomSpecification from './CustomSpecification';
import { LicenseSelection } from './LicenseSelection';
import * as logger from '../../../logger';
import { ProjectContext } from '../ProjectsContext/ProjectContext';

const canonItems = [
  { id: 'OT', spec: 'Old Testament (OT)' },
  { id: 'NT', spec: 'New Testament (NT)' },
  { id: 'DC', spec: 'Deutro Canon' },
  { id: 'OTDC', spec: 'OT Deutro Canon' },
];
const AdvancedSetttings = () => {
  const classes = CreateProjectStyles();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [eventName, setEventname] = React.useState('');
  const [updateCanonItems, setUpdateCanonItems] = React.useState(canonItems);
  const [openmdviewer, setopenmdviewer] = React.useState(false);
  const {
    states: {
      content,
      canonSpecification,
      versificationScheme,
    },
    actions: {
      setContent,
      setcanonSpecification,
      setVersificationScheme,
    },
} = React.useContext(ProjectContext);

  useEffect(() => {
    logger.debug('advancesettings.js', 'set content to OT on mount');
    setContent(OT);
  }, []);

  useEffect(() => {
    localForage.getItem('custonSpec', (err, value) => {
      let custonspec;
      let duplicate = false;
      if (value !== null) {
        value.forEach((fields) => {
          updateCanonItems.forEach((element) => {
            if (element.spec.includes(fields.id) === true) {
              duplicate = true;
            }
          });
          if (duplicate === false) {
            custonspec = { id: fields.id, spec: fields.id };
            updateCanonItems.push(custonspec);
            setUpdateCanonItems(updateCanonItems);
            logger.debug(
              'customspecification.js',
              'updated customSpec and canonItems on component mount',
            );
          }
        });
      }
    });
    // eslint-disable-next-line
  },[])

  const changeCanonSpecification = (event) => {
    logger.debug(
      'advancesettings.js',
      `calling changeCanonSpecification event with value=${event.target.value}`,
    );
    setcanonSpecification(event.target.value);
    switch (event.target.value.toString()) {
      case 'OT':
        setContent(OT);
        break;
      case 'NT':
        setContent(NT);
        break;
      default:
        localForage.getItem('custonSpec', (err, value) => {
          if (value) {
            value.forEach((item) => {
              if (item.id === event.target.value) {
                setContent(item.books);
              }
            });
          }
        });
        return null;
    }
    return null;
  };

  const setDrawerEvent = (e, value, eventname) => {
    e.preventDefault();
    setDrawerOpen(value);
    setEventname(eventname);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <form noValidate autoComplete="off">
            <div>
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  <Box fontWeight={600} m={1}>
                    Versification Scheme
                  </Box>
                </FormLabel>
                <Select
                  className={classes.biblename}
                  value={versificationScheme}
                  onChange={(e) => setVersificationScheme(e.target.value)}
                  variant="outlined"
                >
                  <MenuItem value="kjv">
                    King James Version (KJV)
                  </MenuItem>
                  <MenuItem value="niv">
                    New Internation Version (NIV)
                  </MenuItem>
                </Select>
              </FormControl>
              <div>
                <FormControl component="fieldset">
                  <FormLabel component="legend">
                    <Box fontWeight={600} m={1}>
                      Canon Specifications
                    </Box>
                  </FormLabel>
                  <span>
                    <Select
                      className={classes.biblename}
                      value={canonSpecification}
                      onChange={(event) => changeCanonSpecification(event)}
                      variant="outlined"
                    >
                      {updateCanonItems.map((value) => (
                        <MenuItem key={value.id} value={value.id}>
                          {value.spec}
                        </MenuItem>
                    ))}
                    </Select>
                  </span>
                  <span>
                    <IconButton>
                      <AddCircleIcon onClick={(e) => { setDrawerEvent(e, true, 'canondisplay'); }} />
                    </IconButton>
                    <IconButton>
                      <EditIcon onClick={(e) => { setDrawerEvent(e, true, 'canonedit'); }} />
                    </IconButton>
                  </span>
                </FormControl>
              </div>
              <span>
                <FormControl component="fieldset">
                  <DrawerMenu
                    open={drawerOpen}
                    classes={classes}
                    direction="right"
                  >
                    {
                    eventName === 'canondisplay' && (
                      <div
                        style={{ width: '600px', marginTop: '100px', marginLeft: 20 }}
                      >
                        {content.map((bookname) => (
                          <MenuItem value={bookname} key={bookname}>
                            {bookname}
                          </MenuItem>
                      ))}
                        <div>
                          <Button
                            className={classes.save}
                            variant="contained"
                            color="secondary"
                            data-testid="submit-button"
                            type="submit"
                            onClick={(e) => setDrawerEvent(e, false)}
                          >
                            cancel
                          </Button>
                          <Button
                            className={classes.save}
                            variant="contained"
                            color="primary"
                            data-testid="submit-button"
                            type="submit"
                            onClick={(e) => setDrawerEvent(e, false)}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    )
                  }

                  </DrawerMenu>
                </FormControl>
              </span>
              <div>
                <LicenseSelection
                  openmdviewer={openmdviewer}
                  setopenmdviewer={setopenmdviewer}
                />
              </div>
            </div>
          </form>
        </Grid>
      </Grid>
      <DrawerMenu
        open={drawerOpen}
        classes={classes}
        direction="right"
      >
        {
        eventName === 'canonedit' && (
        <CustomSpecification
          opencustom={drawerOpen}
          setCustonOpen={setDrawerEvent}
          allbooks={AllBooks}
          setContent={setContent}
          canonSpecification={canonSpecification}
          updateCanonItems={updateCanonItems}
          setUpdateCanonItems={setUpdateCanonItems}
          setcanonSpecification={setcanonSpecification}
        />
        )
      }
      </DrawerMenu>
    </>
  );
};
export default AdvancedSetttings;
