/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import * as localForage from 'localforage';
import Login from './components/Login/Login';
import AuthenticationContextProvider, { AuthenticationContext } from './components/Login/AuthenticationContextProvider';
import { loadUsers } from './core/Login/handleJson';
import ProjectContextProvider from './components/context/ProjectContext';
import ReferenceContextProvider from './components/context/ReferenceContext';
import * as logger from './logger';
import ProjectList from './modules/projects/ProjectList';
import AutographaContextProvider from './components/context/AutographaContext';
import ScribexContextProvider from './components/context/ScribexContext';

const Home = () => {
  const { states, action } = React.useContext(AuthenticationContext);
  const [token, setToken] = React.useState();
  const [user, setUser] = React.useState();
  React.useEffect(() => {
    logger.debug('Home.js', 'Triggers loadUsers for the users list');
    const fs = window.require('fs');
    loadUsers(fs);
  }, []);
  React.useEffect(() => {
    if (!states.accessToken) {
      logger.debug('Home.js', 'Triggers getToken to fetch the Token if not available');
      action.getToken();
      setToken();
    } else {
      logger.debug('Home.js', 'Token is available');
      localForage.getItem('sessionToken').then((value) => {
        if (!value) {
          action.setaccessToken();
        }
        setToken(value);
      });
    }
    localForage.getItem('users').then((user) => {
      if (user.length !== 0) {
        const newuser = user[0].username;
        setUser(newuser);
      } else {
        localForage.removeItem('sessionToken');
      }
    });
  }, [setToken, user, setUser, action, states.accessToken]);
  return (
    <>
      {token && user
        ? (
          <AuthenticationContextProvider>
            <ProjectContextProvider>
              <ReferenceContextProvider>
                <AutographaContextProvider>
                  <ScribexContextProvider>
                    <ProjectList />
                  </ScribexContextProvider>
                </AutographaContextProvider>
              </ReferenceContextProvider>
            </ProjectContextProvider>
          </AuthenticationContextProvider>
        )
        : <Login />}
    </>
  );
};
export default Home;
