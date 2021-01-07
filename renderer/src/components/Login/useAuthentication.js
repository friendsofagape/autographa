import * as localForage from 'localforage';
import React from 'react';
import * as logger from '../../logger';

const jwt = require('jsonwebtoken');

function useAuthentication() {
  const [accessToken, setaccessToken] = React.useState();
  const [currentUser, setCurrentUser] = React.useState();
  const getToken = () => {
    logger.debug('useAuthentication.js', 'In getToken to check any token stored in localStorage');
    localForage.getItem('sessionToken').then((value) => {
      setaccessToken(value);
    });
  };
  const handleUser = () => {
    logger.debug('useAuthentication.js', 'In handleUser to retrieve the user from the Token');
    jwt.verify(accessToken, 'agv2', (err, decoded) => {
      localForage.getItem('users').then((user) => {
        const obj = user.find(
          (u) => u.email === decoded.sessionData.user,
        );
        setCurrentUser(obj);
      });
    });
  };
  const generateToken = (user) => {
    logger.debug('useAuthentication.js', 'In generateToken to generate a Token for the loggedIn user');
    const sessionData = {
      user: user.email,
      loggedAt: Date(),
      active: true,
      remember: true,
    };
    // console.log(process.env.REACT_APP_AG_JWT)
    const token = jwt.sign({ sessionData }, 'agv2');
    if (token) {
      localForage.setItem('sessionToken', token);
      setaccessToken(token);
    }
  };
  const logout = () => {
    setaccessToken();
    setCurrentUser();
    localForage.removeItem('sessionToken');
  };
  React.useEffect(() => {
    if (accessToken && !currentUser) {
      handleUser();
    }
  });
  const response = {
    state: { accessToken, currentUser },
    actions: { getToken, generateToken, logout },
  };
  return response;
}
export default useAuthentication;
