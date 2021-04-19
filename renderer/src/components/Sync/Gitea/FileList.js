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

const FileList = ({ data, onDrop }) => {
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
    const step = steps;
    const found = steps.find((s) => s.url === treeUrl && s.name === projectName);
    if (found === undefined) {
      step.push({ url: treeUrl, name: projectName });
      setActiveStep(step.length - 1);
      setSteps(step);
    }
    const url = treeUrl;
    const config1 = {
      server: 'https://git.door43.org',
      tokenid: 'Gitea AG Testing',
    };
    const tree = [];
    const blob = [];
    const response = await get({ url, config: config1 });
    response.tree.forEach((list) => {
      if (list.type === 'blob') {
        blob.push(list);
      }
      if (list.type === 'tree') {
        tree.push(list);
      }
    });
    setProjects(tree);
    setFiles(blob);
  };
  const getPath = (filename) => {
    const arr = [];
    if (steps.length > 1) {
      steps.forEach((s) => {
        arr.push(s.name);
      });
      arr.shift();
    }
    arr.push(filename);
    return (arr.join('/'));
  };
  const readData = (value) => {
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
      // send the result
      onDrop({ result: { ...result, from: 'gitea' } });
    });
  };
  const handleDrop = () => {
    console.log(repo.owner.username, repo.name, data);
    if (data?.result?.from === 'autographa') {
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
      result.then(() => alert('success'))
      .catch((err) => alert(err));
    }
  };
  const handleStep = (step) => () => {
    steps.splice(step + 1, steps.length);
    setSteps(steps);
    setActiveStep(step);
    fetchTree(steps[step].url, steps[step].name);
  };

  React.useEffect(() => {
    if (files.length === 0 && projects.length === 0) {
      if (repo) {
        fetchTree(`https://git.door43.org/${repo?.tree_url}`, 'Gitea Project');
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
  };
