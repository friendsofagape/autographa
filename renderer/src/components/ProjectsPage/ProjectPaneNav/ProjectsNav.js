import * as React from 'react';
import PropTypes from 'prop-types';
import Profile from '../Profile/Profile';
import List from '../../Sync/List';
import Projects from '../Projects/StarredProjects';
import NewProject from '../CreateProject/NewProject';

export const ProjectsNav = ({ title }) => (
  <>
    {(() => {
      switch (title) {
        case 'Profile':
          return <Profile />;
        case 'Sync':
          return <List />;
        case 'Projects':
          return <Projects />;
        case 'New':
          return <NewProject />;
        default:
          return null;
      }
    })()}
  </>
);
ProjectsNav.propTypes = {
  title: PropTypes.string.isRequired,
};
