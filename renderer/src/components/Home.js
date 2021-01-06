import React from 'react';
import Main from './main';
import Login from './Login/Login';
import { AuthenticationContext } from './Login/AuthenticationContextProvider';
import { loadUsers } from '../core/handleJson';

const Home = () => {
  const { states, action } = React.useContext(AuthenticationContext);
  React.useEffect(() => {
    const fs = window.require('fs');
    loadUsers(fs);
  }, []);
  React.useEffect(() => {
    if (!states.accessToken) {
      action.getToken();
    }
  });
  return <div>{states.accessToken ? <Main /> : <Login />}</div>;
};
export default Home;
