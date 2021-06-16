import * as React from 'react';
import PropTypes from 'prop-types';
import NewProject from '@/modules/projects/NewProject';
import Sync from '../../../modules/projects/Sync';
import Projects from '../Projects/StarredProjects';

export const ProjectsNav = ({ title }) => (
  <>
    {(() => {
      switch (title) {
        case 'Sync':
          return <Sync />;
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
