import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, AppBar, Slide, Zoom, Tooltip } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import SettingsIcon from "@material-ui/icons/Settings";
import CloseIcon from "@material-ui/icons/Close";
import Fab from "@material-ui/core/Fab";
import BookIcon from "@material-ui/icons/Book";
import AutographaStore from "../../../components/AutographaStore";
import { StoreContext } from "../../context/StoreContext";
import swal from "sweetalert";
import Timer from "../Timer";
import { FormattedMessage } from "react-intl";
import * as mobx from "mobx";
const constants = require("../../../core/constants");
const remote = window.remote;
const app = remote.app;
const fs = window.fs;
const path = require("path");

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    top: 0,
    position: "fixed",
    background: "#3F5274",
    height: 84,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    marginLeft: 9,
  },
  soundWave: {
    maxWidth: 300,
    position: "static",
    float: "right",
    marginLeft: 462,
  },
  recorderToggle: {
    backgroundColor: "white",
    color: "red",
  },
  mic: {
    right: -17,
  },
  TexttoSpeech: {
    marginLeft: 20,
  },
  Icons: {
    marginRight: theme.spacing(1),
  },
  extendedIcon: {
    [theme.breakpoints.up("xl")]: {
      right: 500,
    },
    right: 260,
  },
  chapter: {
    [theme.breakpoints.up("xl")]: {
      right: 495,
    },
    right: 257,
  },
  export: {
    right: 120,
  },
  save: {
    float: "right",
    position: "absolute",
  },
}));

const useStylesBootstrap = makeStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.black,
  },
}));

function BootstrapTooltip(props) {
  const bootsrapclasses = useStylesBootstrap();

  return <Tooltip classes={bootsrapclasses} {...props} />;
}

