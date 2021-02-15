import Login from '../renderer/src/components/Login/Login';
import Meta from '../renderer/src/Meta';
import AuthenticationContextProvider from '../renderer/src/components/Login/AuthenticationContextProvider';

const index = () => (
  <div>
    <Meta />
    <AuthenticationContextProvider>
      <Login />
    </AuthenticationContextProvider>
  </div>
);

export default index;
