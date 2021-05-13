import NewProject from '@/modules/projects/NewProject';
import AuthenticationContextProvider from '@/components/Login/AuthenticationContextProvider';

const newproject = () => (
  <AuthenticationContextProvider>
    <NewProject />
  </AuthenticationContextProvider>
);

export default newproject;
