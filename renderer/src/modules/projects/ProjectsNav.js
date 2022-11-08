import * as React from 'react';
import PropTypes from 'prop-types';
import UserProfile from './Profile';
import Sync from './Sync';
import ProjectList from './ProjectList';
import NewProject from './NewProject';

export const ProjectsNav = ({ renderComponent }) => (

  <>
    {(() => {
      switch (renderComponent) {
        case 'Profile':
          return <UserProfile />;
        case 'Sync':
          return <Sync />;
        case 'Projects':
          return <ProjectList />;
        case 'New':
          return <NewProject />;
        default:
          return null;
      }
    })()}
  </>
);
ProjectsNav.propTypes = {
  renderComponent: PropTypes.string.isRequired,
};
