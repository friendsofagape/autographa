import Login from '../src/components/Login/Login';
import Meta from '../src/Meta';
import AuthenticationContextProvider from '../src/components/Login/AuthenticationContextProvider';

const login = () => (
  <>
    <Meta />
    <AuthenticationContextProvider>
      <Login />
    </AuthenticationContextProvider>
  </>
);

export default login;
