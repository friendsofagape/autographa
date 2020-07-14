import React, { useState, useContext } from "react";
import AutographaStore from "../AutographaStore";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { IconButton, TextField, Button } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ArrowDropDownCircleIcon from "@material-ui/icons/ArrowDropDownCircle";
import ListItemText from "@material-ui/core/ListItemText";
import { DialogTitle, Dialog } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { NavigationContext } from "../../contexts/NavigationContext";
const constants = require("../../core/constants");
const db = require(`${__dirname}/../../core/data-provider`).targetDb();

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
  const { setBookdata } = useContext(NavigationContext);
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
              setBookdata(AutographaStore.translatedBookNames);
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
  const resetToDefault = () => {
    let BookName =
      constants.booksList[parseInt(AutographaStore.RequiredIndex, 10)];
    setUpdatedValue(BookName);
    handleCloseMenu();
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <div>
        <Dialog
          fullWidth={true}
          maxWidth="sm"
          className={classes.dialog}
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={show}
          style={{
            top: "52px",
            left: "154px",
            height: "643px",
            position: "fixed",
          }}
        >
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            <FormattedMessage id="modal-translate-book-name" />
          </DialogTitle>
          <div>
            <span>
              <TextField
                style={{ margin: "30px" }}
                value={AutographaStore.bookName}
                name="defaultValue"
                id="defaultValue"
              />
              <ArrowRightAltIcon style={{ marginTop: "30px" }} />
              <FormattedMessage id="modal-translate-book-name">
                {(message) => (
                  <TextField
                    style={{ margin: "30px" }}
                    placeholder={message}
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
            <Button
              variant="contained"
              style={{ float: "right", margin: "10px" }}
              color="primary"
              size="medium"
              onClick={updateBooks}
            >
              <FormattedMessage id="btn-save" />
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="medium"
              style={{
                float: "right",
                margin: "10px",
              }}
              onClick={handleClose}
            >
              <FormattedMessage id="btn-cancel" />
            </Button>
          </div>
        </Dialog>
      </div>
    </React.Fragment>
  );
}
