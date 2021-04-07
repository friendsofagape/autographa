import React from 'react';
import PropTypes from 'prop-types';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import {
 Typography, Paper, AppBar, Tabs, Tab, Box, Divider,
 Grid, List, ListItem, ListItemText, ListItemIcon, Stepper, StepButton,
} from '@material-ui/core';
import FolderOpenOutlinedIcon from '@material-ui/icons/FolderOpenOutlined';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';

import SyncOutlinedIcon from '@material-ui/icons/SyncOutlined';
// import Gitea from "./Gitea/Gitea";
import { GitHub } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  mainPaper: {
    height: '100vh',
    width: '100vw',
    paddingLeft: '12%',
  },
  paper: {
    height: '100vh',
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
  },
  column: {
    flexBasis: '33.33%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function Sync(props) {
  const classes = useStyles();
  const theme = useTheme();
  const ag = props;
  const [value, setValue] = React.useState(0);
  const [index, setIndex] = React.useState(-1);
  const [activeStep, setActiveStep] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleProjects = (indexValue) => {
    setIndex(indexValue);
    setActiveStep(1);
  };
  const handleStep = (step) => () => {
    setActiveStep(step);
    setIndex();
  };
  return (
    <>
      <Paper className={classes.mainPaper}>
        <Grid container justify="center" spacing={1}>
          <Grid key={1} style={{ width: '50%' }} item>
            <Paper className={classes.paper}>
              <AppBar position="static" color="default">
                <h1>Sync</h1>
              </AppBar>
              <div className={classes.column}>
                <Stepper nonLinear activeStep={activeStep}>
                  <StepButton onClick={handleStep(0)}>
                    Autographa Projects
                  </StepButton>
                  <StepButton>
                    {ag.projects[index]?.project}
                  </StepButton>
                </Stepper>
              </div>
              <Divider />
              {ag.projects.map((project, key) => (
                <List
                  id="project-id"
                  key={`list${ project.project}`}
                  component="nav"
                  className={classes.root}
                  aria-label="mailbox folders"
                  style={{ display: (activeStep === 1 ? 'none' : '') }}
                >
                  <ListItem
                    button
                    divider
                    key={project.project}
                    onClick={() => handleProjects(key)}
                  >
                    <ListItemIcon>
                      <FolderOpenOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary={project.project} />
                  </ListItem>
                </List>
                ))}
              <Typography variant="caption">
                {index !== -1 && ag.projects[index] !== undefined ? (
                    ag.projects[index].files.map((val, i) => (
                      <List component="nav" className={classes.root} aria-label="mailbox folders">
                        <ListItem button divider key={val[i]}>
                          <ListItemIcon>
                            <InsertDriveFileOutlinedIcon />
                          </ListItemIcon>
                          <ListItemText primary={val} />
                        </ListItem>
                      </List>
                    ))
                  ) : (
                    <div />
                  )}
              </Typography>
            </Paper>
          </Grid>
          <Grid key={2} style={{ width: '50%' }} item>
            <Paper className={classes.paper}>
              <AppBar position="static" color="default">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  scrollButtons="auto"
                  variant="scrollable"
                >
                  <Tab label="Github" icon={<GitHub />} {...a11yProps(0)} />
                  <Tab
                    label="Paratext"
                    icon={<SyncOutlinedIcon />}
                    {...a11yProps(1)}
                  />
                  <Tab
                    label="Gitea"
                    icon={<SyncOutlinedIcon />}
                    {...a11yProps(2)}
                  />
                </Tabs>
              </AppBar>
              <TabPanel value={value} index={0} dir={theme.direction}>
                Github
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                Paratext
              </TabPanel>
              <TabPanel value={value} index={2} dir={theme.direction}>
                Gitea
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
