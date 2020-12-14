import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
    CssBaseline,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import { useStyles } from './useStyles';
import DrawerMenu from './DrawerMenu';

function ApplicationBar({
  title,
  buttons,
  drawerMenu,
  drawerMenuProps,
}) {
  const classes = useStyles();

  return (
      <div className={classes.root}>
      <CssBaseline />
      <AppBar 
      position="fixed" 
      className={classes.appBar}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
          <div className={classes.grow} />
          {buttons}
        </Toolbar>
      </AppBar>
        <DrawerMenu {...drawerMenuProps}>
            {drawerMenu}
        </DrawerMenu>
      </div>
  );
}


export default ApplicationBar;
