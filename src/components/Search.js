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
import SearchIcon from "@material-ui/icons/Search";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import AutographaStore from "./AutographaStore";
const db = require(`${__dirname}/../core/data-provider`).targetDb();
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
  formRoot: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
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

export default function Search() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [replaceInfo, setReplaceInfo] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [replaceValue, setReplaceValue] = React.useState("");
  const [replaceOption, setReplaceOption] = React.useState("chapter");
  const [replaceCount, setReplaceCount] = React.useState();
  const [replacedChapters, setReplacedChapters] = React.useState({});
  var replacedVerse = {},
    allChapters = {},
    chapter_hash = {},
    verses_arr = [],
    chapter_arr = [];

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    window.location.reload();
  };

  const handleFindChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleReplaceChange = (event) => {
    setReplaceValue(event.target.value);
  };
  const handleOption = (event) => {
    setReplaceOption(event.target.value);
  };

  const findAndReplaceText = () => {
    let allChapterReplaceCount = [];

    db.get(AutographaStore.bookId.toString()).then((doc) => {
      let totalReplacedWord = 0;
      if (replaceOption === "chapter") {
        totalReplacedWord = findReplaceSearchInputs(
          doc.chapters[parseInt(AutographaStore.chapterId, 10) - 1].verses,
          AutographaStore.chapterId - 1,
          replaceOption
        );
        allChapterReplaceCount.push(totalReplacedWord);
      } else {
        for (let i = 0; i < doc.chapters.length; i++) {
          let replaceWord = findReplaceSearchInputs(
            doc.chapters[parseInt(i + 1, 10) - 1].verses,
            i,
            replaceOption
          );
          allChapterReplaceCount.push(replaceWord);
          replaceWord = 0;
        }
      }
      var replacedCount = allChapterReplaceCount.reduce(function (a, b) {
        return a + b;
      }, 0);

      setReplaceCount(replacedCount);
      setReplaceInfo(true);
      totalReplacedWord = 0;
      allChapterReplaceCount = [];
    });
  };

  const findReplaceSearchInputs = (verses, chapter, option) => {
    let replacedChapter = {};
    var i;
    let replaceCount = 0;
    for (i = 1; i <= verses.length; i++) {
      if (option === "chapter") {
        let originalVerse = verses[i - 1].verse;
        replacedVerse[i] = i;
        if (
          originalVerse.search(new RegExp(searchRegExp(searchValue), "g")) >= 0
        ) {
          let modifiedVerse = originalVerse.replace(
            new RegExp(searchRegExp(searchValue), "g"),
            replaceValue
          );
          replacedVerse[i] = modifiedVerse;
          chapter_hash["verse"] = modifiedVerse;
          chapter_hash["verse_number"] = i;
          verses_arr.push(chapter_hash);
          chapter_hash = {};
          replaceCount += originalVerse.match(
            new RegExp(searchRegExp(searchValue), "g")
          ).length;
        } else {
          replacedVerse[i] = originalVerse;
          chapter_hash["verse"] = originalVerse;
          chapter_hash["verse_number"] = i;
          verses_arr.push(chapter_hash);
          chapter_hash = {};
          replaceCount += 0;
        }
      } else {
        let originalVerse = verses[i - 1].verse;
        replacedVerse[i] = i;
        if (
          originalVerse.search(new RegExp(searchRegExp(searchValue), "g")) >= 0
        ) {
          let modifiedVerse = originalVerse.replace(
            new RegExp(searchRegExp(searchValue), "g"),
            replaceValue
          );
          chapter_hash["verse"] = modifiedVerse;
          chapter_hash["verse_number"] = i;
          verses_arr.push(chapter_hash);
          chapter_hash = {};
          replaceCount += originalVerse.match(new RegExp(searchValue, "g"))
            .length;
        } else {
          chapter_hash["verse"] = originalVerse;
          chapter_hash["verse_number"] = i;
          verses_arr.push(chapter_hash);
          chapter_hash = {};
          replaceCount += 0;
        }
      }
    }
    replacedChapter[chapter] = replacedVerse;
    setReplacedChapters(replacedChapter);
    allChapters["chapter"] = chapter + 1;
    allChapters["verses"] = verses_arr;
    chapter_arr.push(allChapters);
    verses_arr = [];
    allChapters = {};
    return replaceCount;
  };

  const searchRegExp = (str) => {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  };

  const handleSummaryClose = () => {
    setOpen(false);
    setReplaceInfo(false);
    setReplaceOption("chapter");
    window.location.reload();
  };

  const saveReplacedText = () => {
    db.get(AutographaStore.bookId.toString()).then((doc) => {
      if (replaceOption === "chapter") {
        for (var c in replacedChapters) {
          var verses = doc.chapters[AutographaStore.chapterId - 1].verses;
          verses.forEach((verse, index) => {
            verse.verse = replacedChapters[c][index + 1];
          });
          doc.chapters[parseInt(c, 10)].verses = verses;
          db.put(doc, function (err, response) {
            if (err) {
              console.log("Error");
              // $("#replaced-text-change").modal('toggle');
              // alertModal("dynamic-msg-error", "dynamic-msg-went-wrong");
            } else {
              // that.setState({ loader: true });
              window.location.reload();
            }
          });
        }
        setReplacedChapters({});
        replacedVerse = {};
      } else {
        doc.chapters = chapter_arr;
        db.put(doc, function (err, res) {
          if (err) {
            chapter_arr = [];
            // $("#replaced-text-change").modal('toggle');
            // alertModal("dynamic-msg-error", "dynamic-msg-went-wrong");
          } else {
            chapter_arr = [];
            replacedVerse = {};
            // that.setState({ loader: true });
            window.location.reload();
          }
        });
      }
    });
  };

  return (
    <div>
      <SearchIcon onClick={handleClickOpen} />
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Find and Replace
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="position"
                name="FindAndReplace"
                value={replaceOption}
                onChange={handleOption}
              >
                <FormControlLabel
                  value="chapter"
                  control={<Radio color="primary" />}
                  label="Current Chapter"
                />
                <FormControlLabel
                  value="book"
                  control={<Radio color="primary" />}
                  label="Current Book"
                />
              </RadioGroup>
            </FormControl>
          </Typography>
          <Typography>
            <form className={classes.formRoot} noValidate autoComplete="off">
              <TextField
                id="outlined-basic"
                label="Find"
                variant="outlined"
                value={searchValue}
                onChange={handleFindChange}
              />
            </form>
            <form className={classes.formRoot} noValidate autoComplete="off">
              <TextField
                id="outlined-basic"
                label="Replace"
                variant="outlined"
                value={replaceValue}
                onChange={handleReplaceChange}
              />
            </form>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={findAndReplaceText}
            color="primary"
            disabled={searchValue ? false : true}
          >
            Replace
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        onClose={handleSummaryClose}
        aria-labelledby="customized-dialog-title"
        open={replaceInfo}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleSummaryClose}>
          Replacement Summary
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            <p>{replaceCount} occurrences replaced.</p>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={saveReplacedText}
            color="primary"
            disabled={replaceCount === 0}
          >
            Save
          </Button>
          <Button autoFocus onClick={handleSummaryClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
