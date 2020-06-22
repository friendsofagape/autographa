import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { IconButton } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import SignIn from "./SignIn";
import { AutographaStore } from "../AutographaStore";
import GetProjects from "./GetProjects";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
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
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}
const Sync = () => {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const [callList, setCallList] = useState(false);
  const [error, setError] = useState("");
  const [paratext, setParatext] = React.useState({});

  const handleTabChange = (event, newValue) => {
    loadAuthentication(newValue);
    setTabValue(newValue);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setParatext({});
    setCallList(false);
    setOpen(false);
  };
  const loadAuthentication = (value) => {
    console.log(
      "loadAuthentication",
      AutographaStore.paraUsername,
      AutographaStore.paraPassword
    );
    if (AutographaStore.paraUsername && AutographaStore.paraPassword) {
      setParatext({
        username: AutographaStore.paraUsername,
        password: AutographaStore.paraPassword,
        syncProvider: "paratext",
      });
      setCallList(true);
    }
    console.log(value);
  };
  const handleError = (formData) => {
    console.log(formData);
    if (formData.username === null || formData.username === "") {
      console.log("formData.username");
      setError("Enter Username");
      return false;
    } else if (formData.password === null || formData.password === "") {
      console.log("formData.password");
      setError("Enter Password");
      return false;
    } else {
      return true;
    }
    // messages:{
    //     actionText = 'Login',
    //     genericError = 'Something went wrong, please try again.',
    //     usernameError = 'Username does not exist.',
    //     passwordError = 'Password is invalid.',
    //     networkError = 'There is an issue with your network connection. Please try again.',
    //     serverError = 'There is an issue with the server please try again.',
    //   }
  };
  const onSubmit = (formData) => {
    if (!handleError(formData)) return;
    console.log(formData);
    console.log("callList", callList);
    setParatext(formData);
    setCallList(true);
  };
  console.log(tabValue, tabValue === 0 ? "paratext" : "gitea");
  return (
    <div>
      <IconButton onClick={handleOpen}>
        <img alt="" src={require("../../assets/icons/sync.svg")} />
      </IconButton>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        onEntered={loadAuthentication(tabValue)}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Sync
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            <Tabs
              style={{ borderBottom: "1px solid #0b82ff" }}
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Paratext" {...a11yProps(0)} />

              <Tab label="Gitea" {...a11yProps(0)} />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
              <SignIn
                syncProvider={"paratext"}
                handleSubmit={onSubmit}
                error={error}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <SignIn syncProvider={"gitea"} />
            </TabPanel>
            {/* <SignIn syncProvider={tabValue === 0 ? "paratext" : "gitea"} /> */}
            {callList === true ? (
              <GetProjects
                syncProvider={paratext.syncProvider}
                username={paratext.username}
                password={paratext.password}
                start={callList}
              />
            ) : null}
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Sync;
