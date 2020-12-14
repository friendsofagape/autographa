import React from 'react';
import PropTypes from 'prop-types';
import {
  Drawer,
  Toolbar,
} from '@material-ui/core';

import { useStyles } from './useStyles';

function DrawerMenu({
  children,
}) {
  const classes = useStyles();

  const drawerClasses = { paper: classes.drawerPaper };

  return (
    <div>
      <Drawer
        className={classes.drawer}
        variant="permanent" anchor="left"
        open={openDrawer}
        onClose={toggleDrawer}
        classes={drawerClasses}>
        <Toolbar  />
        <div 
        id='list-items' 
        onClick={onDrawerItemClick}
        >
          {children}
        </div>
      </Drawer>
    </div>
  );
};

DrawerMenu.propTypes = {
  /** Component to render inside of the drawer menu. */
  children: PropTypes.element,
};

export default DrawerMenu;