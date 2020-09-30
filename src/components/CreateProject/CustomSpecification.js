import React, { useEffect, useRef } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import {
  Box,
  FormControl,
  FormLabel,
  Grid,
  ListItem,
  ListItemText,
  TextField,
  Zoom,
} from "@material-ui/core";
import * as localForage from "localforage";
import { CreateProjectStyles } from "./useStyles/CreateProjectStyles";

const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Zoom
      style={{ transitionDelay: "50ms" }}
      direction="up"
      ref={ref}
      {...props}
    />
  );
});

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function CustomSpecification({
  opencustom,
  setCustonOpen,
  allbooks,
  setContent,
  canonSpecification,
  updateCanonItems,
  setUpdateCanonItems,
  setcanonSpecification,
}) {
  const classes = CreateProjectStyles();
  const textRef = useRef();
  const [selectedbook, setSelectedbook] = React.useState([]);
  const [highlight, setHighlight] = React.useState(false);
  const [customselectedbookObj, setCustomelectedbookObj] = React.useState([]);

  useEffect(() => {
    localForage.getItem("custonSpec", function (err, value) {
      setCustomelectedbookObj(value);
    });
    if (customselectedbookObj) {
      let result = customselectedbookObj.filter((obj) => {
        return obj.id === canonSpecification;
      });
      if (result[0] !== undefined) {
        setContent(result[0].books);
      }
    }
    // eslint-disable-next-line
  },[canonSpecification])

  useEffect(() => {
    localForage.getItem("custonSpec", function (err, value) {
      let custonspec,
        duplicate = false;
      if (value !== null) {
        value.forEach(function (fields) {
          updateCanonItems.forEach((element) => {
            if (element.spec.includes(fields.id) === true) {
              duplicate = true;
            }
          });
          if (duplicate === false) {
            custonspec = { id: fields.id, spec: fields.id };
            updateCanonItems.push(custonspec);
            setUpdateCanonItems(updateCanonItems);
            setCustomelectedbookObj(value);
          }
        });
      }
    });
    // eslint-disable-next-line
  },[])

  const handleSave = () => {
    let duplicates = false;
    setCustonOpen(false);
    if (selectedbook) {
      let selectedbookObj = { id: textRef.current.value, books: selectedbook };
      customselectedbookObj.push(selectedbookObj);
      setCustomelectedbookObj(customselectedbookObj);
    }

    updateCanonItems.forEach((element) => {
      if (element.spec.includes(textRef.current.value) === true) {
        duplicates = true;
      }
    });
    if (duplicates === false && textRef.current.value !== "") {
      let custonspec = {
        id: textRef.current.value,
        spec: textRef.current.value,
      };
      updateCanonItems.push(custonspec);
      setUpdateCanonItems(updateCanonItems);
      setcanonSpecification(textRef.current.value);
      if (customselectedbookObj !== null)
        localForage.setItem("custonSpec", customselectedbookObj, function (
          err
        ) {
          localForage.getItem("custonSpec", function (err, value) {
            console.log("saved in storage db", value);
          });
        });
    }
    setSelectedbook([]);
  };

  const selectedBooks = (bookname) => {
    if (selectedbook.includes(bookname) === false) {
      selectedbook.push(bookname);
      setHighlight(!highlight);
    } else {
      let selectedIndex = selectedbook.indexOf(bookname);
      selectedbook.splice(selectedIndex, 1);
      setSelectedbook(selectedbook);
      setHighlight(!highlight);
    }
  };

  const handleClose = () => {
    setcanonSpecification("OT");
    setCustonOpen(false);
  };

  function FormRow() {
    return (
      <React.Fragment>
        {allbooks.map((bookname, index) => {
          return (
            <Grid key={index} item xs={2}>
              <ListItem
                button
                className={classes.paper}
                classes={{ selected: classes.selected }}
                selected={selectedbook.includes(bookname)}
                style={{ backgroundColor: "white" }}
                onClick={() => selectedBooks(bookname)}
              >
                <ListItemText primary={bookname} />
              </ListItem>
            </Grid>
          );
        })}
      </React.Fragment>
    );
  }

  return (
    <div>
      <Dialog
        maxWidth="xl"
        fullWidth={true}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={opencustom}
      >
        <DialogTitle id="customized-dialog-title">
          <Box fontWeight={600} m={1}>
            Add Canon Specification
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <form>
            <FormControl component="fieldset">
              <FormLabel component="legend">
                <Box fontWeight={600} m={1}>
                  Canon Specification Name
                </Box>
              </FormLabel>
              <TextField
                className={classes.Specification}
                variant="outlined"
                placeholder="Enter canon specification name"
                type="text"
                required
                inputRef={textRef}
              />
            </FormControl>
          </form>
          <div className={classes.root}>
            <Grid container spacing={1}>
              <Grid container item xs={12} spacing={3}>
                <FormRow />
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} variant="contained">
            Cancel
          </Button>
          <Button
            autoFocus
            onClick={handleSave}
            variant="contained"
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
