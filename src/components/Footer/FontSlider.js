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
    AutographaStore.currentFontValue = newValue;
  };

  const fontChange = (multiplier) => {
    let fontSize = AutographaStore.fontMin;
    if (multiplier < 0) {
      if (value <= AutographaStore.fontMin) {
        fontSize = AutographaStore.fontMin;
        AutographaStore.currentFontValue = fontSize;
      } else {
        fontSize = multiplier + value;
        AutographaStore.currentFontValue = fontSize;
      }
    } else {
      if (multiplier + value >= AutographaStore.fontMax) {
        fontSize = AutographaStore.fontMax;
        AutographaStore.currentFontValue = fontSize;
      } else {
        fontSize = multiplier + value;
        AutographaStore.currentFontValue = fontSize;
      }
    }
    AutographaStore.currentFontValue = fontSize;
    setValue(fontSize);
  };
  return (
    <div data-test="component-customized-slider" className={classes.root}>
      <span>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <span>
              <Button
                data-testid="decrement-button"
                onClick={() => fontChange(-2)}
                variant="contained"
              >
                A-
              </Button>
            </span>
          </Grid>
          <Grid item xs>
            <Slider
              min={15}
              max={50}
              data-testid="Sliderbutton"
              color="secondary"
              valueLabelDisplay={"auto"}
              value={value}
              onChange={handleSliderChange}
              aria-labelledby="input-slider"
            />
          </Grid>
          <Grid item>
            <span>
              <Button
                data-testid="increment-button"
                id="Inc"
                value={value}
                onClick={() => fontChange(+2)}
                variant="contained"
              >
                A+
              </Button>
            </span>
          </Grid>
        </Grid>
      </span>
    </div>
  );
}
