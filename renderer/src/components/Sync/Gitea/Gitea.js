import React from 'react';
import {
  AuthenticationContextProvider,
  RepositoryContextProvider,
} from 'gitea-react-toolkit';
// import FileHandle from './FileHandle';
import FileList from './FileList';

const Gitea = () => {
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
        <FileList />
      </RepositoryContextProvider>
    </AuthenticationContextProvider>
  );
};
export default Gitea;
