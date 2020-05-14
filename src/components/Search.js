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
  var [searchValue, setSearchValue] = React.useState("");
  var [replaceValue, setReplaceValue] = React.useState("");
  var [replaceOption, setReplaceOption] = React.useState("chapter");
  var replacedChapter = {},
    replacedVerse = {},
    allChapters = {},
    chapter_hash = {},
    verses_arr = [],
    chapter_arr = [];

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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

  const replaceContentAndSave = () => {
    findAndReplaceText(searchValue, replaceValue, replaceOption);
    // AutographaStore.showModalSearch = false;
  };

  const findAndReplaceText = (searchVal, replaceVal, option) => {
    // let that = this;
    let allChapterReplaceCount = [];

    db.get(AutographaStore.bookId.toString()).then((doc) => {
      let totalReplacedWord = 0;
      if (option === "chapter") {
        totalReplacedWord = findReplaceSearchInputs(
          doc.chapters[parseInt(AutographaStore.chapterId, 10) - 1].verses,
          AutographaStore.chapterId - 1,
          searchVal,
          replaceVal,
          option
        );
        allChapterReplaceCount.push(totalReplacedWord);
      } else {
        for (let i = 0; i < doc.chapters.length; i++) {
          let replaceWord = findReplaceSearchInputs(
            doc.chapters[parseInt(i + 1, 10) - 1].verses,
            i,
            searchVal,
            replaceVal,
            option
          );
          allChapterReplaceCount.push(replaceWord);
          replaceWord = 0;
        }
      }
      var replacedCount = allChapterReplaceCount.reduce(function (a, b) {
        return a + b;
      }, 0);
      this.setState({ replaceCount: replacedCount, replaceInfo: true });
      if (this.state.replaceCount === 0) {
        this.setState({ disableSave: true });
      }
      totalReplacedWord = 0;
      allChapterReplaceCount = [];
    });
  };

  const findReplaceSearchInputs = (
    verses,
    chapter,
    searchVal,
    replaceVal,
    option
  ) => {
    let replacedVerse = {};
    var i;
    // let that = this;
    let replaceCount = 0;
    for (i = 1; i <= verses.length; i++) {
      if (option === "chapter") {
        let originalVerse = verses[i - 1].verse;
        replacedVerse[i] = i;
        if (
          originalVerse.search(new RegExp(searchRegExp(searchVal), "g")) >= 0
        ) {
          let modifiedVerse = originalVerse.replace(
            new RegExp(searchRegExp(searchVal), "g"),
            replaceVal
          );
          replacedVerse[i] = modifiedVerse;
          chapter_hash["verse"] = modifiedVerse;
          chapter_hash["verse_number"] = i;
          verses_arr.push(chapter_hash);
          chapter_hash = {};
          replaceCount += originalVerse.match(
            new RegExp(searchRegExp(searchVal), "g")
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
          originalVerse.search(new RegExp(searchRegExp(searchVal), "g")) >= 0
        ) {
          let modifiedVerse = originalVerse.replace(
            new RegExp(searchRegExp(searchVal), "g"),
            replaceVal
          );
          chapter_hash["verse"] = modifiedVerse;
          chapter_hash["verse_number"] = i;
          verses_arr.push(chapter_hash);
          chapter_hash = {};
          replaceCount += originalVerse.match(new RegExp(searchVal, "g"))
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
    allChapters["chapter"] = chapter + 1;
    allChapters["verses"] = verses_arr;
    chapter_arr.push(allChapters);
    verses_arr = [];
    allChapters = {};
    // highlightRef();
    return replaceCount;
  };

  const searchRegExp = (str) => {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  };

  const saveReplacedText = () => {
    const that = this;
    db.get(AutographaStore.bookId.toString()).then((doc) => {
      if (AutographaStore.replaceOption === "chapter") {
        for (var c in replacedChapter) {
          var verses = doc.chapters[AutographaStore.chapterId - 1].verses;
          verses.forEach((verse, index) => {
            verse.verse = replacedChapter[c][index + 1];
          });
          doc.chapters[parseInt(c, 10)].verses = verses;
          db.put(doc, function (err, response) {
            if (err) {
              // $("#replaced-text-change").modal('toggle');
              // alertModal("dynamic-msg-error", "dynamic-msg-went-wrong");
            } else {
              that.setState({ loader: true });
              window.location.reload();
            }
          });
        }
        replacedChapter = {};
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
            replacedChapter = {};
            replacedVerse = {};
            that.setState({ loader: true });
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
            onClick={handleClose}
            color="primary"
            disabled={searchValue ? false : true}
          >
            Replace
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
