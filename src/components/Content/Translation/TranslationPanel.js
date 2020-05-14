import React, { useEffect, useState } from "react";
import AutographaStore from "../../AutographaStore.js";
import { Observer } from "mobx-react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  listItemIcon: {
    minWidth: 20,
    alignSelf: "self-start",
    marginTop: 6,
  },
  paper: {
    position: "absolute",
  },
  list: {
    paddingTop: 42,
  },
}));

const TranslationPanel = (props) => {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
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

  return (
    <React.Fragment>
      <Observer>
        {() => (
          <Paper
            className={classes.paper}
            style={{ width: "48.5%", left: "51.5%" }}
          >
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
                      onClick={(event) => handleListItemClick(event, index)}
                      style={{ cursor: "text", whiteSpace: "pre-wrap" }}
                    >
                      <ListItemIcon className={classes.listItemIcon}>
                        {index + 1}
                      </ListItemIcon>
                      <ListItemText
                        id={`v${index + 1}`}
                        onKeyUp={handleKeyUp}
                        data-chunk-group={AutographaStore.chunkGroup[index]}
                        contentEditable
                        style={{ outline: "none" }}
                        suppressContentEditableWarning={true}
                        primary={
                          AutographaStore.translationContent[index]
                            ? AutographaStore.translationContent[index]
                            : " "
                        }
                      />
                    </ListItem>
                  );
                })}
            </List>
          </Paper>
        )}
      </Observer>
    </React.Fragment>
  );
};

export default TranslationPanel;
