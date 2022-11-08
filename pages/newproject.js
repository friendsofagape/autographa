import NewProject from '@/modules/projects/NewProject';
import AuthenticationContextProvider from '@/components/Login/AuthenticationContextProvider';
import ProjectContextProvider from '@/components/context/ProjectContext';
import ReferenceContextProvider from '@/components/context/ReferenceContext';

const newproject = () => (
  <AuthenticationContextProvider>
    <ProjectContextProvider>
      <ReferenceContextProvider>
        <NewProject />
      </ReferenceContextProvider>
    </ProjectContextProvider>
  </AuthenticationContextProvider>
);

export default newproject;
