import ProjectList from '@/modules/projects/ProjectList';
import AuthenticationContextProvider from '@/components/Login/AuthenticationContextProvider';

const projects = () => (
  <AuthenticationContextProvider>
    <ProjectList />
  </AuthenticationContextProvider>
);

export default projects;
