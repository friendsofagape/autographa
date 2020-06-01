import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import AutographaStore from "../AutographaStore";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 250,
  },
  input: {
    width: 42,
  },
  margin: {
    height: theme.spacing(1),
  },
  plus: {
    fontSize: 20,
  },
  minus: {
    float: "left",
  },
}));

export default function CustomizedSlider() {
  const classes = useStyles();
  const [value, setValue] = React.useState(15);

  const handleSliderChange = (event, newValue) => {
    if (newValue > 14) setValue(newValue);
    var elements = document.getElementsByClassName("col-ref").length - 1;
    for (var i = 0; i <= elements; i++) {
      document.getElementsByClassName("col-ref")[i].style.fontSize =
        value + "px";
      let colRef = document.getElementsByClassName("col-ref")[i];
      let verseNum = colRef.getElementsByClassName("verse-num");
      for (let i = 0; i < verseNum.length; i++) {
        verseNum[i].style.fontSize = value - 4 + "px";
      }
    }
  };

  const fontChange = (multiplier) => {
    console.log(multiplier);
    var elements = document.getElementsByClassName("col-ref").length - 1;
    let fontSize = AutographaStore.fontMin;
    if (document.getElementsByClassName("col-ref")[0] !== undefined) {
      if (document.getElementsByClassName("col-ref")[0].style.fontSize === "") {
        document.getElementsByClassName("col-ref")[0].style.fontSize = "14px";
      } else {
        fontSize = parseInt(
          document.getElementsByClassName("col-ref")[0].style.fontSize
        );
      }
      if (multiplier < 0) {
        if (multiplier + fontSize <= AutographaStore.fontMin) {
          fontSize = AutographaStore.fontMin;
          AutographaStore.currentFontValue = fontSize;
        } else {
          fontSize = multiplier + fontSize;
          AutographaStore.currentFontValue = fontSize;
        }
      } else {
        if (multiplier + fontSize >= AutographaStore.fontMax) {
          fontSize = AutographaStore.fontMax;
          AutographaStore.currentFontValue = fontSize;
        } else {
          fontSize = multiplier + fontSize;
          AutographaStore.currentFontValue = fontSize;
        }
      }
      AutographaStore.currentFontValue = fontSize;
      setValue(fontSize);
      for (var i = 0; i <= elements; i++) {
        document.getElementsByClassName("col-ref")[i].style.fontSize =
          fontSize + "px";
        let colRef = document.getElementsByClassName("col-ref")[i];
        let verseNum = colRef.getElementsByClassName("verse-num");
        for (let i = 0; i < verseNum.length; i++) {
          verseNum[i].style.fontSize = fontSize - 4 + "px";
        }
      }
    }
  };
  return (
    <div className={classes.root}>
      <span>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <span>
              <Button onClick={() => fontChange(-2)} variant="contained">
                A-
              </Button>
            </span>
          </Grid>
          <Grid item xs>
            <Slider
              min={14}
              max={40}
              color="secondary"
              valueLabelDisplay={true}
              value={value}
              onChange={handleSliderChange}
              aria-labelledby="input-slider"
            />
          </Grid>
          <Grid item>
            <span>
              <Button onClick={() => fontChange(+2)} variant="contained">
                A+
              </Button>
            </span>
          </Grid>
        </Grid>
      </span>
    </div>
  );
}
