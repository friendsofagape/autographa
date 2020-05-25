import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  expandPanel: {
    width: "200px",
    textAlign: "center",
    float: "left",
    margin: "2px 1px 2px 1px",
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={2}>
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
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const ImportReport = (props) => {
  // console.log("import Report", props, props.show);
  const classes = useStyles();
  const [open, setOpen] = React.useState(props.show);
  const [value, setValue] = React.useState(0);
  const [successFile, setSuccessFile] = React.useState(["sf1", "sf2", "sf3"]);
  const [warningFile, setWarningFile] = React.useState(["wf1", "wf2"]);
  const [errorFile, setErrorFile] = React.useState(["EF1", "EF2", "EF3"]);
  const totalFiles = successFile.length + warningFile.length + errorFile.length;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Dialog
        onClose={props.importClose}
        aria-labelledby="customized-dialog-title"
        open={props.show}
      >
        <DialogTitle id="customized-dialog-title" onClose={props.importClose}>
          Import Report
        </DialogTitle>
        <MuiDialogContent>
          <AppBar position="static">
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="simple tabs example"
            >
              <Tab
                label={
                  "Successfully Imported (" +
                  (successFile.length + warningFile.length) +
                  "/" +
                  totalFiles +
                  ")"
                }
                {...a11yProps(0)}
              />
              <Tab
                label={
                  "Failed Import (" + errorFile.length + "/" + totalFiles + ")"
                }
                {...a11yProps(1)}
              />
            </Tabs>
          </AppBar>
          <Typography>
            <TabPanel value={value} index={0}>
              {successFile.map((success, key) => (
                <div id={key} key={key} className={classes.expandPanel}>
                  <ExpansionPanelSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    style={{ backgroundColor: "lightgreen" }}
                  >
                    <Typography>{success}</Typography>
                  </ExpansionPanelSummary>
                </div>
              ))}
              {warningFile.map((_warning, key) => (
                <div id={key} key={key} className={classes.expandPanel}>
                  <ExpansionPanel>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      style={{ backgroundColor: "yellow" }}
                    >
                      <Typography>{_warning}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Typography>warningFile</Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </div>
              ))}
            </TabPanel>
            <TabPanel value={value} index={1}>
              {errorFile.map((error, key) => (
                <div id={key} key={key} className={classes.expandPanel}>
                  <ExpansionPanel>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      style={{ backgroundColor: "red" }}
                    >
                      <Typography>{error}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Typography>Error File</Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </div>
              ))}
            </TabPanel>
          </Typography>
        </MuiDialogContent>
      </Dialog>
    </div>
  );
};
export default ImportReport;
