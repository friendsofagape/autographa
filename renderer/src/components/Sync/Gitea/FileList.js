import React, { useContext } from 'react';
import { Paper } from '@material-ui/core';
import {
  AuthenticationContext,
  RepositoryContext,
 Tree, createContent, readContent,
} from 'gitea-react-toolkit';
import PropTypes from 'prop-types';
// import Dropzone from '../DragDrop/Dropzone';

const FileList = () => {
  const { state: auth, component: authComponent } = useContext(
    AuthenticationContext,
  );
  const { state: repo, component: repoComponent } = useContext(
    RepositoryContext,
  );

const readData = (value) => {
    const reads = readContent(
        {
            config: auth.config,
            owner: auth.user.login,
            repo: repo.name,
            ref: 'master',
            filepath: value.filepath,
          },
    );
    reads.then((result) => {
        // do something with result
        console.log(result, atob(result.content));
     });
// .then((response) => alert(response.json))
// .catch((err) => alert(err));

    console.log(value);
// setData(value);
};
// const handleDrop = (props) => {
// // console.log(data, repo.owner.username, repo.name, props);
// // setDrop(props.drop);
// const result = createContent({
//         config: auth.config,
//         owner: auth.user.login,
//         repo: repo.name,
//         branch: 'master',
//         filepath: props.name,
//         content: props.content,
//         message: 'Testing createContent via AG using Gitea-React-Toolkit',
//         author: {
//           email: auth.user.email,
//           username: auth.user.username,
//         },
// });
// result.then((response) => alert('success'))
// .catch((err) => alert(err));
// };
  return (
    (!auth && authComponent)
    || (!repo && repoComponent)
    || (
    <>
      <Paper>
        <Tree
          selected
          url={`https://git.door43.org/${repo.tree_url}`}
          onBlob={(blob) => readData(blob)}
        />
      </Paper>
      {/* <Dropzone dropped={handleDrop} /> */}
    </>
    )
  );
};
export default FileList;
FileList.propTypes = {
    /** State which triggers login. */
    // drop: PropTypes.bool,
    // name: PropTypes.string,
    // content: PropTypes.string,
  };
