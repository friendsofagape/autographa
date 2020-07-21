import React, { useState } from "react";
import AutographaStore from "../../AutographaStore.js";
import { Observer } from "mobx-react";
import * as mobx from "mobx";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import StopIcon from "@material-ui/icons/Stop";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import JointVerse from "./JointVerse";
import { Zoom, Tooltip } from "@material-ui/core";
import { lastSavedtime, fetchAudio } from "./helpers.js";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  listItemIcon: {
    minWidth: 20,
    alignSelf: "self-start",
  },
  paper: {
    position: "absolute",
  },
  list: {
    paddingTop: 42,
  },
  listItemText: {
    fontSize: "0.7em", //Insert your required size
  },
  listItemPlayIcon: {
    alignSelf: "normal",
  },
}));

const initialState = {
  mouseX: null,
  mouseY: null,
};

const TranslationPanel = (props) => {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [pointer, setPointer] = useState(initialState);
  const [index, setIndex] = useState();
  const tInsert = mobx.toJS(AutographaStore.tIns[0]);
  const tDelete = mobx.toJS(AutographaStore.tDel[0]);

  const handleListItemClick = (event, index) => {
    let recordedVerse = mobx.toJS(AutographaStore.recVerse);
    AutographaStore.vId = index;
    setSelectedIndex(AutographaStore.vId);
    if (
      AutographaStore.recVerse !== null &&
      AutographaStore.vId !== undefined
    ) {
      if (recordedVerse.indexOf(AutographaStore.vId) !== -1) {
        AutographaStore.isWarning = true;
        AutographaStore.currentSession = false;
        lastSavedtime();
      }
      if (recordedVerse.indexOf(AutographaStore.vId) === -1) {
        AutographaStore.isWarning = false;
        AutographaStore.currentSession = true;
      }
    }
  };

  const handleKeyUp = (e) => {
    let timeout = 0;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (!AutographaStore.setDiff) {
        props.onSave();
      }
    }, 3000);
  };

  const handleJoint = (event, i) => {
    setIndex(i);
    setPointer({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const closeJoint = () => {
    setPointer(initialState);
  };

  return (
    <React.Fragment>
      <Observer>
        {() => (
          <Paper>
            <div
              dir={AutographaStore.scriptDirection}
              style={{
                fontSize: `${AutographaStore.currentFontValue}px`,
              }}
              className={`col-12 col-ref verse-input ${AutographaStore.scriptDirection.toLowerCase()}`}
            >
              {AutographaStore.toggle && (tInsert || tDelete) ? (
                <div style={{ textAlign: "center" }}>
                  <span style={{ color: "#27b97e", fontWeight: "bold" }}>
                    (+) {tInsert}
                  </span>{" "}
                  |{" "}
                  <span style={{ color: "#f50808", fontWeight: "bold" }}>
                    (-) {tDelete}
                  </span>
                </div>
              ) : (
                ""
              )}
              <List className={classes.list}>
                {props.chunkGroup &&
                  props.chunkGroup.map((value, index) => {
                    return (
                      <ListItem
                        dense
                        className={classes.root}
                        key={index}
                        selected={selectedIndex === index + 1}
                        id={`versediv${index + 1}`}
                        onClick={(event) =>
                          handleListItemClick(event, index + 1)
                        }
                        style={{
                          cursor: "text",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {mobx.toJS(
                          AutographaStore.AudioMount &&
                            mobx.toJS(AutographaStore.recVerse)
                        ) &&
                          mobx
                            .toJS(AutographaStore.recVerse)
                            .map((recVerse, recIndex) => {
                              if (recVerse - 1 === index)
                                return (
                                  <ListItemIcon
                                    className={classes.listItemPlayIcon}
                                    onClick={fetchAudio}
                                  >
                                    {AutographaStore.isPlaying === false && (
                                      <Tooltip
                                        title="Play/Stop"
                                        TransitionComponent={Zoom}
                                      >
                                        <PlayCircleOutlineIcon
                                          edge="start"
                                          tabIndex={-1}
                                          style={{
                                            color: "red",
                                            cursor: "pointer",
                                          }}
                                          onClick={() =>
                                            index + 1 === AutographaStore.vId
                                              ? (AutographaStore.isPlaying = true)
                                              : (AutographaStore.isPlaying = false)
                                          }
                                        />
                                      </Tooltip>
                                    )}
                                    {index + 1 === AutographaStore.vId &&
                                    AutographaStore.isPlaying === true ? (
                                      <StopIcon
                                        edge="start"
                                        tabIndex={-1}
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                          (AutographaStore.isPlaying = false)
                                        }
                                      />
                                    ) : (
                                      AutographaStore.isPlaying === true && (
                                        <PlayCircleOutlineIcon
                                          edge="start"
                                          tabIndex={-1}
                                          style={{
                                            color: "red",
                                            cursor: "pointer",
                                          }}
                                          onClick={() =>
                                            (AutographaStore.isPlaying = true)
                                          }
                                        />
                                      )
                                    )}
                                  </ListItemIcon>
                                );
                            })}
                        <ListItemIcon className={classes.listItemIcon}>
                          {index + 1}
                        </ListItemIcon>
                        <span
                          id={`v${index + 1}`}
                          onKeyUp={handleKeyUp}
                          data-chunk-group={AutographaStore.chunkGroup[index]}
                          contentEditable={
                            AutographaStore.jointVerse[index] === undefined
                              ? true
                              : false
                          }
                          className={classes.listItemText}
                          style={{
                            outline: "none",
                            marginLeft: "10px",
                            paddingRight: "50px ",
                            maxWidth: "-webkit-fill-available",
                          }}
                          onContextMenu={
                            index !== 0
                              ? (event) => {
                                  handleJoint(event, index);
                                }
                              : false
                          }
                          suppressContentEditableWarning={true}
                        >
                          {AutographaStore.jointVerse[index] === undefined
                            ? AutographaStore.translationContent[index]
                              ? AutographaStore.translationContent[index]
                              : ""
                            : "----- Joint with the preceding verse(s) -----"}
                        </span>
                      </ListItem>
                    );
                  })}
              </List>
            </div>
          </Paper>
        )}
      </Observer>
      <JointVerse show={pointer} index={index} close={closeJoint} />
    </React.Fragment>
  );
};

export default TranslationPanel;
