import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper, Grid, Tabs, Tab, FormControl, Typography,
} from '@material-ui/core';
import * as localForage from 'localforage';
import { useRouter } from 'next/router';
import * as logger from '../../logger';
import { isElectron } from '../../core/handleElectron';
import CustomLogin from './CustomLogin';
import { AuthenticationContext } from './AuthenticationContextProvider';
import { createUser, handleLogin } from '../../core/handleLogin';

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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Login() {
  const router = useRouter();
  const classes = useStyles();
  const online = {
    textfield: {
      count: [{ label: 'Username', type: 'text' },
      { label: 'Password', type: 'password' }],
    },
    viewForgot: true,
  };
  const offline = {
    autocomplete: { count: [{ label: 'Username' }] },
    viewForgot: false,
  };
  const tab = React.useState(!!isElectron());
  const [users, setUsers] = React.useState([]);
  const { action: { generateToken } } = React.useContext(AuthenticationContext);
  const [tabvalue, setTabValue] = React.useState(0);
  const [ui, setUi] = React.useState(isElectron() ? offline : online);
  const [valid, setValid] = React.useState({ username: false, password: false });
  const [errorMsg, setErrorMsg] = React.useState();
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    setUi(newValue === 0 ? offline : online);
  };
  useEffect(() => {
    if (users.length === 0) {
      localForage.getItem('users').then((user) => {
        if (user) {
          setUsers(user);
        }
      });
    }
  }, [users]);
  const handleValidation = (values) => {
    let user;
    let pass;
    if (values.username) {
      user = true;
    } else {
      setErrorMsg('Enter username');
      user = false;
    }
    if (values.password) {
      pass = true;
    } else if (!values.password && tab[0] === true) {
      pass = true;
    } else {
      setErrorMsg('Enter Password');
      pass = false;
    }
    setValid({ ...valid, username: !user, password: !pass });
    return user && pass;
  };
  const handleSubmit = (values) => {
    logger.debug('Login.js', 'In handleSubmit');
    if (!isElectron()) {
      router.push('/login');
    } else if (handleValidation(values)) {
      const fs = window.require('fs');
      logger.debug('Login.js', 'Triggers handleLogin to check whether the user is existing or not');
      const user = handleLogin(users, values);
      if (user) {
        logger.debug('Login.js', 'Triggers generateToken to generate a Token for the user');
        generateToken(user);
      } else {
        logger.debug('Login.js', 'Triggers createUser for creating a new user');
        createUser(values, fs)
          .then((val) => {
            logger.debug('Login.js', 'Triggers generateToken to generate a Token for the user');
            generateToken(val);
          });
      }
    }
  };
  return (
    <>
      <Grid container className={classes.root} justify="flex-end">
        <Grid item xs={12} sm={8} md={5}>
          <Paper className={classes.paper} elevation={5} square>
            {tab[0] && (
            <Tabs
              value={tabvalue}
              title="OfflineOnline"
              data-testid="tabs"
              indicatorColor="primary"
              textColor="primary"
              onChange={handleChange}
              aria-label="disabled tabs example"
            >
              <Tab label="Offline" {...a11yProps(0)} />
              <Tab label="Online" {...a11yProps(1)} />
            </Tabs>
            )}
            <FormControl>
              <Typography variant="h5" gutterBottom>
                Welcome!
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Welcome back! Login to access Autographa
              </Typography>
              <Typography color="error">{errorMsg}</Typography>
              <CustomLogin
                ui={ui}
                error={valid}
                login={handleSubmit}
                userlist={users}
              />
              {ui?.viewForgot === true && (
              <Typography variant="caption" gutterBottom>
                Don&apos;t have an account?
                <a data-testid="signup" href="/signup">Sign Up</a>
              </Typography>
                )}
            </FormControl>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
