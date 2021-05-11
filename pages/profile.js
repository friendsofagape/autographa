import Profile from '@/modules/projects/Profile';
import AuthenticationContextProvider from '@/components/Login/AuthenticationContextProvider';

const profile = () => (
  <AuthenticationContextProvider>
    <Profile />
  </AuthenticationContextProvider>
);

export default profile;
