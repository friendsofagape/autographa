/* eslint-disable */
import * as localForage from 'localforage';
import React from 'react';
import { Configuration, PublicApi } from '@ory/kratos-client';
import * as logger from '../../logger';
// import configData from '../../config.json';
// import { isElectron } from '../../core/handleElectron';
const jwt = require('jsonwebtoken');
import { useRouter } from 'next/router';
// const kratos = new PublicApi(new Configuration({ basePath: configData.base_url }));

function useAuthentication() {
  const [accessToken, setaccessToken] = React.useState();
  const [currentUser, setCurrentUser] = React.useState();
  const [config, setConfig] = React.useState();
  const router = useRouter();
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
          (u) => u.username === decoded.sessionData.user,
        );
        setCurrentUser(obj);
        localForage.setItem('userProfile',obj);
        localForage.setItem('appMode','offline');
      });
    });
  };
  const generateToken = (user) => {
    logger.debug('useAuthentication.js', 'In generateToken to generate a Token for the loggedIn user');
    const sessionData = {
      user: user.username,
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
    localForage.removeItem('userProfile');
    localForage.setItem('appMode','online');
    router.push('/');
  };
  const getConfig = (flowId) => {
    logger.debug('useAuthentication.js', 'getConfig fetch the config from the Kratos using flowID');
    kratos.getSelfServiceLoginFlow(flowId)
      .then(({ data: flow }) => {
        setConfig(flow?.methods?.password?.config);
      });
  };
  // Below code is of Online app
  // React.useEffect(() => {
  //   if (isElectron()) {
  //     kratos.initializeSelfServiceLoginViaAPIFlow().then(({ data: flow }) => {
  //       logger.debug('useAuthentication.js', 'Calling getConfig using flowID');
  //       getConfig(flow.id);
  //     });
  //   }
  // }, []);
  React.useEffect(() => {
    if (accessToken && !currentUser) {
      handleUser();
    }
  });
  const response = {
    state: { accessToken, currentUser, config },
    actions: {
      getToken, generateToken, logout, getConfig,
    },
  };
  return response;
}
export default useAuthentication;
