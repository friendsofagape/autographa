import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Link from 'next/link';
import Router from 'next/router';
import NProgress from 'nprogress';
import Switch from '@material-ui/core/Switch';
import Box from '@material-ui/core/Box';
import * as localForage from 'localforage';
import * as logger from '../../logger';
import { fetchJson } from '../../core/handleJson';
import { hash } from '../../core/hashing.';

Router.onRouteChangeStart = () => {
  NProgress.start();
};

Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    overflow: 'hidden',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

export default function Login() {
  const classes = useStyles();
  // const bgImage = ['img1', 'img2', 'img3'];
  // const [index, setIndex] = React.useState(0);
  // const bgImg = bgImage[index % bgImage.length];
  const [values, setValues] = React.useState({
    username: '',
    password: '',
    showPassword: false,
  });
  const [validUser, setValidUser] = React.useState(false);
  const [validPassword, setValidPassword] = React.useState(false);
  const [online, setOnline] = React.useState(true);
  const [users, setUsers] = React.useState();
  const [errorMsg, setErrorMsg] = React.useState();
  const [hashValue, setHashValue] = React.useState({});

  const handleValidation = () => {
    let user; let pass;
    if (values.username) {
      setValidUser(false);
      user = true;
    } else {
      setValidUser(true);
      user = false;
    }
    if (values.password) {
      setValidPassword(false);
      pass = true;
    } else if (!values.password && online === false) {
      setValidPassword(false);
      pass = true;
    } else {
      setValidPassword(true);
      pass = false;
    }
    return (user && pass);
  };
  const authUser = (pwd, key) => {
    const value = hash(pwd, key.salt);
    if (value.password === key.password) {
      return true;
    }
    return false;
  };
  const handleSubmit = () => {
    logger.error('login.js', 'error in sumitting');
    logger.warn('login.js', 'check for routing');
    logger.info('login.js', 'info for routing');
    logger.debug('login.js', 'info for routing');
    if (handleValidation()) {
      const logged = users.some((user) => {
        if (user.email === values.username) {
          setHashValue({ password: user.password, salt: user.salt });
          return true;
        }
        return false;
      });
      if (logged && online) {
        const check = authUser(values.password, hashValue);
        if (check) {
          Router.push('/login');
        } else {
          setErrorMsg('Invalid Password');
          setValidPassword(true);
        }
      } else if (logged && online === false) {
        Router.push('/login');
      } else {
        setErrorMsg('Not a user');
      }
    }
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
  const handleOnline = () => {
    setOnline(!online);
  };

  React.useEffect(() => {
    if (!users) {
    // Get the list of users from localForage:
      localForage.getItem('users').then((value) => {
        setUsers(value);
      }, []);
    }
    if (!users) {
      const fs = window.require('fs');
      fetchJson(fs);
    }
  });
  // useEffect(() => {
  //   const timer = setInterval(() => setIndex((i) => i + 1), 5000);
  //   return () => clearInterval(timer);
  // }, []);
  return (
    <div>
      <Grid container className={classes.root} justify="flex-end">
        <Grid item xs={12} sm={8} md={5}>
          <Paper className={classes.paper} elevation={5} square>
            <FormControl>
              <Typography variant="h5" gutterBottom>
                Welcome!
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Welcome back! Login to access Autographa
              </Typography>
              <Typography color="error">{errorMsg}</Typography>
              <Typography component="div">
                <Grid component="label" container alignItems="center" spacing={1}>
                  <Grid item>Offline</Grid>
                  <Grid item>
                    <Switch checked={online} onChange={handleOnline} name="online" />
                  </Grid>
                  <Grid item>Online</Grid>
                </Grid>
              </Typography>
              <Grid container spacing={1} alignItems="flex-end">
                <Grid item>
                  <PersonOutlineIcon />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    inputProps={{
                      'data-testid': 'username-textfield',
                    }}
                    className={classes.margin}
                    id="input-with-icon-textfield"
                    label="Email"
                    error={validUser}
                    onChange={handleUsername('username')}
                  />
                </Grid>
              </Grid>
              <Grid container component={Box} spacing={1} alignItems="flex-end" display={online === false ? 'none' : ''}>
                <Grid item>
                  <LockOpenIcon />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    className={classes.margin}
                    id="standard-adornment-password"
                    label="Password"
                    type={values.showPassword ? 'text' : 'password'}
                    value={values.password}
                    error={validPassword}
                    onChange={handlePassword('password')}
                    InputProps={{
                      'data-testid': 'password-textfield',
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
                {online === true ? 'Forgot Password?' : ''}
              </Typography>

              <Button
                data-testid="login-button"
                variant="contained"
                onClick={handleSubmit}
              >
                {/* <Link href="/login"> */}
                Login
                {/* </Link> */}
              </Button>
              <Typography variant="caption" gutterBottom>
                Don&apos;t have an account?
                <Link href="/signup">Sign Up</Link>
              </Typography>
            </FormControl>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
