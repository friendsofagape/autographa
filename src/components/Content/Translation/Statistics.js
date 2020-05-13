import React, { useEffect } from "react";
import { Observer } from "mobx-react";
import * as mobx from "mobx";
import AutographaStore from "../../AutographaStore";
import * as numberFormat from "../../../core/FormatNumber";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Badge from "@material-ui/core/Badge";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import NotificationsIcon from "@material-ui/icons/Notifications";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
const db = require(`${__dirname}/../../../core/data-provider`).targetDb();

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

export default function Statistics() {
  const [openStatistics, setOpenStatistics] = React.useState(false);

  const StatisticsOpen = () => {
    setOpenStatistics(true);
  };

  const StatisticsClose = () => {
    setOpenStatistics(false);
  };

  const showReport = () => {
    let emptyChapter = [];
    let incompleteVerseChapter = {};
    let multipleSpacesChapter = {};
    db.get(AutographaStore.bookId.toString()).then((doc) => {
      doc.chapters.forEach((chapter) => {
        let emptyVerse = [];
        let verseLength = chapter.verses.length;
        let incompleteVerse = [];
        let multipleSpaces = [];
        for (let i = 0; i < verseLength; i++) {
          let verseObj = chapter.verses[i];
          let checkSpace = verseObj["verse"].match(/\s\s+/g, " ");
          if (verseObj["verse"].length === 0) {
            emptyVerse.push(i);
          } else if (
            verseObj["verse"].length > 0 &&
            verseObj["verse"].trim().split(" ").length === 1
          ) {
            incompleteVerse.push(verseObj["verse_number"]);
          } else if (checkSpace != null && checkSpace.length > 0) {
            multipleSpaces.push(verseObj["verse_number"]);
          }
        }
        if (incompleteVerse.length > 0) {
          incompleteVerseChapter[chapter["chapter"]] = incompleteVerse;
        }
        if (multipleSpaces.length > 0) {
          multipleSpacesChapter[chapter["chapter"]] = multipleSpaces;
        }
        if (emptyVerse.length === verseLength) {
          emptyChapter.push(chapter["chapter"]);
        }
      });
      AutographaStore.emptyChapter = emptyChapter;
      AutographaStore.incompleteVerse = incompleteVerseChapter;
      AutographaStore.multipleSpaces = multipleSpacesChapter;
    });
  };

  useEffect(() => {
    const incompleteVerse = mobx.toJS(AutographaStore.incompleteVerse);
    const multipleSpaces = mobx.toJS(AutographaStore.multipleSpaces);
    const emptyChapters = mobx.toJS(AutographaStore.emptyChapter);
    if (openStatistics) showReport();
  });

  return (
    <div>
      <Observer>
        {() => (
          <React.Fragment>
            <NotificationsIcon onClick={StatisticsOpen} />
            <Dialog
              maxWidth={"lg"}
              onClose={StatisticsClose}
              aria-labelledby="responsive-dialog-title"
              open={openStatistics}
            >
              <DialogTitle
                id="responsive-dialog-title"
                onClose={StatisticsClose}
              >
                Statistics
              </DialogTitle>
              <DialogTitle id="customized-dialog-title">
                Empty Chapters
              </DialogTitle>
              <DialogContent dividers>
                <Typography gutterBottom>
                  {mobx.toJS(AutographaStore.emptyChapter).length !== 0
                    ? `${numberFormat.FormatNumber(
                        mobx.toJS(AutographaStore.emptyChapter)
                      )}`
                    : "Not Found"}
                </Typography>
              </DialogContent>
              <DialogTitle id="customized-dialog-title">
                Incomplete Verses
              </DialogTitle>
              <DialogContent dividers>
                <Typography gutterBottom>
                  {Object.keys(mobx.toJS(AutographaStore.incompleteVerse))
                    .length > 0
                    ? Object.keys(
                        mobx.toJS(AutographaStore.incompleteVerse)
                      ).map((key, i) => {
                        return (
                          <span key={"c" + i}>
                            <span>{key}:</span>
                            <span>
                              {`${numberFormat.FormatNumber(
                                mobx.toJS(AutographaStore.incompleteVerse)[key]
                              )}`}
                              {Object.keys(
                                mobx.toJS(AutographaStore.incompleteVerse)
                              ).length >
                              i + 1
                                ? ";"
                                : ""}{" "}
                            </span>
                          </span>
                        );
                      })
                    : "Not Found"}
                </Typography>
              </DialogContent>
              <DialogTitle id="customized-dialog-title">
                Multiple Space
              </DialogTitle>
              <DialogContent dividers>
                <Typography gutterBottom>
                  This means sending anonymous location data to Google, even
                  when no apps are running.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={StatisticsClose} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </React.Fragment>
        )}
      </Observer>
    </div>
  );
}
