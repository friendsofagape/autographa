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
      count: [{ label: 'Username', type: 'text', name: 'identifier' },
      { label: 'Password', type: 'password', name: 'password' }],
    },
    viewForgot: true,
  };
  const offline = {
    autocomplete: { count: [{ label: 'Username' }] },
    viewForgot: false,
  };
  const tab = React.useState(!!isElectron());
  const [users, setUsers] = React.useState([]);
  const {
    states: { config },
    action: { generateToken, getConfig },
  } = React.useContext(AuthenticationContext);
  const [tabvalue, setTabValue] = React.useState(0);
  const [ui, setUi] = React.useState(isElectron() ? offline : online);
  const [valid, setValid] = React.useState({ username: false, password: false });
  const [errorMsg, setErrorMsg] = React.useState();
  const [token, setToken] = React.useState();
  const [error, setError] = React.useState({
    identifier: '', password: '', msg: '',
  });
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    setUi(newValue === 0 ? offline : online);
  };
  // The below code is commented for UI dev purpose.
  // useEffect(() => {
  //   if (users.length === 0) {
  //     localForage.getItem('users').then((user) => {
  //       if (user) {
  //         setUsers(user);
  //       }
  //     });
  //   }
  // }, [users]);
  // useEffect(() => {
  //   if (!isElectron()) {
  //     // window is accessible here.
  //     const url = window.location.href;
  //     const regex = /(.*)login\?flow=/gm;
  //     getConfig(url.replace(regex, ''));
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  useEffect(() => {
    if (config) {
      // eslint-disable-next-line prefer-const
      let err = {};
      err.msg = config?.messages?.[0]?.text;
      (config.fields).forEach((field) => {
        if (field.name === 'csrf_token') {
          setToken(field.value);
        } else {
          err[field.name] = field.messages?.[0].text;
        }
      });
      setError(err);
    }
  }, [config]);
  const handleValidation = (values) => {
    let user;
    if (values.username) {
      user = true;
    } else {
      setErrorMsg('Enter username');
      user = false;
    }
    setValid({ ...valid, username: !user });
    return user;
  };
  const handleSubmit = async (values) => {
    logger.debug('Login.js', 'In handleSubmit');
    if (isElectron() && tabvalue === 0) {
      router.push('/main');
      // The below code is commented for UI dev purpose.
      // if (handleValidation(values)) {
      //   const fs = window.require('fs');
      //   logger.debug('Login.js', 'Triggers handleLogin to check whether the user is existing or not');
      //   const user = handleLogin(users, values);
      //   if (user) {
      //     logger.debug('Login.js', 'Triggers generateToken to generate a Token for the user');
      //     generateToken(user);
      //   } else {
      //     logger.debug('Login.js', 'Triggers createUser for creating a new user');
      //     createUser(values, fs)
      //       .then((val) => {
      //         logger.debug('Login.js', 'Triggers generateToken to generate a Token for the user');
      //         generateToken(val);
      //       });
      //   }
      // }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (isElectron()) {
        router.push('/main');
        // const requestOptions = {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: document.aglogin,
        // };
        // fetch(config?.action, requestOptions)
        //   .then((response) => response.json())
        //   .then((data) => console.log(data));
      } else {
        router.push('/main');
        // The below code is commented for UI dev purpose.
        // document.aglogin.action = config.action;
        // document.aglogin.method = config.method;
        // // eslint-disable-next-line prefer-const
        // let input = document.createElement('input');
        //   input.setAttribute('type', 'hidden');
        //   input.setAttribute('name', 'csrf_token');
        //   input.setAttribute('value', token);
        // document.aglogin.appendChild(input);
        // document.aglogin.submit();
      }
      // router.push('/login');
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
                validation={error}
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
