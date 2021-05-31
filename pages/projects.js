import ProjectList from '@/modules/projects/ProjectList';
import AuthenticationContextProvider from '@/components/Login/AuthenticationContextProvider';
import AutographaContextProvider from '../renderer/src/components/context/AutographaContext';

const projects = () => (
  <AuthenticationContextProvider>
    <AutographaContextProvider>
      <ProjectList />
    </AutographaContextProvider>
  </AuthenticationContextProvider>
);

export default projects;
