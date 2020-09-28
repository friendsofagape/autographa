import { makeStyles } from "@material-ui/core/styles";

export const ProfileStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
    textfieldsmall: {
      textAlign: "center",
      marginLeft: theme.spacing(1),
      margin: theme.spacing(3),
      width: 300,
    },
    textfieldlong: {
      textAlign: "center",
      marginLeft: theme.spacing(1),
      margin: theme.spacing(3),
      width: 635,
    },
    personalinfo: {
      margin: theme.spacing(3),
      float: "center",
    },
    avatarlarge: {
      width: theme.spacing(30),
      height: theme.spacing(30),
      marginLeft: theme.spacing(5),
      marginTop: theme.spacing(20),
    },
    avataredits: {
      marginLeft: theme.spacing(14),
    },
    save: {
      float: "right",
    },
}));