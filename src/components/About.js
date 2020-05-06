import React from "react";
import Modal from "@material-ui/core/Modal";
import InfoIcon from "@material-ui/icons/Info";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 720,
    backgroundColor: theme.palette.background.paper,
    border: "1px solid rgba(0, 0, 0, 0.2)",
    // boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: "6px",
  },
  image: {
    borderRadius: "50%",
    marginTop: "55px",
    marginLeft: "30px",
    border: "5px solid #0b82ff",
  },
  col_xs_6: {
    position: "relative",
    minHeight: "1px",
    paddingLeft: "15px",
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
  const [openModal, setOpenModal] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const tabOneBody = (
    <div>
      <div className={classes.col_xs_6}>
        <img
          className={classes.image}
          src={require("../assets/images/autographa_large.png")}
          alt="Autographa Logo"
          width="215"
          height="200"
        />
      </div>
      <div className={classes.col_xs_6} style={{ padding: "5px" }}>
        <h3>
          Autographa
          {/* <FormattedMessage id='app-name' /> */}
        </h3>
        <p>
          0.0.1
          {/* <FormattedMessage id='label-version' />{' '} */}
          {/* <span>{version}</span> */}
        </p>
        <p>{/* <FormattedMessage id='label-hosted-url' /> */}</p>
        <p>https://github.com/friendsofagape/autographa.git</p>
      </div>
    </div>
  );

  const tabTwoBody = (
    <div style={{ overflowY: "scroll", height: "255px" }}>
      <h4>GNU General Public License v3.0</h4>
      <p>
        Autographa Live, A Bible translation editor for everyone.
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
    <div>
      <InfoIcon onClick={handleOpenModal} />
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={classes.paper}>
          <h2 id="modal-title">About</h2>
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
        </div>
      </Modal>
    </div>
  );
};

export default About;
