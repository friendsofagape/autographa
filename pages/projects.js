import ProjectList from '@/modules/projects/ProjectList';
import AuthenticationContextProvider from '@/components/Login/AuthenticationContextProvider';
import AutographaContextProvider from '@/components/context/AutographaContext';
import ReferenceContextProvider from '@/components/context/ReferenceContext';

const projects = () => (
  <AuthenticationContextProvider>
    <AutographaContextProvider>
      <ReferenceContextProvider>
        <ProjectList />
      </ReferenceContextProvider>
    </AutographaContextProvider>
  </AuthenticationContextProvider>
);

export default projects;
