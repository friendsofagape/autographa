import React from 'react';
import Main from './components/main';
import Login from './components/Login/Login';
import { AuthenticationContext } from './components/Login/AuthenticationContextProvider';
import { loadUsers } from './core/handleJson';
import * as logger from './logger';

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
        ? <Main />
        : <Login />}
    </>
  );
};
export default Home;
