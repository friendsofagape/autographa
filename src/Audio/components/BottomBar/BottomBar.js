import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Fab from "@material-ui/core/Fab";
// import Mic from '@material-ui/icons/Mic';
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ChromeReaderModeIcon from "@material-ui/icons/ChromeReaderMode";
import { StoreContext } from "../../context/StoreContext";
import Player from "../AudioPlayer";
import { ReactMicPlus } from "react-mic-plus";
import AutographaStore from "../../../components/AutographaStore";
import swal from "sweetalert";
import FontSlider from "../FontSlider/FontSlider";
import RecorderNav from "../RecorderNav";
import {
  Box,
  Tooltip,
  Zoom,
  useTheme,
  Button,
  ButtonGroup,
} from "@material-ui/core";
// import AudioAnalyser from "../Visualization/AudioAnalyser";
import { FormattedMessage } from "react-intl";
const { app } = require("electron").remote;
const fs = require("fs");
const constants = require("../../../core/constants");
const path = require("path");
const formattedSeconds = (sec) =>
  Math.floor(sec / 60) + ":" + ("0" + (sec % 60)).slice(-2);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: -67,
    marginLeft: 69,
  },
  title: {
    flexGrow: 1,
  },
  marginTop: 200,
  button: {
    margin: theme.spacing(1),
    float: "left",
    marginTop: 18,
  },
  input: {
    display: "none",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    marginLeft: 150,
    float: "left",
    marginTop: 20,
    position: "static",
  },
  appBar: {
    top: "auto",
    bottom: 0,
    background: "#3F5274",
    height: 72,
  },
  grow: {
    flexGrow: 1,
  },
  fab: {
    zIndex: 1,
    margin: theme.spacing(2),
    marginLeft: -7,
    backgroundColor: "rgba(346, 279, 296, 0.87)",
    top: 3,
  },
  layout: {
    margin: theme.spacing(1),
  },
  start: {
    zIndex: 1,
    margin: theme.spacing(2),
    marginLeft: -7,
    top: 3,
  },
  fab2: {
    zIndex: 1,
    margin: theme.spacing(2),
    marginLeft: -7,
    top: 3,
  },
  fab1: {
    zIndex: 1,
    margin: theme.spacing(2),
    marginLeft: -7,
    top: 3,
  },
  player: {
    color: "black",
    float: "left",
    position: "absolute",
    width: 257,
    marginLeft: 190,
    height: 64,
  },
  save: {
    float: "right",
    position: "absolute",
  },
  bottomIcons: {
    position: "absolute",
  },
  oscilloscopescrim: {
    height: 125,
    marginTop: -135,
    scrim: {
      height: "inherit",
      opacity: 0.4,
      backgroundRepeat: "repeat",
    },
  },
  oscilloscope: {
    width: 10,
  },
  shadow: {
    position: "absolute",
    top: 15,
    width: 64,
    height: 64,
    background: "rgba(0,0,0,.5)",
  },
  totaltime: {
    float: "right",
    position: "absolute",
  },
}));

