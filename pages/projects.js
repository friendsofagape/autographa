import ProjectList from '@/modules/projects/ProjectList';
import AuthenticationContextProvider from '@/components/Login/AuthenticationContextProvider';
import AutographaContextProvider from '@/components/AutogrpahaContext/AutographaContext';

const projects = () => (
  <AuthenticationContextProvider>
    <AutographaContextProvider>
      <ProjectList />
    </AutographaContextProvider>
  </AuthenticationContextProvider>
);

export default projects;
