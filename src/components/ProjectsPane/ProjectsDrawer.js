import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DescriptionIcon from "@material-ui/icons/Description";
import { FormattedMessage } from "react-intl";
import Profile from "./Profile";
import { Box, Button, Avatar } from "@material-ui/core";
import Projects from "./Projects";
import { Observer } from "mobx-react";
import AutographaStore from "../AutographaStore";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    backgroundColor: "#212121",
    color: "#ffffff",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    backgroundColor: "#212121",
    color: "#ffffff",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  tabs: {
    marginTop: theme.spacing(20),
    padding: theme.spacing(1),
  },
  avatarplacement: {
    width: "100%",
    height: theme.spacing(7),
    marginTop: theme.spacing(40),
  },
  avatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
}));

export default function ProjectsDrawer() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("Profile");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const titlechange = (value) => {
    setTitle(value);
  };

  return (
    <Observer>
      {() => (
        <div className={classes.root}>
          <CssBaseline />
          <AppBar
            color="inherit"
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open,
            })}
          >
            <Toolbar>
              <IconButton
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, {
                  [classes.hide]: open,
                })}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                className={classes.title}
                variant="h5"
                color="inherit"
              >
                <Box fontWeight={600} m={1}>
                  <FormattedMessage id={`label-${title}`} />
                </Box>
              </Typography>
              <Button size="small" variant="contained" color="primary">
                <Box fontWeight={600} m={1}>
                  <FormattedMessage id="btn-logout" />
                </Box>
              </Button>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            })}
            classes={{
              paper: clsx({
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
              }),
            }}
          >
            <div className={classes.toolbar}>
              <IconButton onClick={handleDrawerClose}>
                {open === true && <ChevronLeftIcon color="secondary" />}
              </IconButton>
            </div>
            <Divider />
            <List>
              <div
                className={classes.avatarplacement}
                style={{
                  backgroundColor: title === "Projects" ? "#ffffff" : "#212121",
                }}
              >
                <ListItem onClick={() => titlechange("Projects")} button>
                  <ListItemIcon>
                    <DescriptionIcon
                      fontSize="large"
                      color={title === "Projects" ? "primary" : "secondary"}
                    />
                  </ListItemIcon>
                  <FormattedMessage id="label-Projects">
                    {(message) => (
                      <ListItemText
                        primary={message}
                        style={{
                          color: title === "Projects" ? "#212121" : "#ffffff",
                        }}
                      />
                    )}
                  </FormattedMessage>
                </ListItem>
              </div>
              <div
                className={classes.avatarplacement}
                style={{
                  backgroundColor: title === "Profile" ? "#ffffff" : "#212121",
                }}
              >
                <ListItem
                  color="secondary"
                  onClick={() => titlechange("Profile")}
                  button
                >
                  <ListItemIcon className={classes.avatar}>
                    <Avatar src={AutographaStore.avatarPath} alt="My Avatar" />
                    {/* <MailIcon fontSize="large" color="secondary" /> */}
                  </ListItemIcon>
                  <FormattedMessage id="label-Profile">
                    {(message) => (
                      <ListItemText
                        color="inherit"
                        primary={message}
                        style={{
                          color: title === "Profile" ? "#212121" : "#ffffff",
                        }}
                      />
                    )}
                  </FormattedMessage>
                </ListItem>
              </div>
            </List>
          </Drawer>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            {title === "Profile" ? <Profile /> : <Projects />}
          </main>
        </div>
      )}
    </Observer>
  );
}
