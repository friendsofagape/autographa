import React, { useContext } from 'react';
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
import ListAltIcon from '@material-ui/icons/ListAlt';
import CustomDialog from '@/components/ApplicationBar/CustomDialog';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import ResourceFileManager from './ResourceFileManager';

const listValue = [
  { id: 'img', val: 'Image' },
  { id: 'Map', val: 'Map' },
  { id: 'Bible', val: 'Bible' },
  { id: 'twlm', val: 'Translation Words' },
  { id: 'twl', val: 'Translation Word List' },
  { id: 'tn', val: 'Translation Notes' },
  { id: 'tq', val: 'Translation Questions' },
];
const ReferenceSelector = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const {
    state: {
        anchorEl,
    },
    actions: {
      setAnchorEl,
      handleClick,
    },
  } = useContext(ReferenceContext);

  const handleClose = () => {
    setAnchorEl(null);
    setDialogOpen(false);
  };
  const handleMenuSelect = (e, index) => {
    setDialogOpen(true);
    setSelectedIndex(index);
  };
  const showIcon = (index) => {
    switch (index) {
      case 0:
        return <ImageIcon fontSize="small" />;
      case 1:
        return <MapIcon fontSize="small" />;
      case 2:
        return <BookIcon fontSize="small" />;
      case 3:
        return <CommentIcon fontSize="small" />;
      case 4:
        return <ListAltIcon fontSize="small" />;
      case 5:
        return <PostAddIcon fontSize="small" />;
      case 6:
        return <LiveHelpIcon fontSize="small" />;
      default:
        return <ImageIcon alt="My Avatar" />;
    }
  };
  const ReferenceSelector = (
    <>
      <ResourceFileManager
        listItems={listValue}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        handleClose={handleClose}
      />
    </>
  );

  return (
    <>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {listValue.map((option, index) => (
          <MenuItem
            value="Image"
            onClick={(e) => handleMenuSelect(e, index, option.val)}
            key={option.val}
            selected={index === selectedIndex}
          >
            <ListItemIcon>
              {showIcon(index)}
            </ListItemIcon>
            <Typography variant="inherit">
              {option.val}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
      <CustomDialog
        open={dialogOpen}
        handleClose={handleClose}
        title="Reference Selection"
        width="md"
        content={ReferenceSelector}
      />
    </>
  );
};

export default ReferenceSelector;
