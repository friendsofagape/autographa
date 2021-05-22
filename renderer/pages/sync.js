import Sync from '@/modules/projects/Sync';
import AuthenticationContextProvider from '@/components/Login/AuthenticationContextProvider';

const projects = () => (
  <AuthenticationContextProvider>
    <Sync />
  </AuthenticationContextProvider>
);

export default projects;
