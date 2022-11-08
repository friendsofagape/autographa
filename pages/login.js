import Login from '@/components/Login/Login';
import AuthenticationContextProvider from '@/components/Login/AuthenticationContextProvider';

const login = () => (
  <AuthenticationContextProvider>
    <Login />
  </AuthenticationContextProvider>
);

export default login;
