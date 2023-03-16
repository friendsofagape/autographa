import React from 'react';
import {
  AuthenticationContextProvider,
  RepositoryContextProvider,
} from 'gitea-react-toolkit';
import GiteaFileBrowser from './GiteaFileBrowser';
import { environment } from '../../../../environment';

const Gitea = () => {
  const [authentication, setAuthentication] = React.useState();
  const [repository, setRepository] = React.useState();
  return (
    <AuthenticationContextProvider
      config={{
        server: environment.GITEA_SERVER,
        tokenid: environment.GITEA_TOKEN,
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
        <GiteaFileBrowser changeRepo={() => setRepository()} />
      </RepositoryContextProvider>
    </AuthenticationContextProvider>
  );
};
export default Gitea;
