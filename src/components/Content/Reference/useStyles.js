import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    float: "left",
    "& > *": {
      margin: "0px",
      width: "50vw",
      // height: '100vh',
      paddingTop: "8px",
    },
  },
  ref_drop_down: {
    left: "30%",
    backgroundColor: "#3F519D",
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    width: "166px",
    borderRadius: "6px",
    height: "34px",
    paddingLeft: "9px",
    borderBottom: "none",
  },
  listroot: {
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
  parentdiv: {
    width: "100%",
    float: "left",
  },
  layoutx: {
    width: "50%",
    float: "left",
  },
  layout2x: {
    width: "33.33%",
    float: "left",
  },
  layout3x: {
    width: "25%",
    float: "left",
  },
}));
