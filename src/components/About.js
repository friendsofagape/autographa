import React from "react";
import InfoIcon from "@material-ui/icons/Info";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import { Observer } from "mobx-react";
import AutographaStore from "./AutographaStore";
import { IconButton } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { version } from "../../package.json";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => ({
  image: {
    borderRadius: "50%",
    border: "5px solid #0b82ff",
  },
  col_xs_6: {
    position: "relative",
    minHeight: "1px",
    paddingRight: "15px",
    float: "left",
  },
}));

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

const About = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const tabOneBody = (
    <div>
      <div className={classes.col_xs_6}>
        <img
          className={classes.image}
          src={require("../assets/images/autographa_large.png")}
          alt="Autographa Logo"
          width="175"
          height="180"
        />
      </div>
      <div style={{ padding: "5px", width: "550px" }}>
        <h3>
          <FormattedMessage id="app-name" />
        </h3>
        <p>
          <FormattedMessage id="label-version" /> <span>{version}</span>
        </p>
        <p>
          <FormattedMessage id="label-hosted-url" />
          <p>https://github.com/friendsofagape/autographa.git</p>
        </p>
      </div>
    </div>
  );

  const tabTwoBody = (
    <div style={{ overflowY: "scroll", height: "255px" }}>
      <h4>GNU General Public License v3.0</h4>
      <p>
        Autographa, A Bible translation editor for everyone.
        <br />
        Copyright (C) 2019 Friends of Agape
      </p>
      <p>
        This program is free software: you can redistribute it and/or modify it
        under the terms of the GNU General Public License as published by the
        Free Software Foundation, either version 3 of the License, or (at your
        option) any later version.
      </p>
      <p>
        This program is distributed in the hope that it will be useful, but
        WITHOUT ANY WARRANTY; without even the implied warranty of
        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
        Public License for more details.
      </p>
      <p>see https://www.gnu.org/licenses/.</p>
      <p>You may contact us via issues on GitHub.</p>
    </div>
  );

  return (
    <Observer>
      {() => (
        <React.Fragment>
          <div>
            <IconButton
              color="inherit"
              disabled={AutographaStore.toggle}
              onClick={handleOpen}
            >
              <InfoIcon />
            </IconButton>
            <Dialog
              onClose={handleClose}
              aria-labelledby="customized-dialog-title"
              open={open}
            >
              <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                <FormattedMessage id="tooltip-about" />
              </DialogTitle>
              <DialogContent>
                <Tabs
                  style={{ borderBottom: "1px solid #0b82ff" }}
                  value={tabValue}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  centered
                >
                  <Tab label="Overview" {...a11yProps(0)} />

                  <Tab label="License" {...a11yProps(0)} />
                </Tabs>
                <TabPanel value={tabValue} index={0}>
                  {tabOneBody}
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  {tabTwoBody}
                </TabPanel>
              </DialogContent>
            </Dialog>
          </div>
        </React.Fragment>
      )}
    </Observer>
  );
};

export default About;
