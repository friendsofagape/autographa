import React from 'react';
import AddBoxIcon from '@material-ui/icons/AddBox';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import { IconButton, Menu } from '@material-ui/core';
import CommentIcon from '@material-ui/icons/Comment';
import PostAddIcon from '@material-ui/icons/PostAdd';
import ImageIcon from '@material-ui/icons/Image';
import MapIcon from '@material-ui/icons/Map';
import BookIcon from '@material-ui/icons/Book';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';

const ReferenceSelector = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        <AddBoxIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem>
          <ListItemIcon>
            <PostAddIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">
            Dictionary
          </Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ImageIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">
            Image
          </Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <MapIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            Map
          </Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <CommentIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            Commentary
          </Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <BookIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            Bible
          </Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <LiveHelpIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            TranslationHelps
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ReferenceSelector;