function BottomBar(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [spacekey, setspacekey] = useState(false);
  const [savedTime, setsavedTime] = useState(null);
  const { record, onselect } = useContext(StoreContext);
  const { selectNext } = useContext(StoreContext);
  const {
    selectPrev,
    resetVal,
    reduceTimer,
    totalTime,
    setOnselect,
  } = useContext(StoreContext);
  const {
    startRecording,
    setTimer,
    stopRecording,
    saveRecord,
    resetTimer,
    recVerse,
    recVerseTime,
    setPreviousTime,
    isLoading,
  } = useContext(StoreContext);
  let bookId = AutographaStore.bookId.toString();
  let BookName = constants.booksList[parseInt(bookId, 10) - 1];
  var newfilepath = path.join(
    app.getPath("userData"),
    "recordings",
    BookName,
    `Chapter${AutographaStore.chapterId}`,
    `output.json`
  );
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };
  function onStop(recordedBlob) {
    saveRecord(recordedBlob);
  }
  function deleteRecordedVerse() {
    const currentTrans = AutographaStore.currentTrans;
    if (AutographaStore.isWarning === true) {
      swal({
        title: currentTrans["dynamic-msg-delete-recording"],
        text: currentTrans["dynamic-msg-delete-undonemsg"],
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          recVerse.splice(recVerse.indexOf(onselect), 1);
          recVerseTime.forEach((value, index) => {
            if (value.verse === onselect) {
              recVerseTime.splice(index, 1);
              reduceTimer(value.totaltime);
            }
          });
          if (AutographaStore.chunkGroup.length !== recVerse.length) {
            // Get the existing data
            let existing = localStorage.getItem(BookName);
            // If no existing data, create an array
            // Otherwise, convert the localStorage string to an array
            existing = existing ? existing.split(",") : [];
            // Add new data to localStorage Array
            existing.splice(
              existing.indexOf(AutographaStore.chapterId.toString()),
              1
            );
            localStorage.setItem(BookName, existing.toString());
          }
          let existingValue = localStorage.getItem(BookName);
          // If no existing data, create an array
          // Otherwise, convert the localStorage string to an array
          existingValue = existingValue ? existingValue.split(",") : [];
          AutographaStore.recordedChapters = existingValue;
          resetTimer();
          let recordedJSON = { ...recVerseTime };
          if (fs.existsSync(newfilepath)) {
            fs.writeFile(
              newfilepath,
              JSON.stringify(recordedJSON),
              "utf8",
              function (err) {
                if (err) {
                  console.log(
                    "An error occured while writing JSON Object to File."
                  );
                  return console.log(err);
                }

                console.log("JSON file has been saved.");
              }
            );
          }
          AutographaStore.recVerse = recVerse;
          AutographaStore.isPlaying = false;
          AutographaStore.isWarning = false;
          AutographaStore.reRecord = false;
          AutographaStore.currentSession = true;
          swal(currentTrans["dynamic-msg-successfully-deleted"], {
            icon: "success",
          });
          resetVal(AutographaStore.vId);
        } else {
          AutographaStore.isWarning = true;
          AutographaStore.reRecord = false;
        }
      });
    }
  }

  useEffect(() => {
    if (AutographaStore.isWarning === true) {
      if (
        (props.isOpen.savedTime !== savedTime ||
          AutographaStore.vId !== onselect) &&
        record === false
      ) {
        setsavedTime(props.isOpen.savedTime);
        setPreviousTime(props.isOpen.savedTime);
        setTimer(props.isOpen.savedTime);
      }
    }
    if (AutographaStore.vId !== onselect) {
      setOnselect(AutographaStore.vId);
      if (AutographaStore.isWarning !== true) {
        resetTimer();
      }
    }
  }, [
    onselect,
    props.isOpen.savedTime,
    savedTime,
    record,
    setPreviousTime,
    setTimer,
    setOnselect,
    resetTimer,
  ]);

  useEffect(() => {
    AutographaStore.isWarning === true
      ? (AutographaStore.currentSession = false)
      : (AutographaStore.currentSession = true);
    if (record === true) {
      AutographaStore.currentSession = false;
    }
  });
  // For space press and hold
  function handleButtonPress(event) {
    if (event.key === " " && record === false) {
      setspacekey(true);
    }
    if (spacekey === true || event.type === "mousedown") {
      startRecording();
      // getMicrophone()
      setspacekey(false);
    }
  }

  function handleButtonRelease(event) {
    if (record === true) {
      setspacekey(false);
      stopRecording();
      // stopMicrophone()
    }
  }

  //toggle visualizer
  // async function getMicrophone() {
  // 	const audio = await navigator.mediaDevices.getUserMedia({
  // 	  audio: true,
  // 	  video: false
  // 	});
  // 	setaudio(audio)
  //   }
  //   function stopMicrophone() {
  // 	  if(audio !== null)
  // 	audio.getTracks().forEach(track => track.stop());
  // 	setaudio(null)
  //   }

  return (
    <div>
      {props.isOpen.isOpen && (
        <React.Fragment>
          <RecorderNav
            isOpen={AutographaStore.AudioMount}
            audioImport={AutographaStore.audioImport}
          />
          <Slide
            direction="up"
            in={props.isOpen.isOpen}
            mountOnEnter
            unmountOnExit
          >
            <AppBar
              hidden={AutographaStore.showModalBooks}
              position="fixed"
              className={classes.appBar}
            >
              <Toolbar>
                <ReactMicPlus
                  className={classes.oscilloscope}
                  visualSetting="oscilloscope"
                  record={record}
                  onStop={onStop}
                  strokeColor="#000000"
                  backgroundColor="#3F5274"
                  nonstop={true}
                />
                <FontSlider />
                <ButtonGroup
                  size="medium"
                  variant="contained"
                  aria-label="large outlined primary button group"
                >
                  <Button
                    edge="1x"
                    disabled={isLoading === true}
                    className={classes.menuButton}
                    color="inherit"
                    style={{
                      backgroundColor:
                        AutographaStore.layout === 0 ? "rgba(0,0,0,.5)" : "",
                    }}
                    onClick={() =>
                      AutographaStore.layout !== 0
                        ? (AutographaStore.layout = 0)
                        : ""
                    }
                    aria-label="1x"
                  >
                    1x
                    <ChromeReaderModeIcon className={classes.layout} />
                  </Button>
                  <Button
                    edge="2x"
                    className={classes.menuButton}
                    disabled={isLoading === true}
                    color="inherit"
                    style={{
                      backgroundColor:
                        AutographaStore.layout !== 0 ? "rgba(0,0,0,.5)" : "",
                    }}
                    onClick={() =>
                      AutographaStore.layout === 0
                        ? (AutographaStore.layout = 1)
                        : ""
                    }
                    aria-label="2x"
                  >
                    2x
                    <ChromeReaderModeIcon className={classes.layout} />
                  </Button>
                </ButtonGroup>
                <span className={classes.bottomIcons} style={{ right: "50%" }}>
                  <span>
                    <FormattedMessage id="tooltip-previousverse">
                      {(message) => (
                        <Tooltip title={message} TransitionComponent={Zoom}>
                          <span>
                            <Fab
                              aria-label="previous"
                              disabled={isLoading === true || onselect === 1}
                              className={classes.fab}
                              onClick={selectPrev}
                            >
                              <SkipPreviousIcon
                                style={{ fontSize: "1.8rem" }}
                              />
                            </Fab>
                          </span>
                        </Tooltip>
                      )}
                    </FormattedMessage>
                  </span>
                  <span>
                    <Fab
                      aria-label="start"
                      style={{ left: "42%" }}
                      disabled={isLoading === true}
                      className={classes.shadow}
                    >
                      ""
                    </Fab>
                    <FormattedMessage id="tooltip-start/stop">
                      {(message) => (
                        <Tooltip title={message} TransitionComponent={Zoom}>
                          <span>
                            <Fab
                              color="secondary"
                              aria-label="start"
                              disabled={isLoading === true}
                              className={classes.start}
                              onKeyDown={handleButtonPress}
                              onKeyUp={handleButtonRelease}
                              onMouseDown={handleButtonPress}
                              onMouseUp={handleButtonRelease}
                            >
                              <FiberManualRecordIcon
                                style={{
                                  fontSize: "1.8rem",
                                }}
                              />
                            </Fab>
                          </span>
                        </Tooltip>
                      )}
                    </FormattedMessage>
                  </span>
                </span>
                <span
                  style={{
                    right: "30%",
                    left: "50%",
                    position: "absolute",
                  }}
                >
                  {AutographaStore.currentSession === false && (
                    <span>
                      <Zoom
                        in={AutographaStore.currentSession === false}
                        timeout={transitionDuration}
                        style={{
                          transitionDelay: `${
                            AutographaStore.currentSession === false
                              ? transitionDuration.exit
                              : 0
                          }ms`,
                        }}
                        unmountOnExit
                      >
                        <FormattedMessage id="tooltip-nextverse">
                          {(message) => (
                            <Tooltip title={message} TransitionComponent={Zoom}>
                              <span>
                                <Fab
                                  aria-label="next"
                                  disabled={
                                    isLoading === true ||
                                    onselect ===
                                      AutographaStore.chunkGroup.length
                                  }
                                  className={classes.fab}
                                  onClick={selectNext}
                                >
                                  <SkipNextIcon
                                    style={{
                                      fontSize: "1.8rem",
                                    }}
                                  />
                                </Fab>
                              </span>
                            </Tooltip>
                          )}
                        </FormattedMessage>
                      </Zoom>
                    </span>
                  )}
                  <span>
                    {AutographaStore.isWarning === true && (
                      <Zoom
                        in={AutographaStore.isWarning}
                        timeout={transitionDuration}
                        style={{
                          transitionDelay: `${
                            AutographaStore.isWarning
                              ? transitionDuration.exit
                              : 0
                          }ms`,
                        }}
                        unmountOnExit
                      >
                        <FormattedMessage id="tooltip-deleterecording">
                          {(message) => (
                            <Tooltip title={message} TransitionComponent={Zoom}>
                              <span>
                                <Fab
                                  color="secondary"
                                  size="large"
                                  disabled={isLoading === true}
                                  aria-label="delete"
                                  className={classes.start}
                                  onClick={deleteRecordedVerse}
                                >
                                  <DeleteForeverIcon
                                    style={{
                                      fontSize: "1.8rem",
                                    }}
                                  />
                                </Fab>
                              </span>
                            </Tooltip>
                          )}
                        </FormattedMessage>
                      </Zoom>
                    )}
                  </span>
                </span>
                {/* <span style={{ left: '63%', position: "absolute" }} >
								{audio ? <AudioAnalyser audio={audio} /> : ''}
								</span> */}
                <span style={{ left: "47%" }} className={classes.player}>
                  <Player isPlaying={props.isOpen.blob} />
                </span>
                <span className={classes.totaltime} style={{ left: "81%" }}>
                  <Box fontSize={13} fontStyle="italic">
                    <FormattedMessage id="label-total-chapter-length" />{" "}
                    {formattedSeconds(totalTime)}
                  </Box>
                </span>
                <span className={classes.save} style={{ left: "93%" }}>
                  <Tooltip
                    backgroundcolor="black"
                    title="Save"
                    TransitionComponent={Zoom}
                  >
                    <span>
                      <FormattedMessage id="btn-save">
                        {(message) => (
                          <Fab
                            variant="extended"
                            size="large"
                            aria-hidden="true"
                            style={{
                              backgroundColor: "#0B82FC",
                              color: "#FFF",
                              width: "90px",
                              borderRadius: "10px",
                            }}
                            aria-label="Save"
                          >
                            {message}
                          </Fab>
                        )}
                      </FormattedMessage>
                    </span>
                  </Tooltip>
                </span>
              </Toolbar>
            </AppBar>
          </Slide>
        </React.Fragment>
      )}
    </div>
  );
}
export default BottomBar;
