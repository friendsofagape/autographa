import React from 'react';
import PropTypes from 'prop-types';
import useAuthentication from './useAuthentication';

export const AuthenticationContext = React.createContext();

const AuthenticationContextProvider = ({ children }) => {
  const { state, actions } = useAuthentication();
  const context = {
    states: state,
    action: actions,
  };
  return (
    <AuthenticationContext.Provider value={context}>
      {children}
    </AuthenticationContext.Provider>
  );
};
export default AuthenticationContextProvider;
AuthenticationContextProvider.propTypes = {
  children: PropTypes.node,
};
