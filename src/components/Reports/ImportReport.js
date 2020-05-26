import React, { useEffect } from "react";
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
import * as mobx from "mobx";
import AutographaStore from "../AutographaStore";
import * as numberFormat from "../../core/FormatNumber";

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
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const successFiles = mobx.toJS(AutographaStore.successFile);
  const [warningFile, setWarningFile] = React.useState([]);
  const [errorFile, setErrorFile] = React.useState([]);

  const handleWarning = () => {
    const warningFiles = mobx.toJS(AutographaStore.warningMsg);
    let objWarnArray = [];
    let preValue = undefined;
    let book = "";
    let chapters = [];
    warningFiles.map((value) => {
      if (value[0] !== preValue) {
        if (value[0] !== preValue && preValue !== undefined) {
          const obj = { filename: book, chapter: chapters };
          objWarnArray.push(obj);
          book = "";
          chapters = [];
        }
        book = value[0];
        chapters.push(value[1]);
        preValue = value[0];
      } else {
        chapters.push(value[1]);
      }
    });
    if (book !== "" && chapters.length !== 0) {
      const obj = { filename: book, chapter: chapters };
      objWarnArray.push(obj);
    }
    let finalWarnArray = Array.from(new Set(objWarnArray));
    setWarningFile(finalWarnArray);
  };

  const handleError = () => {
    // var errorpath = `${appPath}/report/error${date.getDate()}${
    //   date.getMonth() + 1
    // }${date.getFullYear()}.log`;
    const errorFiles = mobx.toJS(AutographaStore.errorFile);
    let objErrArray = [];
    errorFiles.map((value) => {
      // fs.appendFile(errorpath, value + "\n", (value) => {
      //   if (value) {
      //   } else {
      //     console.log("succesfully created error.log file");
      //   }
      // });
      let file = value.toString().replace("Error:", "");
      file = file.toString().trim();
      let err = file.split(/ +/);
      const obj = { filename: err[0], error: err[1] };
      objErrArray.push(obj);
    });
    setErrorFile(objErrArray);
  };

  useEffect(() => {
    if (props.show) {
      handleWarning();
      handleError();
    }
  }, [props.show]);
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
                  (successFiles.length + warningFile.length) +
                  "/" +
                  (successFiles.length +
                    warningFile.length +
                    errorFile.length) +
                  ")"
                }
                {...a11yProps(0)}
              />
              <Tab
                label={
                  "Failed Import (" +
                  errorFile.length +
                  "/" +
                  (successFiles.length +
                    warningFile.length +
                    errorFile.length) +
                  ")"
                }
                {...a11yProps(1)}
              />
            </Tabs>
          </AppBar>
          <Typography>
            <TabPanel value={value} index={0}>
              {successFiles.map((success, key) => (
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
              {warningFile.map((warning, key) => (
                <div id={key} key={key} className={classes.expandPanel}>
                  <ExpansionPanel>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      style={{ backgroundColor: "yellow" }}
                    >
                      <Typography>{warning.filename}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Typography>
                        Chapter {numberFormat.FormatNumber(warning.chapter)}{" "}
                        missing
                      </Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </div>
              ))}
            </TabPanel>
            <TabPanel value={value} index={1}>
              {errorFile.map((error, key) => (
                <div className={classes.expandPanel}>
                  <ExpansionPanel>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      style={{ backgroundColor: "red" }}
                    >
                      <Typography>{error.filename}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Typography>ID is missing</Typography>
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
