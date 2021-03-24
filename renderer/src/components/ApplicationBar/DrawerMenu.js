import React from 'react';
import PropTypes from 'prop-types';
import {
  Drawer,
  Toolbar,
} from '@material-ui/core';

function DrawerMenu({
  classes,
  children,
  direction,
  open,
}) {
  return (
    <div>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor={direction}
        open={open}
      >
        <Toolbar />
        <div
          id="list-items"
          data-testid="drawer-items"
        >
          {children}
        </div>
      </Drawer>
    </div>
  );
}

DrawerMenu.propTypes = {
  classes: PropTypes.object,
  direction: PropTypes.string,
  /** Component to render inside of the drawer menu. */
  children: PropTypes.element,
  open: PropTypes.bool,
};

export default DrawerMenu;
