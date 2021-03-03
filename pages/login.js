import Login from '../renderer/src/components/Login/Login';
import AuthenticationContextProvider from '../renderer/src/components/Login/AuthenticationContextProvider';

const login = () => (
  <AuthenticationContextProvider>
    <Login />
  </AuthenticationContextProvider>
);

export default login;
