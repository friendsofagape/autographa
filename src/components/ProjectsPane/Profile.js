import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Typography,
  IconButton,
  Grid,
  TextField,
  Box,
  OutlinedInput,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import clsx from "clsx";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Avatar from "@material-ui/core/Avatar";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

const useStyles = makeStyles((theme) => ({
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
}));

const region = [
  { id: 1, place: "Delhi, India" },
  { id: 2, place: "Helsinki, Finland" },
  { id: 3, place: "New York, United States" },
  { id: 4, place: "Morocco, North Africa" },
];
const Language = [
  { id: 1, lang: "English" },
  { id: 2, lang: "Hindi" },
  { id: 3, lang: "Spanish" },
  { id: 4, lang: "Arabic" },
];

const Profile = () => {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Paper>
        <Grid container spacing={3}>
          <Grid item xs={2}></Grid>
          <Grid item xs>
            <Avatar
              src={require("../../static/images/avatar/1.jpg")}
              alt="My Avatar"
              className={classes.avatarlarge}
            />
            <div className={classes.avataredits}>
              <IconButton aria-label="delete">
                <EditIcon />
              </IconButton>
              <IconButton aria-label="delete">
                <DeleteForeverIcon />
              </IconButton>
            </div>
          </Grid>
          <Grid item xs={7}>
            <form
              className={classes.personalinfo}
              noValidate
              autoComplete="off"
            >
              <Typography
                className={classes.title}
                variant="h6"
                color="inherit"
              >
                <Box fontWeight={600} m={1}>
                  Personal Information
                </Box>
              </Typography>
              <TextField
                className={classes.textfieldsmall}
                label="First Name"
                variant="outlined"
              />
              <TextField
                className={classes.textfieldsmall}
                label="Last Name"
                variant="outlined"
              />
              <div>
                <TextField
                  className={classes.textfieldlong}
                  label="Email"
                  variant="outlined"
                />
              </div>
              <div>
                <FormControl
                  variant="outlined"
                  className={classes.textfieldlong}
                >
                  <Autocomplete
                    id="region"
                    options={region}
                    getOptionLabel={(option) => option.place}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Region"
                        variant="outlined"
                      />
                    )}
                  />
                </FormControl>
              </div>
              <div>
                <FormControl
                  className={
                    (clsx(classes.margin, classes.textField),
                    classes.textfieldlong)
                  }
                  variant="outlined"
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={values.showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange("password")}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {values.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    labelWidth={70}
                  />
                </FormControl>
              </div>
              <Typography
                className={classes.title}
                variant="h6"
                color="inherit"
              >
                <Box fontWeight={600} m={2}>
                  App Language
                </Box>
              </Typography>
              <div>
                <FormControl
                  variant="outlined"
                  className={classes.textfieldlong}
                >
                  <Autocomplete
                    id="region"
                    options={Language}
                    getOptionLabel={(option) => option.lang}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Language"
                        variant="outlined"
                      />
                    )}
                  />
                </FormControl>
              </div>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
export default Profile;
