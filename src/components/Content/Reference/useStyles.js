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
}));
