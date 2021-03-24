import React from 'react';
import { render } from '@testing-library/react';
import DescriptionIcon from '@material-ui/icons/Description';
import '@testing-library/jest-dom/extend-expect';
import ApplicationBar from '../ApplicationBar';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {
    List, ListItem, ListItemIcon, ListItemText, Avatar,
} from '@material-ui/core';
import DrawerMenu from '../DrawerMenu';
import { useStyles } from '../useStyles';


jest.useFakeTimers();

const showIcon = (index) => {
    switch (index) {
      case 0:
        return <AddCircleIcon fontSize="large" />;
      case 1:
        return <DescriptionIcon fontSize="large" />;
      default:
        return <Avatar alt="My Avatar" />;
    }
  };

  const drawerMenu = (
    <List>
      {['New', 'Project List', 'Profile'].map((text, index) => (
        <ListItem style={{ marginBottom: '20px' }} button key={text}>
          <ListItemIcon style={{ margin: 0 }}>
            {showIcon(index)}
          </ListItemIcon>
          <ListItemText primary={text} />
        </ListItem>
      ))}
    </List>
  );


test('renders without fail', () => {
  const classes =jest.mock()
  render(<DrawerMenu open classes={classes} direction="left"/>);
});

describe('Starred content table test', () => {
  const classes = 
      test('Check AppBar title', () => {
        const { getByTestId } = render(
        <DrawerMenu open classes={classes} direction="left">
            {drawerMenu}
        </DrawerMenu>
        );
        const draweritems = getByTestId('drawer-items');
        expect(draweritems).toHaveTextContent('NewProject ListProfile');
      });
})