import React from 'react';
import PropTypes from 'prop-types';
import useProjectsSort from '../hooks/projects/useProjectsSort';

export const AutographaContext = React.createContext();

const AutographaContextProvider = ({ children }) => {
  const { state, actions } = useProjectsSort();
  const context = {
    states: state,
    action: actions,
  };
  return (
    <AutographaContext.Provider value={context}>
      {children}
    </AutographaContext.Provider>
  );
};
export default AutographaContextProvider;
AutographaContextProvider.propTypes = {
  children: PropTypes.node,
};
