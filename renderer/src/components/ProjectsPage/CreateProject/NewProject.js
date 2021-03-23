import { Button } from '@material-ui/core';
import React from 'react';
import ApplicationBar from '../../ApplicationBar/ApplicationBar';
import { ProjectContext } from '../ProjectsContext/ProjectContext';
import CreateProjectAccordions from './CreateProjectAccordions';
import { isElectron } from '../../../core/handleElectron';

const style = { top: '65px', width: 'inherit', left: '153px' };

export default function NewProject() {
  const {
    states: {
      biblename,
      language,
      selectedVersion,
      scriptDirection,
      license,
      canonSpecification,
      content,
      versificationScheme,
    },
   } = React.useContext(ProjectContext);
  const createNewProject = () => {
        if (isElectron()) {
            console.log(localStorage.getItem('userPath'));
            const newpath = localStorage.getItem('userPath');
            const fs = window.require('fs');
            const path = require('path');
            fs.mkdirSync(path.join(newpath, 'autographa', 'userdata'), {
                recursive: true,
            });
        }
  };
//   if (!fs.existsSync(dirPath)){
//     fs.mkdirSync(dirPath, { recursive: true });
// }
  const createProjectButton = (
    <Button
      variant="contained"
      secondary
      onClick={() => createNewProject()}
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
