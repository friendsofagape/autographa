import React, { useState } from "react";
import AutographaStore from "./AutographaStore";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import { TextField, RaisedButton } from "material-ui";
import { FormattedMessage } from "react-intl";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ArrowDropDownCircleIcon from "@material-ui/icons/ArrowDropDownCircle";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
const constants = require("../util/constants");
const { Modal } = require("react-bootstrap/lib");
let db = require(`${__dirname}/../util/data-provider`).targetDb();

const useStyles = makeStyles({
  root: {
    width: 500,
  },
  tooltip: {
    color: "lightblue",
    backgroundColor: "green",
  },
});

const StyledMenu = withStyles((theme) => ({
  paper: {
    border: "1px solid #d3d4d5",
    marginRight: theme.spacing(2),
  },
}))((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export default function BookNameEditor({ show }) {
  const classes = useStyles();
  const [updatedValue, setUpdatedValue] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = () => {
    AutographaStore.openBookNameEditor = false;
    AutographaStore.bookNameEditorPopup = false;
    setUpdatedValue("");
  };
  const onChange = (event, value) => {
    setUpdatedValue(event.target.value);
  };

  const updateBooks = () => {
    if (updatedValue !== "") {
      AutographaStore.updatedTranslatedBookNames = updatedValue;
      db.get("translatedBookNames", function (err, doc) {
        if (err) {
          return console.log(err);
        } else {
          doc.books.splice(
            AutographaStore.RequiredIndex,
            1,
            AutographaStore.updatedTranslatedBookNames
          );
        }
        db.put(doc).then((response) => {
          db.get("translatedBookNames", function (err, doc) {
            if (err) {
              return console.log(err);
            } else {
              AutographaStore.translatedBookNames = doc.books;
            }
          });
        });
      });
      AutographaStore.openBookNameEditor = false;
      AutographaStore.bookNameEditorPopup = false;
      setUpdatedValue("");
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const resetToDefault = (event) => {
    let BookName =
      constants.booksList[parseInt(AutographaStore.RequiredIndex, 10)];
    setUpdatedValue(BookName);
    handleCloseMenu();
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Modal
        show={show}
        style={{
          top: "52px",
          left: "154px",
          height: "643px",
          position: "fixed",
        }}
      >
        <Modal.Header className="head">
          <Modal.Title>
            <FormattedMessage id="modal-translate-book-name" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "150px" }}>
          <span>
            <TextField
              style={{ marginRight: "10px" }}
              value={AutographaStore.bookName}
              name="defaultValue"
              id="defaultValue"
            />
            <ArrowRightAltIcon />
            <FormattedMessage id="modal-translate-book-name">
              {(message) => (
                <TextField
                  hintText={message}
                  onChange={onChange}
                  required
                  value={updatedValue || ""}
                  name="updatedValue"
                  id="updatedValue"
                  maxLength={20}
                />
              )}
            </FormattedMessage>
          </span>
          <span>
            <IconButton
              aria-controls="customized-menu"
              aria-haspopup="true"
              variant="contained"
              color="primary"
              style={{
                transform: "rotateX(180deg)",
                float: "right",
                marginTop: "-45px",
                cursor: "pointer",
              }}
              onClick={handleClick}
            >
              <ArrowDropDownCircleIcon />
            </IconButton>
          </span>
          <StyledMenu
            id="customized-menu"
            anchorEl={() => {
              return anchorEl;
            }}
            keepMounted
            disableEnforceFocus
            style={{ top: "-60px", left: "-16px" }}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <StyledMenuItem onClick={resetToDefault}>
              <FormattedMessage id="label-button-reset">
                {(message) => <ListItemText primary={message} />}
              </FormattedMessage>
            </StyledMenuItem>
          </StyledMenu>
          <RaisedButton
            style={{ marginTop: "35px", float: "right" }}
            primary={true}
            onClick={updateBooks}
          >
            <FormattedMessage id="btn-save" />
          </RaisedButton>
          <RaisedButton
            style={{
              marginTop: "35px",
              float: "right",
              marginRight: "10px",
            }}
            onClick={handleClose}
          >
            <FormattedMessage id="btn-cancel" />
          </RaisedButton>
        </Modal.Body>
      </Modal>
    </div>
  );
}
