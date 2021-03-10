// This component is added to bypass for UI development
import Login from '../src/components/Login/Login';
import AuthenticationContextProvider from '../src/components/Login/AuthenticationContextProvider';

const login = () => (
  <AuthenticationContextProvider>
    <Login />
  </AuthenticationContextProvider>
);

export default login;
