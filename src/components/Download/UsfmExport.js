import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import AutographaStore from "../AutographaStore";
import * as bibUtil from "../../core/json_to_usfm";
import swal from "sweetalert";
const db = require(`${__dirname}/../../core/data-provider`).targetDb();
const constants = require("../../core/constants");

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
const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  button: {
    display: "block",
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 180,
  },
}));

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

const UsfmExport = (props) => {
  const classes = useStyles();
  const [stageName, setStageName] = React.useState("");
  const [stageChange, setStageChange] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [exportOption, setExportOption] = React.useState("current");

  const handleChange = (event) => {
    setStageChange(event.target.value);
    setStageName("");
  };
  const handleType = (event) => {
    setStageName(event.target.value);
    setStageChange("");
  };
  const handleOption = (event) => {
    setExportOption(event.target.value);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const exportUsfm = async () => {
    let stageInput = stageName ? stageName : `Stage ${stageChange}`;
    let book = {};
    let filepath;
    let books = exportOption;
    try {
      let doc = await db.get("targetBible");
      if (books === "current") {
        book.bookNumber = AutographaStore.bookId.toString();
        book.bookName = AutographaStore.editBookNamesMode
          ? AutographaStore.translatedBookNames[
              parseInt(book.bookNumber, 10) - 1
            ]
          : constants.booksList[parseInt(book.bookNumber, 10) - 1];
        book.bookCode =
          constants.bookCodeList[parseInt(book.bookNumber, 10) - 1];
        book.outputPath = doc.targetPath;
        filepath = await bibUtil.toUsfm(book, stageInput, doc);
        swal("Export as USFM", `Book Exported:${filepath}`, "success");
      }
      if (books === "*") {
        constants.bookCodeList.forEach(async (value, index) => {
          book = {};
          book.bookNumber = (index + 1).toString();
          book.bookName = AutographaStore.editBookNamesMode
            ? AutographaStore.translatedBookNames[index]
            : constants.booksList[index];
          book.bookCode = value;
          book.outputPath = doc.targetPath;
          filepath = await bibUtil.toUsfm(book, stageInput, doc);
        });
        swal(
          "Export as USFM",
          `All USFM files have been saved to : ${doc.targetPath}`,
          "success"
        );
      }
    } catch (ex) {
      swal(
        "Error",
        "Please enter Translation Details in the Settings to continue with Export.",
        "error"
      );
    } finally {
      return props.close;
    }
  };

  return (
    <div>
      <Dialog
        onClose={props.close}
        aria-labelledby="customized-dialog-title"
        open={props.open}
      >
        <DialogTitle id="customized-dialog-title" onClose={props.close}>
          Export as USFM
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            <TextField
              id="outlined-basic"
              label="Stage name of translation"
              variant="outlined"
              value={
                stageName
                  ? stageName
                  : stageChange
                  ? `Stage ${stageChange}`
                  : ""
              }
              onChange={handleType}
            />

            <FormControl className={classes.formControl}>
              <InputLabel id="demo-controlled-open-select-label">
                Stage in Translation
              </InputLabel>
              <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                value={stageChange}
                onChange={handleChange}
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
              >
                <MenuItem value={"1"}>Stage 1</MenuItem>
                <MenuItem value={"2"}>Stage 2</MenuItem>
                <MenuItem value={"3"}>Stage 3</MenuItem>
                <MenuItem value={"4"}>Stage 4</MenuItem>
                <MenuItem value={"5"}>Stage 5</MenuItem>
              </Select>
            </FormControl>
          </Typography>
          <Typography gutterBottom>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="position"
                name="ExportUSFM"
                value={exportOption}
                onChange={handleOption}
              >
                <FormControlLabel
                  value="current"
                  control={<Radio color="primary" />}
                  label="Current Book"
                />
                <FormControlLabel
                  value="*"
                  control={<Radio color="primary" />}
                  label="All Book"
                />
              </RadioGroup>
            </FormControl>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={exportUsfm}
            color="primary"
            disabled={stageName || stageChange ? false : true}
          >
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default UsfmExport;
