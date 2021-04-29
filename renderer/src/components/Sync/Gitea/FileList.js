/* eslint-disable no-alert */
import React, { useContext } from 'react';
import {
 Paper, Stepper, StepButton, Divider, List, ListItem, ListItemText, ListItemIcon,
} from '@material-ui/core';
import {
  AuthenticationContext,
  RepositoryContext,
  createContent, readContent, get,
} from 'gitea-react-toolkit';
import PropTypes from 'prop-types';
import FolderOpenOutlinedIcon from '@material-ui/icons/FolderOpenOutlined';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import Dropzone from '../Dropzone/Dropzone';
import * as logger from '../../../logger';

const FileList = ({ data, onDrop, changeRepo }) => {
  const [projects, setProjects] = React.useState([]);
  const [files, setFiles] = React.useState([]);
  const [activeStep, setActiveStep] = React.useState();
  const [steps, setSteps] = React.useState([]);
  const { state: auth, component: authComponent } = useContext(
    AuthenticationContext,
  );
  const { state: repo, component: repoComponent } = useContext(
    RepositoryContext,
  );
  const fetchTree = async (treeUrl, projectName) => {
    logger.debug('Dropzone.js', 'calling fetchTree event');
    const step = steps;
    const found = steps.find((s) => s.url === treeUrl && s.name === projectName);
    if (found === undefined) {
      step.push({ url: treeUrl, name: projectName });
      setActiveStep(step.length);
      setSteps(step);
    }
    const url = treeUrl;
    const tree = [];
    const blob = [];
    const response = await get({ url, config: auth.config });
    response.tree.forEach((list) => {
      if (list.type === 'blob') {
        blob.push(list);
      }
      if (list.type === 'tree') {
        tree.push(list);
      }
    });
    logger.debug('Dropzone.js', 'sending the list of Trees and Blobs');
    setProjects(tree);
    setFiles(blob);
  };
  const getPath = (filename) => {
    logger.debug('Dropzone.js', 'calling getPath event');
    const arr = [];
    if (steps.length > 1) {
      steps.forEach((s) => {
        arr.push(s.name);
      });
      arr.shift();
    }
    arr.push(filename);
    logger.debug('Dropzone.js', 'returning path with filename');
    return (arr.join('/'));
  };
  const readData = (value) => {
    logger.debug('Dropzone.js', 'calling readData event');
    const filePath = getPath(value.path);
    const reads = readContent(
      {
        config: auth.config,
        owner: auth.user.login,
        repo: repo.name,
        ref: 'master',
        filepath: filePath,
      },
    );
    reads.then((result) => {
      logger.debug('Dropzone.js', 'sending the data from Gitea with content');
      onDrop({ result: { ...result, from: 'gitea' } });
    });
  };
  const handleDrop = () => {
    logger.debug('Dropzone.js', 'calling handleDrop event');
    if (data?.result?.from === 'autographa') {
      logger.debug('Dropzone.js', 'fata send from Autographa');
      const filePath = getPath(data.result.filename);
      const result = createContent({
        config: auth.config,
        owner: auth.user.login,
        repo: repo.name,
        branch: 'master',
        filepath: filePath,
        content: data.result.content,
        message: 'Testing createContent via AG using Gitea-React-Toolkit',
        author: {
          email: auth.user.email,
          username: auth.user.username,
        },
      });
      result.then(() => {
        logger.debug('Dropzone.js', 'file uploaded to Gitea');
        alert('success');
      })
      .catch((err) => {
        logger.debug('Dropzone.js', 'failed to upload file to Gitea');
        alert(err);
      });
    }
  };
  const handleStep = (step) => () => {
    logger.debug('Dropzone.js', 'calling handleStep event');
    steps.splice(step + 1, steps.length);
    setSteps(steps);
    setActiveStep(step + 1);
    fetchTree(steps[step].url, steps[step].name);
  };
  const cleanRepo = () => {
    logger.debug('Dropzone.js', 'calling cleanRepo to change the Repo');
    setFiles([]);
    setProjects([]);
    setSteps([]);
    changeRepo();
  };
  React.useEffect(() => {
    if (files.length === 0 && projects.length === 0) {
      if (repo) {
        fetchTree(`${auth.config.server}/${repo?.tree_url}`, repo.name);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo?.tree_url]);
  return (
    (!auth && authComponent)
    || (!repo && repoComponent)
    || (
    <>
      <Paper>
        <Stepper nonLinear activeStep={activeStep}>
          <StepButton onClick={cleanRepo}>Gitea Project</StepButton>
          {steps.map((label, index) => (
            <StepButton onClick={handleStep(index)}>
              {label.name}
            </StepButton>
          ))}
        </Stepper>
        <Divider />
        <List
          id="project-id"
          component="nav"
          aria-label="mailbox folders"
        >
          {projects.map((project) => (
            <ListItem
              button
              divider
              key={project.path}
              onClick={() => fetchTree(project.url, project.path)}
            >
              <ListItemIcon>
                <FolderOpenOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={project.path} />
            </ListItem>
          ))}
        </List>
        <List component="nav" aria-label="mailbox folders">
          {files.map((val, i) => (
            <ListItem
              button
              divider
              key={val[i]}
              draggable
              onDragEnd={() => readData(val)}
            >
              <ListItemIcon>
                <InsertDriveFileOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={val.path} />
            </ListItem>
          ))}
        </List>
        <Dropzone dropped={handleDrop} />
      </Paper>

    </>
    )
  );
};
export default FileList;
FileList.propTypes = {
    /** State which has datas. */
    onDrop: PropTypes.object,
    content: PropTypes.string,
    data: PropTypes.object,
    changeRepo: PropTypes.func,
  };
