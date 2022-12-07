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

const Home = () => {
  const { states, action } = React.useContext(AuthenticationContext);
  const [token, setToken] = React.useState();

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
  }, [setToken, action, states.accessToken]);
  return (
    <>
      {token && states?.currentUser?.username
        ? (
          <AuthenticationContextProvider>
            <ProjectContextProvider>
              <ReferenceContextProvider>
                <AutographaContextProvider>
                  <ProjectList />
                </AutographaContextProvider>
              </ReferenceContextProvider>
            </ProjectContextProvider>
          </AuthenticationContextProvider>
        )
        : <Login setToken={setToken}/>
      }
    </>
  );
};
export default Home;
