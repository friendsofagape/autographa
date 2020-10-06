import React from "react";
import PropTypes from "prop-types";
import { withStyles, useTheme } from "@material-ui/core/styles";
import classNames from "classnames";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import FolderOpenOutlinedIcon from "@material-ui/icons/FolderOpenOutlined";
import InsertDriveFileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import SyncOutlinedIcon from "@material-ui/icons/SyncOutlined";
import Gitea from "./Gitea/Gitea";
import { GitHub } from "@material-ui/icons";
const styles = (theme) => ({
  root: {
    width: "100%",
    scroll: "paper",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: "bottom",
    height: 20,
    width: 20,
  },
  details: {
    alignItems: "center",
  },
  column: {
    flexBasis: "50%",
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
});
function TabPanel(props) {
  const { children, value, index, ...other } = props;

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
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

function Sync(props) {
  const { classes } = props;
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [index, setIndex] = React.useState(-1);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleProjects = (index) => {
    console.log("index", index);
    setIndex(index);
  };
  return (
    <div className={classes.root}>
      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary>
          <div className={classes.column}>
            <Typography variant="h5">Autographa Projects</Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <div
            className={classes.column}
            inputProps={{
              "data-testid": "autographa-projects",
            }}
          >
            {props.projects.map((value, index) => (
              <div>
                <Button
                  inputProps={{
                    "data-testid": "ag-project",
                  }}
                  id="project-id"
                  key={index}
                  onClick={(event) => handleProjects(index)}
                  startIcon={<FolderOpenOutlinedIcon />}
                >
                  {value.project}
                </Button>
              </div>
            ))}
          </div>

          <div className={classNames(classes.column, classes.helper)}>
            <Typography variant="caption">
              {index !== -1 && props.projects[index] !== undefined ? (
                props.projects[index].files.map((value, index) => (
                  <div>
                    <Button
                      id="file-id"
                      key={index}
                      startIcon={<InsertDriveFileOutlinedIcon />}
                    >
                      {value}
                    </Button>
                  </div>
                ))
              ) : (
                <div />
              )}
            </Typography>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <div className={classes.root}>
        <Paper>
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Github" icon={<GitHub />} {...a11yProps(0)}></Tab>
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
            <Gitea />
          </TabPanel>
        </Paper>
      </div>
    </div>
  );
}

Sync.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Sync);
