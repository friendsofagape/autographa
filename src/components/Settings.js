import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import GetAppIcon from "@material-ui/icons/GetApp";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import LanguageIcon from "@material-ui/icons/Language";
import SettingsIcon from "@material-ui/icons/Settings";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import TranslateIcon from "@material-ui/icons/Translate";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { IconButton, Paper } from "@material-ui/core";
import TranslationImport from "../components/Content/Translation/TranslationImport";
import ReferenceSettings from "../components/Content/Reference/ReferenceSettings";
import AppLanguage from "../components/AppLanguage";
import { FormattedMessage } from "react-intl";
import TranslationSettings from "./Content/Translation/TranslationSettings";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  list: {
    width: 540,
  },
  fullList: {
    width: "auto",
  },
  margin: {
    margin: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
  subheader: {
    fontSize: "larger",
    fontWeight: 900,
  },
}));

export default function Settings() {
  const classes = useStyles();
  const [state, setState] = useState({
    right: false,
  });
  const [open, setOpen] = React.useState(true);
  const [tab2, setTab2] = useState(false);
  const [tab3, setTab3] = useState(false);
  const [tab4, setTab4] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const ExpandTab2 = () => {
    setTab2(!tab2);
  };

  const ExpandTab3 = () => {
    setTab3(!tab3);
  };

  const ExpandTab4 = () => {
    setTab4(!tab4);
  };

  const toggleDrawer = (anchor, open) => (event) => {
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div className={clsx(classes.list)} role="presentation">
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            className={classes.subheader}
            component="div"
            id="nested-list-subheader"
          >
            <FormattedMessage id="modal-title-setting" />
          </ListSubheader>
        }
        className={classes.root}
      >
        <ListItem button onClick={handleClick}>
          <ListItemIcon>
            <TranslateIcon />
          </ListItemIcon>
          <FormattedMessage id="label-translation-details">
            {(message) => <ListItemText primary={message} />}
          </FormattedMessage>
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem className={classes.nested}>
              <Paper className={classes.root}>
                <TranslationSettings />
              </Paper>
            </ListItem>
          </List>
        </Collapse>
        <ListItem button onClick={ExpandTab2}>
          <ListItemIcon>
            <GetAppIcon />
          </ListItemIcon>
          <FormattedMessage id="label-import-translation">
            {(message) => <ListItemText primary={message} />}
          </FormattedMessage>
          {tab2 ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={tab2} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem className={classes.nested}>
              <Paper className={classes.root}>
                <TranslationImport />
              </Paper>
            </ListItem>
          </List>
        </Collapse>
        <ListItem button onClick={ExpandTab3}>
          <ListItemIcon>
            <LibraryBooksIcon />
          </ListItemIcon>
          <ListItemText
            primary={<FormattedMessage id="label-import-ref-text" />}
          />
          {tab3 ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={tab3} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem className={classes.nested}>
              <Paper className={classes.root}>
                <ReferenceSettings open={tab3} />
              </Paper>
            </ListItem>
          </List>
        </Collapse>
        <ListItem button onClick={ExpandTab4}>
          <ListItemIcon>
            <LanguageIcon />
          </ListItemIcon>
          <FormattedMessage id="label-language">
            {(message) => <ListItemText primary={message} />}
          </FormattedMessage>
          {tab4 ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={tab4} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem className={classes.nested}>
              <Paper className={classes.root}>
                <AppLanguage />
              </Paper>
            </ListItem>
          </List>
        </Collapse>
      </List>
    </div>
  );

  return (
    <div data-test="component-panel">
      <React.Fragment key={"right"}>
        <IconButton color="inherit" onClick={toggleDrawer("right", true)}>
          <SettingsIcon />
        </IconButton>
        <SwipeableDrawer
          anchor={"right"}
          open={state["right"]}
          onOpen={toggleDrawer("right", true)}
          onClose={toggleDrawer("right", false)}
        >
          {list("right")}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}
