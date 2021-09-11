import React from 'react';
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
  React.useEffect(() => {
    logger.debug('Home.js', 'Triggers loadUsers for the users list');
    const fs = window.require('fs');
    loadUsers(fs);
  }, []);
  React.useEffect(() => {
    if (!states.accessToken) {
      logger.debug('Home.js', 'Triggers getToken to fetch the Token if available');
      action.getToken();
    }
  });
  return (
    <>
      {states.accessToken
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
        : <Login />}
    </>
  );
};
export default Home;
