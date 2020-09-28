import * as React from 'react';
import CreateProjectAccordions from '../CreateProject/CreateProjectAccordions';
import Profile from '../ProjectsPane/Profile';
import TableData from '../ProjectsPane/TableData';

export const ProjectsNav = ({ title }) => {
    return (
        <>
        {(() => {
          switch (title) {
            case 'Profile':
              return <Profile />;
            case 'Projects':
              return <TableData />;
            case 'Create New Project':
              return <CreateProjectAccordions />;
            default:
              return null;
          }
        })()}
      </>
    );
};