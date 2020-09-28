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
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { FormattedMessage } from "react-intl";
import { Box, Button, Avatar } from "@material-ui/core";
import { Observer } from "mobx-react";
import AutographaStore from "../AutographaStore";
import { ProjectsNav } from "../ProjectPaneNav/ProjectsNav";
import { ProjectDrawerStyles } from "./useStyles/ProjectDrawerStyles";


export default function ProjectsDrawer() {
  const classes = ProjectDrawerStyles()
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("Create New Project");

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
              {title === 'Profile' && (
                <Button size="small" variant="contained" color="primary">
                <Box fontWeight={600} m={1}>
                  <FormattedMessage id="btn-logout" />
                </Box>
              </Button>
              )}
              {title === 'Create New Project' && (
                <Button size="small" variant="contained" color="primary">
                <Box fontWeight={600} m={1}>
                  <FormattedMessage id="btn-create" />
                </Box>
              </Button>
              )}
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
                className={classes.newproject}
                style={{
                  backgroundColor: title === "Create New Project" ? "#ffffff" : "#212121",
                }}
              >
                <ListItem onClick={() => titlechange("Create New Project")} button>
                  <ListItemIcon>
                    <AddCircleIcon
                      fontSize="large"
                      color={title === "Create New Project" ? "primary" : "secondary"}
                    />
                  </ListItemIcon>
                  <FormattedMessage id="label-create-project">
                    {(message) => (
                      <ListItemText
                        primary={message}
                        style={{
                          color: title === "Create New Project" ? "#212121" : "#ffffff",
                        }}
                      />
                    )}
                  </FormattedMessage>
                </ListItem>
              </div>
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
            <ProjectsNav title={title} />
          </main>
        </div>
      )}
    </Observer>
  );
}
