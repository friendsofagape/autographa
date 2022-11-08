/* eslint-disable react/jsx-no-constructed-context-values */
import React from 'react';
import PropTypes from 'prop-types';
import useSync from './useSync';

export const SyncContext = React.createContext();

const SyncContextProvider = ({ children }) => {
  const { state, actions } = useSync();
  const context = {
    states: state,
    action: actions,
  };
  return (
    <SyncContext.Provider value={context}>
      {children}
    </SyncContext.Provider>
  );
};
export default SyncContextProvider;
SyncContextProvider.propTypes = {
  children: PropTypes.node,
};
