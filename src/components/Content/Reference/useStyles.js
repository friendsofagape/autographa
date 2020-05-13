import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      backgroundColor: "#f5f8fa",
      margin: "0px",
      width: "50vw",
      // height: '100vh',
      paddingTop: "26px",
      borderRight: "1px solid #d3e0e9",
    },
  },
  ref_drop_down: {
    backgroundColor: "#0b82ff",
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    width: "166px",
    borderRadius: "6px",
    height: "34px",
    paddingLeft: "9px",
  },
}));
