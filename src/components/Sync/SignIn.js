import React, { useState } from "react";
import {
  Avatar,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  TextField,
} from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons";
import { useStyles } from "./useStyles";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import GetProjects from "./GetProjects";

const SingIn = (props) => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    syncProvider: props.syncProvider,
  });
  const [showPassword, setShowPassword] = useState(false);
  // const [error, setError] = useState("");
  // const [callList, setCallList] = useState(false);

  let user;

  const updateFormData = (event) => {
    const { type, name, value, checked } = event.target;
    const _formData = { ...formData };

    if (type === "checkbox") _formData[value] = checked;
    else _formData[name] = value;

    setFormData(_formData);
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // const handleError = (formData) => {
  //   console.log(formData);
  //   if (formData.username === null || formData.username === "") {
  //     console.log("formData.username");
  //     setError("Enter Username");
  //     return false;
  //   } else if (formData.password === null || formData.password === "") {
  //     console.log("formData.password");
  //     setError("Enter Password");
  //     return false;
  //   } else {
  //     return true;
  //   }
  //   // messages:{
  //   //     actionText = 'Login',
  //   //     genericError = 'Something went wrong, please try again.',
  //   //     usernameError = 'Username does not exist.',
  //   //     passwordError = 'Password is invalid.',
  //   //     networkError = 'There is an issue with your network connection. Please try again.',
  //   //     serverError = 'There is an issue with the server please try again.',
  //   //   }
  // };
  // const onSubmit = (formData) => {
  //   if (!handleError(formData)) return;
  //   console.log(formData);
  //   console.log("callList", callList);
  //   setCallList(!callList);
  // };
  return (
    <div className={classes.root}>
      <Avatar
        className={classes.avatar}
        src={user && user.avatar_url ? user.avatar_url : null}
      >
        <LockOutlined />
      </Avatar>
      <Typography component="h1" variant="h5">
        Login
      </Typography>
      {props.error ? (
        <Typography
          data-test="login-error-text"
          component="p"
          style={{ color: "red" }}
        >
          {props.error}
        </Typography>
      ) : (
        <></>
      )}
      <form className={classes.form}>
        <TextField
          name="username"
          type="text"
          label="Username"
          required
          variant="outlined"
          margin="normal"
          fullWidth
          autoComplete="username"
          disabled={!!user}
          defaultValue={user ? user.username : ""}
          onChange={updateFormData}
        />
        <FormControl className={classes.form} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword === true ? "text" : "password"}
            name="password"
            label="Password"
            required
            variant="outlined"
            margin="normal"
            fullWidth
            autoComplete="current-password"
            disabled={!!user}
            defaultValue={user ? user.username : ""}
            onChange={updateFormData}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword === true ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControlLabel
          data-test="remember-checkbox"
          label="Remember me"
          control={
            <Checkbox
              color="primary"
              value="remember"
              disabled={!!user}
              id={"remember-" + Math.random()}
              onChange={updateFormData}
            />
          }
        />
        <Button
          data-test={user ? "logout-button" : "submit-button"}
          type="button"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={() => {
            props.handleSubmit(formData);
          }}
        >
          LOGIN
        </Button>
        {/* {callList === true ? (
          <GetProjects
            syncProvider={formData.syncProvider}
            username={formData.username}
            password={formData.password}
            start={callList}
          />
        ) : null} */}
      </form>
    </div>
  );
};
export default SingIn;
