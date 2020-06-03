import React from "react";
import { IconButton } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import UsfmExport from "./UsfmExport";
import HtmlExport from "./HtmlExport";
// import Fade from "@material-ui/core/Fade";

const Download = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [usfmExport, setUsfmExport] = React.useState(false);
  const [callHtml, setCallHtml] = React.useState(false);
  const [column, setColumn] = React.useState();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setCallHtml(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setUsfmExport(false);
  };

  const handleUsfm = () => {
    setUsfmExport(true);
    setAnchorEl(null);
  };

  const handleColumn = (value) => {
    setCallHtml(true);
    setColumn(value);
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <img alt="" src={require("../../assets/icons/backup_white.svg")} />
      </IconButton>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleUsfm}>USFM</MenuItem>
        <MenuItem onClick={(event) => handleColumn(1)}>1-Column HTML</MenuItem>
        <MenuItem onClick={(event) => handleColumn(2)}>2-Column HTML</MenuItem>
      </Menu>
      <UsfmExport open={usfmExport} close={handleClose} />
      {callHtml === true ? (
        <HtmlExport columns={column} htmlClose={handleClose} />
      ) : null}
    </div>
  );
};
export default Download;