export default function RecorderNav(props) {
  const classes = useStyles();
  const [chapter, setChapter] = useState(AutographaStore.chapterId);
  const [isOpen, SetisOpen] = useState(false);
  const {
    exportAudio,
    recVerse,
    setRecverse,
    fetchTimer,
    updateJSON,
    findChapter,
    isLoading,
  } = useContext(StoreContext);
  let bookId = AutographaStore.bookId.toString();
  let BookName = constants.booksList[parseInt(bookId, 10) - 1];

  useEffect(() => {
    if (
      chapter.toString() !== AutographaStore.chapterId.toString() &&
      isOpen === true
    ) {
      window.location.reload();
    }
    if (isOpen === true) {
      let joint = mobx.toJS(AutographaStore.AudioJointVerse);
      if (
        AutographaStore.chunkGroup.length ===
        recVerse.length + joint.length
      ) {
        // Get the existing data
        let existing = localStorage.getItem(BookName);
        // If no existing data, create an array
        // Otherwise, convert the localStorage string to an array
        existing = existing ? existing.split(",") : [];
        // Add new data to localStorage Array
        if (existing.indexOf(chapter.toString()) === -1) {
          existing.push(chapter);
          localStorage.setItem(BookName, existing.toString());
        }
        AutographaStore.ChapterComplete = true;
      } else {
        AutographaStore.ChapterComplete = false;
      }
      let existingValue = localStorage.getItem(BookName);
      // If no existing data, create an array
      // Otherwise, convert the localStorage string to an array
      existingValue = existingValue ? existingValue.split(",") : [];
      AutographaStore.recordedChapters = existingValue;
    }
  }, [props.isOpen.audioImport, chapter, isOpen, recVerse.length, BookName]);

  const mountAudio = () => {
    const currentTrans = AutographaStore.currentTrans;
    setChapter(AutographaStore.chapterId);
    // if (AutographaStore.isAudioSave !== true)
    // 	recVerse.length === 0
    // 		? (AutographaStore.isAudioSave = true)
    // 		: (AutographaStore.isAudioSave = false);
    // if (AutographaStore.isAudioSave === true) {
    swal({
      title: currentTrans["dynamic-msg-exit-recorder"],
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        AutographaStore.AudioMount = false;
        SetisOpen(false);
        localStorage.setItem("AudioMount", false);
        window.location.reload();
      }
    });
  };

  useEffect(() => {
    if (props.isOpen.audioImport) importAudio();
  });

  const importAudio = () => {
    clearTimeout();
    localStorage.setItem("AudioMount", true);
    SetisOpen(true);
    setChapter(AutographaStore.chapterId);
    AutographaStore.audioImport = false;
    var newfilepath = path.join(
      app.getPath("userData"),
      "recordings",
      BookName,
      `Chapter${AutographaStore.chapterId}`,
      `output.json`
    );
    if (fs.existsSync(newfilepath)) {
      fs.readFile(
        newfilepath,
        // callback function that is called when reading file is done
        function (err, data) {
          // json data
          var jsonData = data;
          // parse json
          var jsonParsed = JSON.parse(jsonData);
          // access elements
          for (var key in jsonParsed) {
            if (jsonParsed.hasOwnProperty(key)) {
              var val = jsonParsed[key];
              setRecverse(val.verse);
              fetchTimer(val.totaltime);
              updateJSON(val);
            }
          }
        }
      );
    }
  };

  const openmic = () => {
    const { shell } = require("electron");
    shell.openExternal("ms-settings:sound");
    shell.openExternal("x-apple.systempreferences:");
  };
  return (
    <div>
      {props.isOpen.isOpen && (
        <React.Fragment>
          <Slide
            direction="down"
            in={props.isOpen.isOpen}
            mountOnEnter
            unmountOnExit
          >
            <AppBar
              hidden={AutographaStore.showModalBooks === true}
              className={classes.appBar}
            >
              <Toolbar>
                <img
                  alt="Brand"
                  src={require("../../../assets/images/logo.png")}
                />
                <Typography variant="h5" className={classes.title}>
                  <FormattedMessage id="label-Recorder">
                    {(message) => message}
                  </FormattedMessage>
                </Typography>
                <span
                  style={{
                    right: "30%",
                    left: "50%",
                    position: "absolute",
                  }}
                >
                  <Fab
                    size="medium"
                    className={classes.extendedIcon}
                    variant="extended"
                  >
                    <BookIcon className={classes.Icons} />
                    {BookName}
                  </Fab>
                  <Fab
                    size="small"
                    aria-label="chapter"
                    onClick={findChapter}
                    disabled={isLoading === true}
                    className={classes.chapter}
                  >
                    {AutographaStore.chapterId}
                  </Fab>
                </span>
                <span
                  style={{
                    right: "50%",
                    left: "48%",
                    position: "absolute",
                  }}
                >
                  <Timer open={props.isOpen.isOpen} />
                </span>
                <span>
                  <BootstrapTooltip
                    title={
                      <span style={{ fontSize: "10px" }}>
                        <FormattedMessage id="tooltip-exitrecorder">
                          {(message) => message}
                        </FormattedMessage>
                      </span>
                    }
                    TransitionComponent={Zoom}
                  >
                    <Fab
                      aria-label="add"
                      size="medium"
                      disabled={isLoading === true}
                      className={classes.mic}
                      onClick={mountAudio}
                    >
                      <CloseIcon style={{ fontSize: "1.8rem" }} />
                    </Fab>
                  </BootstrapTooltip>
                </span>
                <span className={classes.save} style={{ left: "87%" }}>
                  <BootstrapTooltip
                    placement="bottom"
                    style={{ backgroundColor: "black" }}
                    title={
                      <span style={{ fontSize: "10px" }}>
                        <FormattedMessage id="tooltip-exportrecording">
                          {(message) => message}
                        </FormattedMessage>
                      </span>
                    }
                    TransitionComponent={Zoom}
                  >
                    <span>
                      <Fab
                        size="medium"
                        aria-label="Export"
                        disabled={isLoading === true}
                        onClick={exportAudio}
                      >
                        <CloudDownloadIcon style={{ fontSize: "1.8rem" }} />
                      </Fab>
                    </span>
                  </BootstrapTooltip>
                </span>
                <span
                  style={{
                    left: "91.5%",
                    position: "absolute",
                  }}
                >
                  <BootstrapTooltip
                    title={
                      <span style={{ fontSize: "10px" }}>
                        <FormattedMessage id="tooltip-micsettings">
                          {(message) => message}
                        </FormattedMessage>
                      </span>
                    }
                    TransitionComponent={Zoom}
                  >
                    <span>
                      <Fab
                        size="medium"
                        aria-label="Export"
                        onClick={openmic}
                        disabled={isLoading === true}
                      >
                        <SettingsIcon />
                      </Fab>
                    </span>
                  </BootstrapTooltip>
                </span>
              </Toolbar>
            </AppBar>
          </Slide>
        </React.Fragment>
      )}
    </div>
  );
}
