import * as React from 'react';
import PropTypes from 'prop-types';
import CreateProjectAccordions from '../CreateProject/CreateProjectAccordions';
import Profile from '../Profile';
import List from '../../Sync/List';
import Projects from '../Projects/StarredProjects';

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
          return <CreateProjectAccordions />;
        default:
          return null;
      }
    })()}
  </>
);
ProjectsNav.propTypes = {
  title: PropTypes.string.isRequired,
};