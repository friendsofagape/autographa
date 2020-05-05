import React, { useEffect, useState } from "react";
import AutographaStore from "../../AutographaStore.js";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import * as mobx from "mobx";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
  },
}));

const TranslationPanel = (props) => {
  const classes = useStyles();
  //   let ChunkGroup = [];
  let verseGroup = [];
  useEffect(() => {
    console.log(props.chunkGroup);
  });
  const handleKeyUp = (e) => {
    let timeout = 0;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (!AutographaStore.setDiff) {
        props.onSave();
      }
    }, 3000);
  };

  return (
    <div>
      {console.log(props.chunkGroup)}
      {props.chunkGroup &&
        props.chunkGroup.map((value, index) => {
          return (
            <div
              key={index}
              id={`versediv${index + 1}`}
              style={{ cursor: "text", whiteSpace: "pre-wrap" }}
            >
              <span key={index}>{index + 1}</span>
              <span
                contentEditable={true}
                suppressContentEditableWarning={true}
                id={`v${index + 1}`}
                data-chunk-group={AutographaStore.chunkGroup[index]}
                onKeyUp={handleKeyUp}
              >
                {AutographaStore.translationContent[index]}
              </span>
            </div>
          );
        })}
    </div>
  );
};

export default TranslationPanel;
