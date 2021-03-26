import { Button } from '@material-ui/core';
import React from 'react';
import ApplicationBar from '../../ApplicationBar/ApplicationBar';
import { ProjectContext } from '../ProjectsContext/ProjectContext';
import CreateProjectAccordions from './CreateProjectAccordions';
import { isElectron } from '../../../core/handleElectron';
import saveProjectsMeta from '../../../core/projects/saveProjetcsMeta';
import { AutographaContext } from '../../AutogrpahaContext/AutographaContext';

const style = { top: '65px', width: 'inherit', left: '153px' };

export default function NewProject() {
  const {
    states: {
      newProjectFields,
      selectedVersion,
      license,
      canonSpecification,
      content,
      versificationScheme,
    },
    actions: {
      resetProjectStates,
      setSideTabTitle,
    },
   } = React.useContext(ProjectContext);
   const {
    action: {
      FetchProjects,
    },
   } = React.useContext(AutographaContext);
  const createNewProject = (e) => {
    e.preventDefault();
        if (isElectron()) {
          let status;
            try {
            // eslint-disable-next-line no-unused-vars
            status = saveProjectsMeta(
                newProjectFields,
                selectedVersion,
                license,
                canonSpecification,
                content,
                versificationScheme,
              );
            } finally {
              // To display the status of meta save
              // console.log(status);
              resetProjectStates();
              setSideTabTitle('Projects');
              localStorage.setItem('_tabhistory', 'Projects');
              window.location.reload();
              FetchProjects();
            }
        }
  };

  const createProjectButton = (
    <Button
      variant="contained"
      secondary
      type="submit"
      onClick={(e) => createNewProject(e)}
    >
      Create
    </Button>
  );
    return (
      <div>
        <div>
          <ApplicationBar
            title="NEW PROJECT"
            theme="secondary"
            appBarStyle={style}
            buttons={createProjectButton}
          />
        </div>
        <CreateProjectAccordions />
      </div>
    );
}
