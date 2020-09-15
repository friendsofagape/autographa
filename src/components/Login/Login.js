import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    overflow: "hidden",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

export default function Login() {
  const classes = useStyles();
  const bgImage = ["img1", "img2", "img3"];
  const [index, setIndex] = useState(0);
  const bgImg = bgImage[index % bgImage.length];
  const [values, setValues] = useState({
    username: "",
    password: "",
    showPassword: false,
  });
  const [validUser, setValidUser] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const fieldValidity = () => {
    console.log("valid");
    if (values.username) {
      setValidUser(false);
    } else {
      setValidUser(true);
    }
    if (values.password) {
      setValidPassword(false);
    } else {
      setValidPassword(true);
    }
  };
  const handleSubmit = () => {
    console.log("click");
    fieldValidity();
    console.log(values);
  };
  const handleUsername = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handlePassword = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => i + 1), 5000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div
      style={{
        backgroundImage: `url(${bgImg})`,
      }}
    >
      <Grid container className={classes.root} justify="flex-end">
        <Grid item xs={12} sm={8} md={5}>
          <Paper className={classes.paper} elevation={6} square>
            <FormControl>
              <Typography variant="h5" gutterBottom>
                Welcome!
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Welcome back! Login to access Autographa
              </Typography>
              <Grid container spacing={1} alignItems="flex-end">
                <Grid item>
                  <PersonOutlineIcon />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    className={classes.margin}
                    id="input-with-icon-textfield"
                    label="Username"
                    onChange={handleUsername("username")}
                    error={validUser}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={1} alignItems="flex-end">
                <Grid item>
                  <LockOpenIcon />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    className={classes.margin}
                    id="standard-adornment-password"
                    label="Password"
                    type={values.showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handlePassword("password")}
                    error={validPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {values.showPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Typography variant="caption" align="right" gutterBottom>
                Forgot Password?
              </Typography>
              <Button variant="contained" onClick={handleSubmit}>
                Login
              </Button>
              <Typography variant="caption" gutterBottom>
                Don't have an account?
                <a href="/signup">Sign Up</a>
              </Typography>
            </FormControl>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
