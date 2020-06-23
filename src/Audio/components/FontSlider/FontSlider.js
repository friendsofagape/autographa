import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 100 + theme.spacing(3) * 2,
  },
  margin: {
    height: theme.spacing(1),
  },
  plus: {
    fontSize: 20,
    float: "right",
    marginLeft: 15,
    position: "absolute",
    backgroundColor: "#3F5274",
    color: "#FFFF",
    fontWeight: "bolder",
  },
  minus: {
    float: "left",
    position: "fixed",
    left: 2,
    backgroundColor: "#3F5274",
    color: "#FFFF",
    marginTop: 3,
    fontWeight: "bolder",
  },
}));

function ValueLabelComponent(props) {
  const { children, open, value } = props;
  var elements = document.getElementsByClassName("col-ref").length - 1;
  for (var i = 0; i <= elements; i++) {
    document.getElementsByClassName("col-ref")[i].style.fontSize = value + "px";
    let colRef = document.getElementsByClassName("col-ref")[i];
    let verseNum = colRef.getElementsByClassName("verse-num");
    for (let i = 0; i < verseNum.length; i++) {
      verseNum[i].style.fontSize = value - 4 + "px";
    }
  }
  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

const iOSBoxShadow =
  "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)";

const FontSlider = withStyles({
  root: {
    color: "#3880ff",
    height: 2,
    padding: "15px 0",
  },
  thumb: {
    height: 28,
    width: 28,
    backgroundColor: "#fff",
    boxShadow: iOSBoxShadow,
    marginTop: -14,
    marginLeft: -14,
    "&:focus,&:hover,&$active": {
      boxShadow:
        "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)",
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        boxShadow: iOSBoxShadow,
      },
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 11px)",
    top: -22,
    "& *": {
      background: "transparent",
      color: "#000",
    },
  },
  track: {
    height: 2,
  },
  rail: {
    height: 2,
    opacity: 0.5,
    backgroundColor: "#bfbfbf",
  },
  mark: {
    backgroundColor: "#bfbfbf",
    height: 8,
    width: 1,
    marginTop: -3,
  },
  markActive: {
    opacity: 1,
    backgroundColor: "currentColor",
  },
})(Slider);

export default function CustomizedSlider() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.margin} />
      <span className={classes.minus}>A-</span>
      <span>
        <FontSlider
          ValueLabelComponent={ValueLabelComponent}
          aria-label="custom thumb label"
          defaultValue={15}
          min={14}
          max={40}
        />
      </span>
      <span className={classes.plus}>A+</span>
    </div>
  );
}
