import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { Slide, IconButton } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import CustomizedSlider from "./FontSlider";
import AutographaStore from "../AutographaStore";
import ChromeReaderModeIcon from "@material-ui/icons/ChromeReaderMode";
import { useEffect } from "react";
import { Observer } from "mobx-react";
const refDb = require(`${__dirname}/../../core/data-provider`).referenceDb();

const useStyles = makeStyles((theme) => ({
  appBar: {
    top: "auto",
    bottom: 0,
    backgroundColor: "#fffafa",
  },
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  layout: {
    margin: theme.spacing(1),
  },
  save: {
    float: "right",
  },
}));

export default function Footer(props) {
  const classes = useStyles();

  const handleChange = (key) => {
    let translationContent = [];
    if (key === 4) {
      AutographaStore.disablediff = true;
    } else {
      AutographaStore.disablediff = false;
    }
    for (let i = 0; i < AutographaStore.chunkGroup.length; i++) {
      let vId = "v" + (i + 1);
      translationContent.push(
        document.getElementById(vId).textContent.toString()
      );
    }
    AutographaStore.translationContent = translationContent;
    AutographaStore.layout = key;
    AutographaStore.layoutContent = key;
    AutographaStore.aId = key;
    refDb
      .get("targetReferenceLayout")
      .then(function (doc) {
        refDb.put({
          _id: "targetReferenceLayout",
          layout: key,
          _rev: doc._rev,
        });
      })
      .catch(function (err) {
        refDb
          .put({
            _id: "targetReferenceLayout",
            layout: key,
          })
          .catch(function (err) {});
      });
  };
  useEffect(() => {
    console.log(AutographaStore.transSaveTime);
  });

  return (
    <Observer>
      {() => (
        <React.Fragment>
          {/* <Slide direction="up" in={true} mountOnEnter unmountOnExit> */}
          <AppBar position="fixed" color="primary" className={classes.appBar}>
            <Toolbar>
              <CustomizedSlider />
              <div style={{ width: "65%" }}>
                <div className={classes.root}>
                  <ButtonGroup
                    size="large"
                    variant="contained"
                    color="primary"
                    aria-label="large outlined primary button group"
                  >
                    <Button
                      style={{
                        backgroundColor:
                          AutographaStore.layout === 1 ? "#000096" : "",
                      }}
                      onClick={() => handleChange(1)}
                    >
                      2x
                      <ChromeReaderModeIcon className={classes.layout} />
                    </Button>
                    <Button
                      style={{
                        backgroundColor:
                          AutographaStore.layout === 2 ? "#000096" : "",
                      }}
                      onClick={() => handleChange(2)}
                    >
                      3x
                      <ChromeReaderModeIcon className={classes.layout} />
                    </Button>
                    <Button
                      style={{
                        backgroundColor:
                          AutographaStore.layout === 3 ? "#000096" : "",
                      }}
                      onClick={() => handleChange(3)}
                    >
                      4x
                      <ChromeReaderModeIcon className={classes.layout} />
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
              <div style={{ width: "18%", color: "#000" }}>
                <span
                  id="saved-time"
                  style={{ color: "#000", margin: "10px", float: "left" }}
                >
                  {AutographaStore.transSaveTime
                    ? `Saved ${AutographaStore.transSaveTime}`
                    : ""}
                </span>
                <Button
                  className={classes.save}
                  variant="contained"
                  color="primary"
                  onClick={props.onSave}
                >
                  <SaveIcon style={{ marginRight: "2px" }} />
                  Save
                </Button>
              </div>
            </Toolbar>
          </AppBar>
          {/* </Slide> */}
        </React.Fragment>
      )}
    </Observer>
  );
}
