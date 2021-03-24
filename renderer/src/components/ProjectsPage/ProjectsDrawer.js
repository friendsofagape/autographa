import React, { useCallback } from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';
import DescriptionIcon from '@material-ui/icons/Description';
import SettingsIcon from '@material-ui/icons/Settings';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {
  IconButton, Badge, List, ListItem, ListItemIcon, ListItemText, Avatar,
} from '@material-ui/core';
import { Notifications } from '@material-ui/icons';
import ApplicationBar from '../ApplicationBar/ApplicationBar';
import { ProjectsNav } from './ProjectPaneNav/ProjectsNav';
import { ProjectContext } from './ProjectsContext/ProjectContext';

Router.onRouteChangeStart = () => {
  NProgress.start();
};

Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

export default function ProjectsDrawer() {
  const {
    states: {
    sideTabTitle,
    },
    actions: {
      setSideTabTitle,
    },
   } = React.useContext(ProjectContext);
  const buttons = (
    <IconButton color="inherit">
      <Badge badgeContent={17} color="secondary">
        <Notifications />
      </Badge>
    </IconButton>
  );

  const showIcon = (index) => {
    switch (index) {
      case 0:
        return <AddCircleIcon fontSize="large" />;
      case 1:
        return <DescriptionIcon fontSize="large" />;
      case 2:
        return <SettingsIcon fontSize="large" />;
      default:
        return <Avatar alt="My Avatar" />;
    }
  };

  const selectPane = useCallback((text) => {
    setSideTabTitle(text);
  }, [setSideTabTitle]);

  const drawerMenu = (
    <List>
      {['New', 'Projects', 'Sync', 'Profile'].map((text, index) => (
        <ListItem style={{ marginBottom: '20px' }} button onClick={() => selectPane(text)} key={text}>
          <ListItemIcon style={{ margin: 0 }}>
            {showIcon(index)}
          </ListItemIcon>
          <ListItemText primary={text} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      <ApplicationBar
        title="AUTOGRAPHA"
        theme="primary"
        buttons={buttons}
        drawerMenu={drawerMenu}
      />
      <ProjectsNav title={sideTabTitle} />
    </>
  );
}
