import React from 'react';
import {
  AuthenticationContextProvider,
  RepositoryContextProvider,
} from 'gitea-react-toolkit';
// import FileHandle from './FileHandle';
import PropTypes from 'prop-types';
import FileList from './FileList';

const Gitea = ({ data, onDrop }) => {
  const [authentication, setAuthentication] = React.useState();
  const [repository, setRepository] = React.useState();
  return (
    <AuthenticationContextProvider
      config={{
        server: 'https://git.door43.org',
        tokenid: 'Gitea AG Testing',
      }}
      authentication={authentication}
      onAuthentication={setAuthentication}
    >
      <RepositoryContextProvider
        repository={repository}
        onRepository={setRepository}
        defaultOwner={authentication && authentication.user.name}
        defaultQuery=""
        branch=""
      >
        <FileList data={data} onDrop={onDrop} />
      </RepositoryContextProvider>
    </AuthenticationContextProvider>
  );
};
export default Gitea;
Gitea.propTypes = {
  /** State which has datas. */
  onDrop: PropTypes.object,
  data: PropTypes.object,
};
