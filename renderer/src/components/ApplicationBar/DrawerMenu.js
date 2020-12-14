import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
  Drawer,
  Divider,
  Toolbar,
} from '@material-ui/core';

import { useStyles } from './useStyles';

function DrawerMenu({
  children,
  closeOnListItemsClick,
}) {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const drawerClasses = { paper: classes.drawerPaper };

  const onDrawerItemClick = () => {
    if (closeOnListItemsClick) {
      toggleDrawer()
    }
  }

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
  /** Set whether or not to hide the contents of the Repo in the Drawer. */
  hideRepoContents: PropTypes.bool,
  /** Set whether or not the list items close the drawer on OnClick event. */
  closeOnListItemsClick: PropTypes.bool,
};

export default DrawerMenu;